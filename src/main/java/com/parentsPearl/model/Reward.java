package com.parentsPearl.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "rewards")
@Data
public class Reward {
    @Id
    private String id;
    private String name;
    private String description;
    private Integer pointsRequired;
    private Integer quantityAvailable;
    private String claimedById;  // Reference to User document
    
    @CreatedDate
    private LocalDateTime createdAt;

    
}
