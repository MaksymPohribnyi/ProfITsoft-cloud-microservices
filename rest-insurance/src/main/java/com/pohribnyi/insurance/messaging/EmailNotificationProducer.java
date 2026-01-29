package com.pohribnyi.insurance.messaging;

import com.pohribnyi.insurance.dto.message.EmailMessageDTO;
import com.pohribnyi.insurance.model.entity.Client;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaOperations;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailNotificationProducer {

    @Value("${kafka.topic.emailNotifTopic}")
    private String emailNotifTopic;

    private final KafkaOperations<String, EmailMessageDTO> kafkaOperations;

    public void sendWelcomeNotification(Client client) {
        EmailMessageDTO message = createWelcomeEmailMessage(client);
        try {
            kafkaOperations.send(emailNotifTopic, message);
        } catch (Exception e) {
            log.error("Failed to send email notification", e);
        }
    }

    private EmailMessageDTO createWelcomeEmailMessage(Client client) {
        String subject = "Welcome to Our Insurance Platform!";
        String content = String.format("""
                Greeting, %s %s !
                You`re successfully registered as new client in our insurance company!""",
                client.getFirstName(), client.getLastName());
        return new EmailMessageDTO(
                client.getEmail(),
                subject,
                content);
    }

}
