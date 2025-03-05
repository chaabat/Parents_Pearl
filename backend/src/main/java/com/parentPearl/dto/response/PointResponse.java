package com.parentPearl.dto.response;

import lombok.Data;
import lombok.Builder;
import java.util.Date;

@Data
@Builder
public class PointResponse {
    private Long id;
    private int points;
    private String reason;
    private Date date;
    private Long childId;
}