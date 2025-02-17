package com.parentsPearl.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import jakarta.persistence.*;

import com.parentsPearl.model.enums.Role;

import java.util.List;

@Entity
@Table(name = "children")
@Data
@EqualsAndHashCode(callSuper = true)
public class Child extends User {
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Parent parent;
    
    @Column(name = "points")
    private Integer points = 0;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    private Integer age;
    private String gradeLevel;
    
    @ElementCollection
    private List<String> interests;
    
    public Child() {
        this.setRole(Role.CHILD);
    }
}
