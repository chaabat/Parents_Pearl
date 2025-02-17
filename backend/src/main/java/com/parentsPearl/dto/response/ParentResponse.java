package com.parentsPearl.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class ParentResponse extends UserResponse {
    private String phoneNumber;
    private List<ChildResponse> children;
    private List<String> childrenIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 