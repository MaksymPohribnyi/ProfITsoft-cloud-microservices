package com.pohribnyi.notification.service;

import com.pohribnyi.notification.dto.message.EmailMessageDTO;
import com.pohribnyi.notification.model.EmailDocument;
import com.pohribnyi.notification.model.enums.EmailStatus;
import com.pohribnyi.notification.repository.EmailDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailProcessingService {

    private final EmailDocumentRepository repository;
    private final JavaMailSender mailSender;

    public void processEmail(EmailMessageDTO message) {
        String recipient = message.recipient();
        log.info("Processing new message for email {}", recipient);

        EmailDocument doc = new EmailDocument();
        doc.setRecipient(recipient);
        doc.setSubject(message.subject());
        doc.setContent(message.content());
        doc.setStatus(EmailStatus.PENDING);
        doc.setAttempts(0);
        doc.setLastAttemptTime(LocalDateTime.now());

        doc = repository.save(doc);
        sendEmail(doc);
    }

    public void sendEmail(EmailDocument email) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(email.getRecipient());
            mailMessage.setSubject(email.getSubject());
            mailMessage.setText(email.getContent());

            mailSender.send(mailMessage);

            email.setStatus(EmailStatus.SENT);
            email.setErrorMessage(null);
            log.info("Email sent successfully to {}", email.getRecipient());
        } catch (Exception e) {
            String errorMessage = e.getClass().getSimpleName() + ": " + e.getMessage();
            email.setErrorMessage(errorMessage);
            email.setStatus(EmailStatus.FAILED);
            log.error("Email sending failed after {} attempts to: {}. Error: {}",
                    email.getAttempts() + 1, email.getRecipient(), errorMessage);
        }

        email.setAttempts(email.getAttempts() + 1);
        email.setLastAttemptTime(LocalDateTime.now());
        repository.save(email);
    }
}
