package com.parentsPearl.dto.response;

import com.parentsPearl.model.enums.TaskStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private TaskStatus status;
    private Long assignedToId;
    private String assignedToName;
    private Long createdById;
    private String createdByName;
    private int points;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 