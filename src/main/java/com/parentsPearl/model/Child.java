package com.parentsPearl.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@DiscriminatorValue("CHILD")
@Table(name = "child")
@Data
public class Child extends User{

    @Column(name = "age")
    private Integer age;

  

}
