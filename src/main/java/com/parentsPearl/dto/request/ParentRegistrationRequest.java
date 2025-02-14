package com.parentsPearl.dto.request;

import lombok.Data;

@Data
public class ParentRegistrationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}