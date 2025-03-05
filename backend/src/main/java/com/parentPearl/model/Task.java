package com.parentPearl.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Builder;
import com.parentPearl.model.enums.TaskStatus;
import com.parentPearl.model.enums.TaskType;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tasks")
@Data
@Builder
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    private String description;
    
    @Column(name = "point_value")
    private int pointValue;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TaskStatus status = TaskStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "task_type")
    private TaskType taskType;
    
    @ElementCollection
    private List<String> choices;
    
    @Column(name = "correct_answer")
    private String correctAnswer;
    
    @ManyToOne
    @JoinColumn(name = "child_id")
    private Child child;
    
    
} 