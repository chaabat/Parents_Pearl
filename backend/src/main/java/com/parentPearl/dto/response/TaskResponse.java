package com.parentPearl.dto.response;

import com.parentPearl.model.enums.TaskStatus;
import com.parentPearl.model.enums.TaskType;
import lombok.Data;
import lombok.Builder;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private int pointValue;
    private LocalDate dueDate;
    private TaskStatus status;
    private TaskType taskType;
    private List<String> choices;
    private String correctAnswer;
    private Long childId;
}