package com.parentsPearl.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ChildRequest extends UserRequest {
    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be positive")
    private int age;

    @NotBlank(message = "Grade level is required")
    private String gradeLevel;
    
    private String interests;
    
    @NotNull(message = "Parent ID is required")
    private Long parentId;
} 