package com.parentsPearl.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class ParentRequest extends UserRequest {
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number")
    private String phoneNumber;
    
    private List<String> childrenIds;
} 