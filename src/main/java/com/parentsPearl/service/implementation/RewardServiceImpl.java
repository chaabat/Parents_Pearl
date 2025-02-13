package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.RewardRequest;
import com.parentsPearl.dto.response.RewardResponse;
import com.parentsPearl.model.Reward;
import com.parentsPearl.model.User;
import com.parentsPearl.repository.RewardRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.RewardService;
import com.parentsPearl.mapper.RewardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RewardServiceImpl implements RewardService {
    
    private final RewardRepository rewardRepository;
    private final RewardMapper rewardMapper;
    private final UserRepository userRepository;
    
    @Override
    public List<RewardResponse> findAll() {
        return rewardRepository.findAll().stream()
                .map(rewardMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<RewardResponse> findById(String id) {
        return rewardRepository.findById(id)
                .map(rewardMapper::toResponse);
    }
    
    @Override
    public RewardResponse save(RewardRequest request) {
        Reward entity = rewardMapper.toEntity(request);
        Reward saved = rewardRepository.save(entity);
        return rewardMapper.toResponse(saved);
    }
    
    @Override
    public void deleteById(String id) {
        rewardRepository.deleteById(id);
    }

    @Override
    public RewardResponse update(String id, RewardRequest request) {
        return rewardRepository.findById(id)
                .map(existingReward -> {
                    existingReward.setName(request.getName());
                    existingReward.setDescription(request.getDescription());
                    existingReward.setPointsRequired(request.getPointsRequired());
                    existingReward.setQuantityAvailable(request.getQuantityAvailable());
                    
                    Reward updated = rewardRepository.save(existingReward);
                    return rewardMapper.toResponse(updated);
                })
                .orElseThrow(() -> new RuntimeException("Reward not found with id: " + id));
    }

    @Override
    public RewardResponse claimReward(String rewardId, String claimedById) {
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new RuntimeException("Reward not found"));
                
        if (reward.getQuantityAvailable() <= 0) {
            throw new RuntimeException("Reward is no longer available");
        }
        
        User claimingUser = userRepository.findById(claimedById)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (claimingUser.getPoints() < reward.getPointsRequired()) {
            throw new RuntimeException("Insufficient points to claim reward");
        }
        
        reward.setQuantityAvailable(reward.getQuantityAvailable() - 1);
        reward.setClaimedById(claimedById);
        claimingUser.setPoints(claimingUser.getPoints() - reward.getPointsRequired());
        
        userRepository.save(claimingUser);
        Reward updated = rewardRepository.save(reward);
        
        return rewardMapper.toResponse(updated);
    }
} 