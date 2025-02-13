package com.parentsPearl.model;

 
import lombok.Data;
 
import org.springframework.data.mongodb.core.mapping.Document;

 
import java.util.List;

@Document(collection = "users")
@Data
public class Parent extends User {
    private String phoneNumber;
    private List<String> childrenIds; // References to Child documents
    
    public Parent() {
        this.setUserType("PARENT");
    }
}