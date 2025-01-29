package com.parentsPearl.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("ADMIN")
public class Admin extends User {
    @Column(name = "admin_level")
    private String adminLevel; // Example: "SUPER_ADMIN", "SUPPORT_ADMIN"
}