package com.parentsPearl.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
public class Child extends User {
    private int age;
    private String gradeLevel;
    private String interests;
    private String parentId; // Reference to Parent document
    
    public Child() {
        this.setUserType("CHILD");
    }
}
