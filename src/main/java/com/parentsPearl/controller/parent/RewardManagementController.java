package com.parentsPearl.controller.parent;

import com.parentsPearl.service.interfaces.RewardService;
import com.parentsPearl.dto.request.RewardRequest;
import com.parentsPearl.dto.response.RewardResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/parent/rewards")
@PreAuthorize("hasRole('PARENT')")
@RequiredArgsConstructor
public class RewardManagementController {
    
    private final RewardService rewardService;
    
    @PostMapping
    public ResponseEntity<RewardResponse> createReward(@RequestBody RewardRequest request) {
        return ResponseEntity.ok(rewardService.save(request));
    }
    
    @GetMapping
    public ResponseEntity<List<RewardResponse>> getAllRewards() {
        return ResponseEntity.ok(rewardService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RewardResponse> getRewardById(@PathVariable String id) {
        return ResponseEntity.ok(rewardService.findById(id)
            .orElseThrow(() -> new RuntimeException("Reward not found")));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RewardResponse> updateReward(@PathVariable String id, @RequestBody RewardRequest request) {
        return ResponseEntity.ok(rewardService.update(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReward(@PathVariable String id) {
        rewardService.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/history/{childId}")
    public ResponseEntity<List<RewardResponse>> getRewardHistory(@PathVariable String childId) {
        return ResponseEntity.ok(rewardService.findAll());
    }
} 