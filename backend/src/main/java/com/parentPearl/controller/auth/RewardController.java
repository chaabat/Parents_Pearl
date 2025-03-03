package com.parentPearl.controller.auth;

import com.parentPearl.dto.request.RewardRequest;
import com.parentPearl.dto.request.RewardRedemptionRequest;
import com.parentPearl.dto.response.RewardResponse;
import com.parentPearl.dto.response.RewardRedemptionResponse;
import com.parentPearl.service.interfaces.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    // Parent endpoints
    @PreAuthorize("hasRole('PARENT')")
    @PostMapping("/api/parents/{parentId}/rewards")
    public ResponseEntity<RewardResponse> createReward(
            @PathVariable Long parentId,
            @RequestBody RewardRequest request) {
        return ResponseEntity.ok(rewardService.createReward(parentId, request));
    }

    @PreAuthorize("hasRole('PARENT')")
    @PutMapping("/api/parents/{parentId}/rewards/{rewardId}")
    public ResponseEntity<RewardResponse> updateReward(
            @PathVariable Long parentId,
            @PathVariable Long rewardId,
            @RequestBody RewardRequest request) {
        return ResponseEntity.ok(rewardService.updateReward(parentId, rewardId, request));
    }

    @PreAuthorize("hasRole('PARENT')")
    @DeleteMapping("/api/parents/{parentId}/rewards/{rewardId}")
    public ResponseEntity<Void> deleteReward(
            @PathVariable Long parentId,
            @PathVariable Long rewardId) {
        rewardService.deleteReward(parentId, rewardId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/api/parents/{parentId}/rewards")
    public ResponseEntity<List<RewardResponse>> getAllRewards(
            @PathVariable Long parentId) {
        return ResponseEntity.ok(rewardService.getAllRewards(parentId));
    }

    // Child endpoints
    @PreAuthorize("hasRole('CHILD')")
    @PostMapping("/api/children/{childId}/rewards/redeem")
    public ResponseEntity<RewardRedemptionResponse> redeemReward(
            @PathVariable Long childId,
            @RequestBody RewardRedemptionRequest request) {
        return ResponseEntity.ok(rewardService.redeemReward(childId, request));
    }

    @PreAuthorize("hasRole('CHILD')")
    @GetMapping("/api/children/{childId}/rewards")
    public ResponseEntity<List<RewardResponse>> getAvailableRewards(
            @PathVariable Long childId) {
        return ResponseEntity.ok(rewardService.getAvailableRewards(childId));
    }

    @PreAuthorize("hasRole('CHILD')")
    @GetMapping("/api/children/{childId}/rewards/history")
    public ResponseEntity<List<RewardRedemptionResponse>> getRedemptionHistory(
            @PathVariable Long childId) {
        return ResponseEntity.ok(rewardService.getMyRedemptionHistory(childId));
    }
}
