package com.parentsPearl.model;

import com.parentsPearl.model.enums.BehaviorType;
import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "behavior_records")
@Data
public class BehaviorRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "child_id")
    private Long childId;
    
    @Column(name = "logged_by_id")
    private Long loggedById;
    
    @Enumerated(EnumType.STRING)
    private BehaviorType type;
    
    private String description;
    private Integer points;
    
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
