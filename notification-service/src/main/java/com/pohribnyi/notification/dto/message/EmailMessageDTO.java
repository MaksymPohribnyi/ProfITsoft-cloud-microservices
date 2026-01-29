package com.pohribnyi.notification.dto.message;

public record EmailMessageDTO(String recipient, String subject, String content) {
}
