package com.parentPearl.service.implementation;

import com.parentPearl.dto.response.ChildResponse;
import com.parentPearl.dto.response.TaskResponse;
import com.parentPearl.dto.response.PointResponse;
import com.parentPearl.mapper.ChildMapper;
import com.parentPearl.mapper.TaskMapper;
import com.parentPearl.mapper.PointMapper;
import com.parentPearl.repository.ChildRepository;
import com.parentPearl.repository.TaskRepository;
import com.parentPearl.repository.PointRepository;
import com.parentPearl.service.interfaces.ChildService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Since this service is read-only
public class ChildServiceImpl implements ChildService {

    private final ChildRepository childRepository;
    private final TaskRepository taskRepository;
    private final PointRepository pointRepository;
    private final ChildMapper childMapper;
    private final TaskMapper taskMapper;
    private final PointMapper pointMapper;

    @Override
    public ChildResponse getChildById(Long childId) {
        return childRepository.findByIdAndNotBanned(childId)
                .map(childMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Child not found"));
    }

    @Override
    public List<TaskResponse> getChildTasks(Long childId) {
        return taskRepository.findAllByChildId(childId).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PointResponse> getChildPoints(Long childId) {
        return pointRepository.findAllByChildId(childId).stream()
                .map(pointMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public int getTotalPoints(Long childId) {
        return pointRepository.sumPointsByChildId(childId);
    }

    @Override
    public List<ChildResponse> getChildrenByParentId(Long parentId) {
        return childRepository.findByParentId(parentId).stream()
                .map(childMapper::toResponse)
                .collect(Collectors.toList());
    }
} 