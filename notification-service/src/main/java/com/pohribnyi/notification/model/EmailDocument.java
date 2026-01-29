package com.pohribnyi.notification.model;

import com.pohribnyi.notification.model.enums.EmailStatus;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDateTime;

@Getter
@Setter
@Document(indexName = "email_logs")
public class EmailDocument {

    @Id
    private String id;

    @Field(type = FieldType.Keyword)
    private String recipient;

    @Field(type = FieldType.Text)
    private String errorMessage;

    @Field(type = FieldType.Text)
    private String subject;

    @Field(type = FieldType.Text)
    private String content;

    @Field(type = FieldType.Keyword)
    private EmailStatus status;

    @Field(type = FieldType.Integer)
    private Integer attempts;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second_millis)
    private LocalDateTime lastAttemptTime;

}
