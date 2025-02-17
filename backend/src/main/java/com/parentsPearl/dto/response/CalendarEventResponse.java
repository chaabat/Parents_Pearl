package com.parentsPearl.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CalendarEventResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 