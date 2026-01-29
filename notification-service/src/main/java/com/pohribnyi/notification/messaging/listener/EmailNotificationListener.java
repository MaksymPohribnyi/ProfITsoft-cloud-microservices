package com.pohribnyi.notification.messaging.listener;

import com.pohribnyi.notification.service.EmailProcessingService;
import com.pohribnyi.notification.dto.message.EmailMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class EmailNotificationListener {

    private final EmailProcessingService emailProcessingService;

    @KafkaListener(topics = "${kafka.topic.emailNotifTopic}")
    public void handleEmailNotification(EmailMessageDTO message) {
        log.info("Received email request for: {}", message.recipient());
        emailProcessingService.processEmail(message);
    }
}
