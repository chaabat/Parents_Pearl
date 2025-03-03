package com.parentPearl.service.interfaces;

import com.parentPearl.dto.request.RewardRequest;
import com.parentPearl.dto.request.RewardRedemptionRequest;
import com.parentPearl.dto.response.RewardResponse;
import com.parentPearl.dto.response.RewardRedemptionResponse;
import java.util.List;

public interface RewardService {
    // Parent operations
    RewardResponse createReward(Long parentId, RewardRequest request);
    RewardResponse updateReward(Long parentId, Long rewardId, RewardRequest request);
    void deleteReward(Long parentId, Long rewardId);
    List<RewardResponse> getAllRewards(Long parentId);
    
    // Child operations
    RewardRedemptionResponse redeemReward(Long childId, RewardRedemptionRequest request);
    List<RewardResponse> getAvailableRewards(Long childId);
    List<RewardRedemptionResponse> getMyRedemptionHistory(Long childId);
} 