package com.parentsPearl.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.EqualsAndHashCode;

import com.parentsPearl.model.enums.Role;

import java.util.List;

@Document(collection = "users")
@Data
@EqualsAndHashCode(callSuper = true)
public class Parent extends User {
    private String phoneNumber;
    private List<String> childrenIds; // References to Child documents
    
    public Parent() {
        this.setRole(Role.PARENT);
    }
}