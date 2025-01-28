package com.parentsPearl.model;

 

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.parentsPearl.model.enums.TaskStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status; // Enum: PENDING, COMPLETED

    @ManyToOne
    @JoinColumn(name = "assigned_to", nullable = false)
    private User assignedTo; // Child

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy; // Parent

    @Column(nullable = false)
    private int points; // Reward points for completing the task

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

     
}
