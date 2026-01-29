package com.pohribnyi.notification.integration;

import com.pohribnyi.notification.dto.message.EmailMessageDTO;
import com.pohribnyi.notification.model.EmailDocument;
import com.pohribnyi.notification.model.enums.EmailStatus;
import com.pohribnyi.notification.repository.EmailDocumentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaOperations;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

public class EmailNotificationServiceTest extends BaseIntegrationTest {

    @Autowired
    private KafkaOperations<String, EmailMessageDTO> kafkaOperations;

    @MockitoBean
    private JavaMailSender mailSender;

    @Value("${kafka.topic.emailNotifTopic}")
    private String emailTopic;

    @Test
    @DisplayName("Test succesful send email functionality")
    public void shouldProcessAndSendEmail() {
        // given
        String recipient = "test.email@gmail.com";
        String subject = "Welcome Test";
        String content = "Hello world!";
        EmailMessageDTO messageDTO = new EmailMessageDTO(recipient, subject, content);

        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        // when
        kafkaOperations.send(emailTopic, messageDTO);

        //then
        await()
                .atMost(10, TimeUnit.SECONDS)
                .pollInterval(Duration.ofMillis(500))
                .untilAsserted(() -> {
                    List<EmailDocument> docs = emailRepository.findByStatus(EmailStatus.SENT);
                    assertThat(docs).hasSize(1);

                    EmailDocument doc = docs.getFirst();
                    assertThat(doc.getRecipient()).isEqualTo(recipient);
                    assertThat(doc.getAttempts()).isEqualTo(1);
                    assertThat(doc.getErrorMessage()).isNull();
                    assertThat(doc.getSubject()).isEqualTo(subject);
                    assertThat(doc.getContent()).isEqualTo(content);
                    assertThat(doc.getStatus()).isEqualTo(EmailStatus.SENT);
                    assertThat(doc.getLastAttemptTime()).isNotNull();
                });

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    @DisplayName("Test retry failed emails functionality")
    void shouldRetryFailedEmails() {
        // Given
        String recipient = "retry-test@gmail.com";
        String subject = "Retry TEST Subject";
        String content = "Retry TEST Body";
        EmailMessageDTO message = new EmailMessageDTO(recipient, subject, content);

        doThrow(new MailSendException("Temporary SMTP failure"))
                .doNothing()
                .when(mailSender).send(any(SimpleMailMessage.class));

        // When
        kafkaOperations.send(emailTopic, message);

        await()
                .alias("Wait for initial failure")
                .atMost(10, TimeUnit.SECONDS)
                .untilAsserted(() -> {
                    var failedDocs = emailRepository.findByStatus(EmailStatus.FAILED);
                    assertThat(failedDocs).hasSize(1);

                    EmailDocument doc = failedDocs.getFirst();
                    assertThat(doc.getRecipient()).isEqualTo(recipient);
                    assertThat(doc.getAttempts()).isEqualTo(1);
                    assertThat(doc.getSubject()).isEqualTo(subject);
                    assertThat(doc.getContent()).isEqualTo(content);
                    assertThat(doc.getStatus()).isEqualTo(EmailStatus.FAILED);
                    assertThat(doc.getErrorMessage()).contains("Temporary SMTP failure");
                });

        await()
                .alias("Wait for scheduler retry success")
                .atMost(5, TimeUnit.SECONDS)
                .untilAsserted(() -> {
                    var sentDocs = emailRepository.findByStatus(EmailStatus.SENT);

                    assertThat(sentDocs).hasSize(1);
                    EmailDocument doc = sentDocs.getFirst();
                    assertThat(doc.getRecipient()).isEqualTo(recipient);
                    assertThat(doc.getAttempts()).isEqualTo(2);
                    assertThat(doc.getSubject()).isEqualTo(subject);
                    assertThat(doc.getContent()).isEqualTo(content);
                    assertThat(doc.getStatus()).isEqualTo(EmailStatus.SENT);
                    assertThat(doc.getErrorMessage()).isNull();
                });

        verify(mailSender, times(2)).send(any(SimpleMailMessage.class));
    }

    @Test
    @DisplayName("Test max attempts reached functionality")
    void shouldMarkAsDeadAfterMaxAttempts() {
        String recipient = "dead-email@gmail.com";
        String subject = "Dead Test Subject";
        String content = "Dead Test Body";
        EmailMessageDTO message = new EmailMessageDTO(recipient, subject, content);

        doThrow(new MailSendException("Permanent SMTP error"))
                .when(mailSender).send(any(SimpleMailMessage.class));

        // when
        kafkaOperations.send(emailTopic, message);

        // then
        await().alias("Wait for status DEAD")
                .atMost(15, TimeUnit.SECONDS)
                .pollInterval(Duration.ofSeconds(1))
                .untilAsserted(() -> {
                    List<EmailDocument> deadDocs = emailRepository.findByStatus(EmailStatus.DEAD);
                    assertThat(deadDocs).hasSize(1);

                    EmailDocument doc = deadDocs.getFirst();
                    assertThat(doc.getRecipient()).isEqualTo(recipient);
                    assertThat(doc.getSubject()).isEqualTo(subject);
                    assertThat(doc.getContent()).isEqualTo(content);
                    assertThat(doc.getStatus()).isEqualTo(EmailStatus.DEAD);
                    assertThat(doc.getAttempts()).isEqualTo(3);
                    assertThat(doc.getErrorMessage()).contains("Permanent SMTP error");
                });
        verify(mailSender, times(3)).send(any(SimpleMailMessage.class));

    }
}
