package com.parentPearl.service.implementation;

import com.parentPearl.dto.request.PointRequest;
import com.parentPearl.dto.response.PointResponse;
import com.parentPearl.mapper.PointMapper;
import com.parentPearl.model.Child;
import com.parentPearl.model.Point;
import com.parentPearl.repository.ChildRepository;
import com.parentPearl.repository.PointRepository;
import com.parentPearl.service.interfaces.PointService;
import com.parentPearl.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PointServiceImpl implements PointService {

    private final PointRepository pointRepository;
    private final ChildRepository childRepository;
    private final PointMapper pointMapper;

    @Override
    public PointResponse awardPoints(Long parentId, Long childId, PointRequest request) {
        Child child = childRepository.findByIdAndParentId(childId, parentId)
                .orElseThrow(() -> new NotFoundException("Child not found with id: " + childId + " for parent: " + parentId));

        Point point = new Point();
        point.setChild(child);
        point.setPoints(request.getPoints());
        point.setReason(request.getReason());
        point.setCreatedAt(LocalDateTime.now());
        
        point = pointRepository.save(point);
        return pointMapper.toResponse(point);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PointResponse> getChildPointHistory(Long parentId, Long childId) {
        // Verify child belongs to parent first
        childRepository.findByIdAndParentId(childId, parentId)
                .orElseThrow(() -> new NotFoundException("Child not found with id: " + childId + " for parent: " + parentId));

        return pointRepository.findAllByChildId(childId).stream()
                .map(pointMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PointResponse> getMyPointHistory(Long childId) {
        // Verify child exists
        childRepository.findById(childId)
                .orElseThrow(() -> new NotFoundException("Child not found with id: " + childId));

        return pointRepository.findAllByChildId(childId).stream()
                .map(pointMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public int getMyTotalPoints(Long childId) {
        // Verify child exists
        childRepository.findById(childId)
                .orElseThrow(() -> new NotFoundException("Child not found with id: " + childId));

        return pointRepository.sumPointsByChildId(childId);
    }
} 