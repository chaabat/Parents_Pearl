package com.parentsPearl.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.EqualsAndHashCode;

import com.parentsPearl.model.enums.Role;

import java.util.List;

@Document(collection = "users")
@Data
@EqualsAndHashCode(callSuper = true)
public class Child extends User {
    private Integer age;
    private String gradeLevel;
    private List<String> interests;
    private String parentId; // Reference to Parent document
    
    public Child() {
        this.setRole(Role.CHILD);
    }
}
