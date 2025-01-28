package com.parentsPearl.model;

 

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "parents")
@Data
public class Parent extends User {
    @Column(name = "phone_number")
    private String phoneNumber;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Child> children; // List of children managed by this parent
}