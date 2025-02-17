package com.parentsPearl.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import jakarta.persistence.*;
import com.parentsPearl.model.enums.Role;

@Entity
@Table(name = "admins")
@Data
@EqualsAndHashCode(callSuper = true)
public class Admin extends User {
    
    public Admin() {
        this.setRole(Role.ADMIN);
    }
}