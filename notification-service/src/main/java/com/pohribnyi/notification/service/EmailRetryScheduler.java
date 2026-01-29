package com.pohribnyi.notification.service;

import com.pohribnyi.notification.model.EmailDocument;
import com.pohribnyi.notification.model.enums.EmailStatus;
import com.pohribnyi.notification.repository.EmailDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailRetryScheduler {

    private final EmailProcessingService processingService;
    private final EmailDocumentRepository repository;

    @Value("${app.scheduler.email.maxAttempts}")
    private int maxAttempts;

    @Scheduled(fixedDelayString = "${app.scheduler.email.retry-interval:300000}")
    public void retryFailedEmail() {
        log.info("Starting retry job for failed email messages... ");
        List<EmailDocument> failedEmails = repository.findByStatus(EmailStatus.FAILED);

        if (failedEmails.isEmpty()) {
            log.info("No failed emails to retry");
            return;
        }

        for (EmailDocument failedEmail : failedEmails) {
            if (failedEmail.getAttempts() >= maxAttempts) {
                failedEmail.setStatus(EmailStatus.DEAD);
                repository.save(failedEmail);
                continue;
            }
            try {
                log.info("Retrying email to: {} (attempt {})", failedEmail.getRecipient(), failedEmail.getAttempts() + 1);
                processingService.sendEmail(failedEmail);
            } catch (Exception e) {
                log.error("Error during retry for email {}: {}", failedEmail.getId(), e.getMessage(), e);
            }
        }

    }

}
