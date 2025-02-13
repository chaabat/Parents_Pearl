package com.parentsPearl.model;

import com.parentsPearl.model.enums.Role;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import java.time.LocalDateTime;

@Document(collection = "users")
@Data
public abstract class User {
    @Id
    private String id;
    
    private String firstName;
    private String lastName;
    
    @Indexed(unique = true)
    private String email;
    private String password;
    private Role role;
    private Integer points = 0;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}