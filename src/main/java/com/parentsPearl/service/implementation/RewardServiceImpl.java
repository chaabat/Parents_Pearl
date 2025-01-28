package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.RewardRequest;
import com.parentsPearl.dto.response.RewardResponse;
import com.parentsPearl.model.Reward;
import com.parentsPearl.repository.RewardRepository;
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
    
    @Autowired
    public RewardServiceImpl(RewardRepository rewardRepository,
                           RewardMapper rewardMapper) {
        this.rewardRepository = rewardRepository;
        this.rewardMapper = rewardMapper;
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
} 