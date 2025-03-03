package com.parentPearl.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "rewards")
@Data
public class Reward {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    private String description;
    
    @Column(name = "point_cost")
    private int pointCost;
    
    @Column(name = "parent_id")
    private Long parentId;
    
    @ManyToOne
    @JoinColumn(name = "parent_id", insertable = false, updatable = false)
    private Parent parent;
} 