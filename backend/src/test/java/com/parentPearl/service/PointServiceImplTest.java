package com.parentPearl.service;

import com.parentPearl.dto.request.PointRequest;
import com.parentPearl.dto.response.PointResponse;
import com.parentPearl.mapper.PointMapper;
import com.parentPearl.model.Child;
import com.parentPearl.model.Point;
import com.parentPearl.repository.ChildRepository;
import com.parentPearl.repository.PointRepository;
import com.parentPearl.service.implementation.PointServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class PointServiceImplTest {

    @Mock
    private PointRepository pointRepository;

    @Mock
    private ChildRepository childRepository;

    @Mock
    private PointMapper pointMapper;

    @InjectMocks
    private PointServiceImpl pointService;

    private Child child;
    private Point point;
    private PointRequest pointRequest;

    @BeforeEach
    void setUp() {
        child = Child.builder()
                .id(1L)
                .name("Test Child")
                .totalPoints(100)
                .build();

        point = Point.builder()
                .id(1L)
                .points(50)
                .reason("Test achievement")
                .child(child)
                .createdAt(LocalDateTime.now())
                .build();

        pointRequest = new PointRequest();
        pointRequest.setPoints(50);
        pointRequest.setReason("Test achievement");
        pointRequest.setChildId(1L);
    }



    @Test
    void getChildPointHistory_Success() {
        // Given
        when(childRepository.findByIdAndParentId(anyLong(), anyLong()))
                .thenReturn(Optional.of(child));
        when(pointRepository.findAllByChildId(anyLong()))
                .thenReturn(Arrays.asList(point));
        when(pointMapper.toResponse(any(Point.class))).thenReturn(
            PointResponse.builder()
                .id(point.getId())
                .points(point.getPoints())
                .reason(point.getReason())
                .childId(point.getChild().getId())
                .build()
        );

        // When
        List<PointResponse> responses = pointService.getChildPointHistory(1L, 1L);

        // Then
        assertNotNull(responses);
        assertFalse(responses.isEmpty());
        assertEquals(50, responses.get(0).getPoints());
    }

    @Test
    void getMyTotalPoints_Success() {
        // Given
        when(childRepository.findById(anyLong())).thenReturn(Optional.of(child));
        when(pointRepository.sumPointsByChildId(anyLong())).thenReturn(100);

        // When
        int totalPoints = pointService.getMyTotalPoints(1L);

        // Then
        assertEquals(100, totalPoints);
        verify(pointRepository).sumPointsByChildId(1L);
    }

    @Test
    void getMyPointHistory_Success() {
        // Given
        when(childRepository.findById(anyLong()))
                .thenReturn(Optional.of(child));
        when(pointRepository.findAllByChildId(anyLong()))
                .thenReturn(Arrays.asList(point));
        when(pointMapper.toResponse(any(Point.class))).thenReturn(
            PointResponse.builder()
                .id(point.getId())
                .points(point.getPoints())
                .reason(point.getReason())
                .childId(point.getChild().getId())
                .build()
        );

        // When
        List<PointResponse> responses = pointService.getMyPointHistory(1L);

        // Then
        assertNotNull(responses);
        assertFalse(responses.isEmpty());
        assertEquals(50, responses.get(0).getPoints());
    }
} 