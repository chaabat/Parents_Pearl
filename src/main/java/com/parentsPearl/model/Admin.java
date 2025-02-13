package com.parentsPearl.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.EqualsAndHashCode;

import com.parentsPearl.model.enums.Role;

@Document(collection = "users")
@Data
@EqualsAndHashCode(callSuper = true)
public class Admin extends User {
    public Admin() {
        this.setRole(Role.ADMIN);
    }
}