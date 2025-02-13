package com.parentsPearl.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.parentsPearl.model.enums.BehaviorType;

import java.time.LocalDateTime;

@Document(collection = "behavior_records")
@Data
public class BehaviorRecord {
    @Id
    private String id;
    
    private String description;
    private String childId;
    private BehaviorType type;  
    private Integer pointsImpact;
    private LocalDateTime occurredAt;
    private String loggedById;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
