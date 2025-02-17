package com.parentsPearl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ParentsPearlApplication {
    public static void main(String[] args) {
        SpringApplication.run(ParentsPearlApplication.class, args);
    }
}