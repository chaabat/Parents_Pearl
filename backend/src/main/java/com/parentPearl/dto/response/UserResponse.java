package com.parentPearl.dto.response;

import java.time.LocalDate;

import com.parentPearl.model.enums.Role;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String picture;
    private LocalDate dateOfBirth;
    private Role role;
}