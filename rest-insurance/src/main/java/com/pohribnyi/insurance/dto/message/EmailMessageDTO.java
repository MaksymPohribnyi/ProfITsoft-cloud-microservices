package com.pohribnyi.insurance.dto.message;

public record EmailMessageDTO(String recipient, String subject, String content) {
}
