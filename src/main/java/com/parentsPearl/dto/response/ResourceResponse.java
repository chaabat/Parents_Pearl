package com.parentsPearl.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ResourceResponse {
    private String id;
    private String name;
    private String type;
    private String description;
    private String content;
    private String category;
    private Integer ageRange;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 