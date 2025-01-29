package com.parentsPearl.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class ParentResponse extends UserResponse {
    private String phoneNumber;
    private List<ChildResponse> children;
} 