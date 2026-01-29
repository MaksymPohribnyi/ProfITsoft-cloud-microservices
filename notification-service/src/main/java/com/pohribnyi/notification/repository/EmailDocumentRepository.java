package com.pohribnyi.notification.repository;

import com.pohribnyi.notification.model.EmailDocument;
import com.pohribnyi.notification.model.enums.EmailStatus;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface EmailDocumentRepository extends ElasticsearchRepository<EmailDocument, String> {

    public List<EmailDocument> findByStatus(EmailStatus status);

}
