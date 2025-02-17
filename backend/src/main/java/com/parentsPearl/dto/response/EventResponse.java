package com.parentsPearl.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventResponse {
    private String id;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isReminder;
    private LocalDateTime createdAt;
} 