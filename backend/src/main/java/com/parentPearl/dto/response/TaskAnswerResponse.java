package com.parentPearl.dto.response;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class TaskAnswerResponse {
    private boolean correct;
    private String message;
    private Integer pointsEarned;
    private TaskResponse task;
} 