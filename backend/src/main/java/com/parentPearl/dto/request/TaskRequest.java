package com.parentPearl.dto.request;

import com.parentPearl.model.enums.TaskType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @Positive(message = "Point value must be positive")
    private int pointValue;
    
    private LocalDate dueDate;
    
    @NotNull(message = "Task type is required")
    private TaskType taskType;
    
    private List<String> choices;
    
    private String correctAnswer;
    
    @NotNull(message = "Child ID is required")
    private Long childId;
}