package com.parentsPearl.model;

import com.parentsPearl.model.enums.Role;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    
    @Indexed(unique = true)
    private String email;
    private String password;
    private Role role;
    private Integer points = 0;
    private String userType; // For inheritance: "ADMIN", "PARENT", "CHILD"
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}