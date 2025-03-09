package com.parentPearl.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.parentPearl.model.enums.TaskStatus;
import com.parentPearl.model.enums.TaskType;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String description;
    
    @Column(name = "point_value", nullable = false)
    private Integer pointValue;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskType taskType;
    
    @ElementCollection
    private List<String> choices;
    
    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;
    
    @ManyToOne
    @JoinColumn(name = "child_id")
    private Child child;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.PENDING;
    
} 