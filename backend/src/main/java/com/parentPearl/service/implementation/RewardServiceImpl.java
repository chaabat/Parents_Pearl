package com.parentPearl.service.implementation;

import com.parentPearl.dto.request.RewardRequest;
import com.parentPearl.dto.request.RewardRedemptionRequest;
import com.parentPearl.dto.response.RewardResponse;
import com.parentPearl.dto.response.RewardRedemptionResponse;
import com.parentPearl.exception.NotFoundException;
import com.parentPearl.mapper.RewardMapper;
import com.parentPearl.mapper.RewardRedemptionMapper;
import com.parentPearl.model.Child;
import com.parentPearl.model.Reward;
import com.parentPearl.model.RewardRedemption;
import com.parentPearl.repository.ChildRepository;
import com.parentPearl.repository.RewardRepository;
import com.parentPearl.repository.RewardRedemptionRepository;
import com.parentPearl.service.interfaces.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RewardServiceImpl implements RewardService {

    private final RewardRepository rewardRepository;
    private final RewardRedemptionRepository redemptionRepository;
    private final ChildRepository childRepository;
    private final RewardMapper rewardMapper;
    private final RewardRedemptionMapper redemptionMapper;

    @Override
    public RewardResponse createReward(Long parentId, RewardRequest request) {
        Reward reward = rewardMapper.toEntity(request);
        reward.setParentId(parentId);
        reward = rewardRepository.save(reward);
        return rewardMapper.toResponse(reward);
    }

    @Override
    public RewardResponse updateReward(Long parentId, Long rewardId, RewardRequest request) {
        Reward reward = rewardRepository.findByIdAndParentId(rewardId, parentId)
                .orElseThrow(() -> new NotFoundException("Reward not found with id: " + rewardId));
        
        rewardMapper.updateEntity(reward, request);
        return rewardMapper.toResponse(reward);
    }

    @Override
    public void deleteReward(Long parentId, Long rewardId) {
        Reward reward = rewardRepository.findByIdAndParentId(rewardId, parentId)
                .orElseThrow(() -> new NotFoundException("Reward not found with id: " + rewardId));
        
        rewardRepository.delete(reward);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RewardResponse> getAllRewards(Long parentId) {
        return rewardRepository.findAllByParentId(parentId).stream()
                .map(rewardMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RewardRedemptionResponse redeemReward(Long childId, RewardRedemptionRequest request) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));

        Reward reward = rewardRepository.findById(request.getRewardId())
                .orElseThrow(() -> new RuntimeException("Reward not found"));

        if (child.getTotalPoints() < reward.getPointCost()) {
            throw new RuntimeException("Not enough points. Required: " + reward.getPointCost() 
                + ", Available: " + child.getTotalPoints());
        }

        child.addPoints(-reward.getPointCost());
        childRepository.save(child);

        RewardRedemption redemption = RewardRedemption.builder()
                .child(child)
                .reward(reward)
                .pointsSpent(reward.getPointCost())
                .message(request.getMessage())
                .redemptionDate(LocalDateTime.now())
                .build();

        redemption = redemptionRepository.save(redemption);
        return redemptionMapper.toResponse(redemption);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RewardResponse> getAvailableRewards(Long childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new NotFoundException("Child not found with id: " + childId));
                
        return rewardRepository.findAllByParentId(child.getParent().getId()).stream()
                .map(rewardMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RewardRedemptionResponse> getMyRedemptionHistory(Long childId) {
        return redemptionRepository.findAllByChildId(childId).stream()
                .map(redemptionMapper::toResponse)
                .collect(Collectors.toList());
    }
} 