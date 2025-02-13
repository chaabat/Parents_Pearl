package com.parentsPearl.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "calendar_events")
@Data
public class CalendarEvent {
    @Id
    private String id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private String createdById;  // Reference to User document
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
