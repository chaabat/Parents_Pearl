package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.RewardRequest;
import com.parentsPearl.dto.response.RewardResponse;
 
import java.util.List;
import java.util.Optional;

public interface RewardService {
    List<RewardResponse> findAll();
    Optional<RewardResponse> findById(String id);
    RewardResponse save(RewardRequest reward);
    void deleteById(String id);
    RewardResponse update(String id, RewardRequest reward);
    RewardResponse claimReward(String rewardId, String claimedById);
}
