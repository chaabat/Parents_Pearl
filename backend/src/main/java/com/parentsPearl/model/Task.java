package com.parentsPearl.model;

import com.parentsPearl.model.enums.TaskStatus;
import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private Integer points;
    
    @Column(name = "assigned_to_id")
    private Long assignedToId;
    
    @Column(name = "created_by_id")
    private Long createdById;
    
    private LocalDateTime deadline;
    
    @Enumerated(EnumType.STRING)
    private TaskStatus status;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = TaskStatus.PENDING;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
