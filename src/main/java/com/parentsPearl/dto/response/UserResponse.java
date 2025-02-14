package com.parentsPearl.dto.response;

import com.parentsPearl.model.enums.Role;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public void setToken(String newToken) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setToken'");
    }
}
