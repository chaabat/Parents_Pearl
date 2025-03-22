package com.parentPearl.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "reward_redemptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RewardRedemption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "child_id")
    private Child child;
    
    @ManyToOne
    @JoinColumn(name = "reward_id")
    private Reward reward;
    
    @Column(name = "points_spent")
    private int pointsSpent;
    
    @Column(name = "redeemed_at")
    private LocalDateTime redeemedAt;
    
    private String message;
    
    @Column(name = "redemption_date")
    private LocalDateTime redemptionDate;
} 