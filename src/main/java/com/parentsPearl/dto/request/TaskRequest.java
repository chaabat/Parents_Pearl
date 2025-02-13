package com.parentsPearl.dto.request;

import com.parentsPearl.model.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private LocalDateTime dueDate;
    
    @NotNull(message = "Status is required")
    private TaskStatus status;
    
    @NotBlank(message = "Assigned user ID is required")
    private String assignedToId;
    
    @NotNull(message = "Points value is required")
    private Integer points;
} 