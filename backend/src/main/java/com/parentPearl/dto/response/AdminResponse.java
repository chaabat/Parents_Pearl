package com.parentPearl.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class AdminResponse extends UserResponse {
    // Additional admin-specific fields if any
}