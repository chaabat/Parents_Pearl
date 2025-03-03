package com.parentPearl.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class RegisterRequest extends AuthRequest {
    @NotBlank(message = "Name is required")
    private String name;
} 