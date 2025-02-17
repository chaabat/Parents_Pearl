package com.parentsPearl.dto.response;

import lombok.Data;
import java.util.Map;

@Data
public class AnalyticsResponse {
    private Map<String, Object> metrics;
    private String period;
    private Long totalCount;
    private String analysisResult;
} 