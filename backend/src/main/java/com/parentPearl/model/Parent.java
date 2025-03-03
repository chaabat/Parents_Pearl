package com.parentPearl.model;

import java.util.ArrayList;
import java.util.List;
import lombok.experimental.SuperBuilder;
import lombok.Builder;
 
import lombok.Data;
import lombok.EqualsAndHashCode;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import jakarta.persistence.DiscriminatorValue;

@Entity
@DiscriminatorValue("PARENT")
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Parent extends User {
    @OneToMany(mappedBy = "parent", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private List<Child> children = new ArrayList<>();
}