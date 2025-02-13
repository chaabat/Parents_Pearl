package com.parentsPearl.model;

import com.parentsPearl.model.enums.ResourceType;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "educational_resources")
@Data
public class EducationalResource {
    @Id
    private String id;
    private String title;
    private String description;
    private ResourceType resourceType;
    private String url;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}