package com.parentsPearl.model;

 

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "children")
@Data
public class Child extends User {
    @Column(name = "age")
    private int age;

    @Column(name = "grade_level")
    private String gradeLevel;

    @Column(name = "interests")
    private String interests;

    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent; // The parent managing this child
}
