package com.parentsPearl.model;

 

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import com.parentsPearl.model.enums.BehaviorType;

import java.time.LocalDateTime;

@Entity
@Table(name = "behavior_records")
@Data
public class BehaviorRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "child_id", nullable = false)
    private User child;

    @Enumerated(EnumType.STRING)
    @Column(name = "behavior_type", nullable = false)
    private BehaviorType behaviorType; // Enum: POSITIVE, NEGATIVE

    private String description;

    @ManyToOne
    @JoinColumn(name = "logged_by", nullable = false)
    private User loggedBy; // Parent

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    
}
