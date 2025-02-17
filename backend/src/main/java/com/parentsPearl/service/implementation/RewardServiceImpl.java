package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.RewardRequest;
import com.parentsPearl.dto.response.RewardResponse;
import com.parentsPearl.exception.ResourceNotFoundException;
import com.parentsPearl.model.Reward;
import com.parentsPearl.model.User;
import com.parentsPearl.model.Child;
import com.parentsPearl.repository.RewardRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.RewardService;
import com.parentsPearl.mapper.RewardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
     
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
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
    public RewardResponse findById(Long id) {
        return rewardRepository.findById(id)
                .map(rewardMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Reward", "id", id));
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
                .orElseThrow(() -> new ResourceNotFoundException("Reward", "id", rewardId));
        
        User user = userRepository.findById(claimedById)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", claimedById));
        
        if (!(user instanceof Child)) {
            throw new RuntimeException("Only children can claim rewards");
        }
        
        Child child = (Child) user;
        
        if (child.getPoints() < reward.getPointsRequired()) {
            throw new RuntimeException("Insufficient points to claim reward");
        }
        
        reward.setQuantityAvailable(reward.getQuantityAvailable() - 1);
        reward.setClaimedById(claimedById);
        child.setPoints(child.getPoints() - reward.getPointsRequired());
        
        userRepository.save(child);
        Reward updated = rewardRepository.save(reward);
        return rewardMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RewardResponse> findByChildId(Long childId) {
        return rewardRepository.findByClaimedById(childId).stream()
                .map(rewardMapper::toResponse)
                .collect(Collectors.toList());
    }
} 