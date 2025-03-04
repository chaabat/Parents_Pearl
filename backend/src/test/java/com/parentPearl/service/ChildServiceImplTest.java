package com.parentPearl.service;

import com.parentPearl.dto.response.ChildResponse;
import com.parentPearl.mapper.ChildMapper;
import com.parentPearl.model.Child;
import com.parentPearl.model.Parent;
import com.parentPearl.repository.ChildRepository;
import com.parentPearl.repository.PointRepository;
import com.parentPearl.service.implementation.ChildServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
class ChildServiceImplTest {

    @Mock
    private ChildRepository childRepository;

    @Mock
    private ChildMapper childMapper;

    @Mock
    private PointRepository pointRepository;

    @InjectMocks
    private ChildServiceImpl childService;

    private Child child;
    private Parent parent;

    @BeforeEach
    void setUp() {
        parent = Parent.builder()
                .id(1L)
                .name("Parent Name")
                .email("parent@example.com")
                .build();

        child = Child.builder()
                .id(1L)
                .name("Child Name")
                .email("child@example.com")
                .parent(parent)
                .totalPoints(100)
                .build();
    }

    @Test
    void getChildById_Success() {
        // Given
        when(childRepository.findByIdAndNotBanned(anyLong()))
                .thenReturn(Optional.of(child));
        when(childMapper.toResponse(any(Child.class))).thenReturn(
            ChildResponse.builder()
                .id(child.getId())
                .name(child.getName())
                .totalPoints(child.getTotalPoints())
                .parentId(parent.getId())
                .build()
        );

        // When
        ChildResponse response = childService.getChildById(1L);

        // Then
        assertNotNull(response);
        assertEquals(child.getId(), response.getId());
        assertEquals(child.getName(), response.getName());
        assertEquals(child.getTotalPoints(), response.getTotalPoints());
    }

    @Test
    void getChildrenByParentId_Success() {
        // Given
        Child child2 = Child.builder()
                .id(2L)
                .name("Child 2")
                .parent(parent)
                .totalPoints(50)
                .build();

        when(childRepository.findByParentId(anyLong()))
                .thenReturn(Arrays.asList(child, child2));
        when(childMapper.toResponse(child)).thenReturn(
            ChildResponse.builder()
                .id(child.getId())
                .name(child.getName())
                .totalPoints(child.getTotalPoints())
                .parentId(parent.getId())
                .build()
        );
        when(childMapper.toResponse(child2)).thenReturn(
            ChildResponse.builder()
                .id(2L)
                .name("Child 2")
                .totalPoints(50)
                .parentId(parent.getId())
                .build()
        );

        // When
        List<ChildResponse> responses = childService.getChildrenByParentId(1L);

        // Then
        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals("Child Name", responses.get(0).getName());
        assertEquals("Child 2", responses.get(1).getName());
        assertEquals(100, responses.get(0).getTotalPoints());
        assertEquals(50, responses.get(1).getTotalPoints());
        verify(childMapper, times(2)).toResponse(any(Child.class));
    }

    @Test
    void getTotalPoints_Success() {
        // Given
        when(pointRepository.sumPointsByChildId(anyLong()))
                .thenReturn(100);

        // When
        int points = childService.getTotalPoints(1L);

        // Then
        assertEquals(100, points);
        verify(pointRepository).sumPointsByChildId(1L);
    }
} 