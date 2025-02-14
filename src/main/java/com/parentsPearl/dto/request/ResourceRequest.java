package com.parentsPearl.dto.request;

import lombok.Data;

@Data
public class ResourceRequest {
    private String name;
    private String type;
    private String description;
    private String content;
    private String category;
    private Integer ageRange;
    private Boolean isPublic;
} 