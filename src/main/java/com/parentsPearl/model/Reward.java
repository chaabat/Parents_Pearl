package com.parentsPearl.model;
 

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reward")
@Data
public class Reward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "points_required", nullable = false)
    private int pointsRequired;

    @ManyToOne
    @JoinColumn(name = "claimed_by")
    private User claimedBy; // Child who claimed the reward

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
