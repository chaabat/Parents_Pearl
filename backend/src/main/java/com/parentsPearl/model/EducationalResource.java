package com.parentsPearl.model;

import com.parentsPearl.model.enums.ResourceType;
import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "educational_resources")
@Data
public class EducationalResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private String url;
    
    @Enumerated(EnumType.STRING)
    private ResourceType type;
    
    @Column(name = "age_range_min")
    private Integer ageRangeMin;
    
    @Column(name = "age_range_max")
    private Integer ageRangeMax;
    
    private String subject;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}