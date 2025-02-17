package com.parentsPearl.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.parentsPearl.model.enums.Role;

@Entity
@Table(name = "parents")
@Data
@EqualsAndHashCode(callSuper = true)
public class Parent extends User {
    @OneToMany(mappedBy = "parent")
    private List<Child> children = new ArrayList<>();
    
    public Parent() {
        this.setRole(Role.PARENT);
    }
}