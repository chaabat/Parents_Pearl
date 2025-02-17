package com.parentsPearl.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AnalyticsRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private String metricType;
    private String reportType;
} 