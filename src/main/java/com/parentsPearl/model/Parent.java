package com.parentsPearl.model;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@DiscriminatorValue("PARENT")
@Table(name = "parent")
@Data
public class Parent extends User{

    @OneToMany(mappedBy = "parent")
    private List<Child> children;

}
