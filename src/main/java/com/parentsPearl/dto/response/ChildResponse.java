package com.parentsPearl.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ChildResponse extends UserResponse {
    private int age;
    private String gradeLevel;
    private String interests;
    private Long parentId;
    private String parentName;
} 