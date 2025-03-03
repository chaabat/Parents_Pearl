package com.parentPearl.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("CHILD")
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Child extends User {
    
    @Column(name = "total_points")
    private int totalPoints ;
    
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Parent parent;
    
    @OneToMany(mappedBy = "child", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private List<Task> tasks = new ArrayList<>();
    
    @OneToMany(mappedBy = "child", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private List<Point> points = new ArrayList<>();
    
    @OneToMany(mappedBy = "child", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private List<RewardRedemption> rewardRedemptions = new ArrayList<>();
    
    public void addPoints(int points) {
        this.totalPoints += points;
    }
} 