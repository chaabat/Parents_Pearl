package com.parentsPearl.controller.child;

import com.parentsPearl.service.interfaces.RewardService;
import com.parentsPearl.dto.response.RewardResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/child/rewards")
@PreAuthorize("hasRole('CHILD')")
@RequiredArgsConstructor
public class RewardController {
    
    private final RewardService rewardService;
    
    @GetMapping("/available")
    public ResponseEntity<List<RewardResponse>> getAvailableRewards() {
        return ResponseEntity.ok(rewardService.findAll());
    }
    
    @PostMapping("/{id}/claim")
    public ResponseEntity<RewardResponse> claimReward(@PathVariable Long id) {
        return ResponseEntity.ok(rewardService.findById(id));
    }
    
    @GetMapping("/points")
    public ResponseEntity<RewardResponse> getPoints() {
        return ResponseEntity.ok(rewardService.findById(1L));
    }
    
    @GetMapping("/badges")
    public ResponseEntity<List<RewardResponse>> getBadges() {
        return ResponseEntity.ok(rewardService.findAll());
    }
} 