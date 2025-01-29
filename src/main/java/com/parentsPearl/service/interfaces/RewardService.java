package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.RewardRequest;
import com.parentsPearl.dto.response.RewardResponse;
 
import java.util.List;
import java.util.Optional;

public interface RewardService {
    List<RewardResponse> findAll();
    Optional<RewardResponse> findById(Long id);
    RewardResponse save(RewardRequest reward);
    void deleteById(Long id);
    RewardResponse update(Long id, RewardRequest reward);
    RewardResponse claimReward(Long rewardId, Long claimedById);
}
