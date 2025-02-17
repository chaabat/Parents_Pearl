package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.RewardRequest;
import com.parentsPearl.dto.response.RewardResponse;

import java.util.List;

public interface RewardService {
    List<RewardResponse> findAll();
    RewardResponse findById(Long id);
    RewardResponse save(RewardRequest request);
    void deleteById(Long id);
    RewardResponse update(Long id, RewardRequest request);
    RewardResponse claimReward(Long rewardId, Long claimedById);
    List<RewardResponse> findByChildId(Long childId);
}
