package com.parentPearl.dto.request;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AdminRequest extends BaseUserRequest {
    // Inherits all fields from BaseUserRequest
}