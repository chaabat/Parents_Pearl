package com.parentsPearl.model;
 

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "admins")
@Data
public class Admin extends User {
    @Column(name = "admin_level")
    private String adminLevel; // Example: "SUPER_ADMIN", "SUPPORT_ADMIN"
}