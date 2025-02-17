package com.parentsPearl.dto.response;

import com.parentsPearl.model.enums.Role;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private String status;
    private String token;
    private Integer points;
}
