package com.parentsPearl.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class ChildResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private Integer age;
    private String gradeLevel;
    private List<String> interests;
    private String parentName;
    private String avatarUrl;
    private String token;
    private Integer points;
} 