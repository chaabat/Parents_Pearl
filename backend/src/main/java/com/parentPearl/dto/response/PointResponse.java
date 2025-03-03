package com.parentPearl.dto.response;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@Builder
public class PointResponse {
    private Long id;
    private int points;
    private String reason;
    private LocalDateTime date;
    private Long childId;
}