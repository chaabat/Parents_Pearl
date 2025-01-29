package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.RewardRequest;
import com.parentsPearl.dto.response.RewardResponse;
import com.parentsPearl.model.Reward;
import com.parentsPearl.model.User;
import com.parentsPearl.repository.RewardRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.RewardService;
import com.parentsPearl.mapper.RewardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RewardServiceImpl implements RewardService {
    
    private final RewardRepository rewardRepository;
    private final RewardMapper rewardMapper;
    private final UserRepository userRepository;
    
    @Autowired
    public RewardServiceImpl(RewardRepository rewardRepository,
                           RewardMapper rewardMapper,
                           UserRepository userRepository) {
        this.rewardRepository = rewardRepository;
        this.rewardMapper = rewardMapper;
        this.userRepository = userRepository;
    }
    
    @Override
    public List<RewardResponse> findAll() {
        return rewardRepository.findAll().stream()
                .map(rewardMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<RewardResponse> findById(Long id) {
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
    public void deleteById(Long id) {
        rewardRepository.deleteById(id);
    }

    @Override
    public RewardResponse update(Long id, RewardRequest request) {
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
    public RewardResponse claimReward(Long rewardId, Long claimedById) {
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new RuntimeException("Reward not found"));
                
        // Check if reward is available
        if (reward.getQuantityAvailable() <= 0) {
            throw new RuntimeException("Reward is no longer available");
        }
        
        // Get the claiming user
        User claimingUser = userRepository.findById(claimedById)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user has enough points
        if (claimingUser.getPoints() < reward.getPointsRequired()) {
            throw new RuntimeException("Insufficient points to claim reward");
        }
        
        // Update reward and user
        reward.setQuantityAvailable(reward.getQuantityAvailable() - 1);
        reward.setClaimedBy(claimingUser);
        claimingUser.setPoints(claimingUser.getPoints() - reward.getPointsRequired());
        
        // Save changes
        userRepository.save(claimingUser);
        Reward updated = rewardRepository.save(reward);
        
        return rewardMapper.toResponse(updated);
    }
} 