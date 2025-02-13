package com.parentsPearl.model;

import com.parentsPearl.model.enums.BehaviorType;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "behavior_records")
@Data
public class BehaviorRecord {
    @Id
    private String id;
    private String childId;  // Reference to User document
    private BehaviorType behaviorType;
    private String description;
    private String loggedById;  // Reference to User document
    
    @CreatedDate
    private LocalDateTime createdAt;
}
