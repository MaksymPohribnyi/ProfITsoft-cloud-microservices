package com.pohribnyi.notification.integration;

import com.pohribnyi.notification.repository.EmailDocumentRepository;
import org.apache.kafka.common.serialization.StringSerializer;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.support.serializer.JacksonJsonSerializer;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.elasticsearch.ElasticsearchContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.kafka.ConfluentKafkaContainer;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest
@Testcontainers
public abstract class BaseIntegrationTest {

    @Container
    static ConfluentKafkaContainer kafka = new ConfluentKafkaContainer(
            DockerImageName.parse("confluentinc/cp-kafka:7.7.7"));

    @Container
    static ElasticsearchContainer elasticsearch = new ElasticsearchContainer(
            DockerImageName.parse("elasticsearch:9.2.3")
    )
            .withEnv("discovery.type", "single-node")
            .withEnv("xpack.security.enabled", "false")
            .withEnv("ES_JAVA_OPTS", "-Xms256m -Xmx256m");


    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
        registry.add("spring.elasticsearch.uris", elasticsearch::getHttpHostAddress);
        registry.add("app.scheduler.email.retry-interval", () -> "1000");
        registry.add("app.scheduler.email.maxAttempts", () -> "3");
        registry.add("spring.kafka.producer.key-serializer", StringSerializer.class::getName);
        registry.add("spring.kafka.producer.value-serializer", JacksonJsonSerializer.class::getName);
        registry.add("spring.kafka.consumer.auto-offset-reset", () -> "earliest");
        registry.add("spring.kafka.producer.properties.spring.json.add.type.headers", () -> "false");
    }

    @Autowired
    protected EmailDocumentRepository emailRepository;

    @BeforeEach
    void setUp() {
        emailRepository.deleteAll();
    }

}
