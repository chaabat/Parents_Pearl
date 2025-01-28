package com.parentsPearl.dto.request;

import com.parentsPearl.model.enums.TaskStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @Future(message = "Due date must be in the future")
    private LocalDateTime dueDate;
    
    private TaskStatus status;
    
    @NotNull(message = "Assigned user ID is required")
    private Long assignedToId;
    
    @Min(value = 0, message = "Points must be positive")
    private int points;
} 