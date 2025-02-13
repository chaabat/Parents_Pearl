package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.CalendarEventRequest;
import com.parentsPearl.dto.response.CalendarEventResponse;
import com.parentsPearl.model.CalendarEvent;
import com.parentsPearl.repository.CalendarRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.CalendarService;
import com.parentsPearl.mapper.CalendarEventMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarServiceImpl implements CalendarService {
    
    private final CalendarRepository calendarRepository;
    private final CalendarEventMapper calendarMapper;
    private final UserRepository userRepository;
    
    @Override
    public List<CalendarEventResponse> findAll() {
        return calendarRepository.findAll().stream()
                .map(calendarMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<CalendarEventResponse> findById(String id) {
        return calendarRepository.findById(id)
                .map(calendarMapper::toResponse);
    }
    
    @Override
    public CalendarEventResponse save(CalendarEventRequest request) {
        CalendarEvent entity = calendarMapper.toEntity(request);
        
        // Set the creator ID (from security context)
        String creatorId = "1";  
        userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        entity.setCreatedById(creatorId);
        
        CalendarEvent saved = calendarRepository.save(entity);
        return calendarMapper.toResponse(saved);
    }
    
    @Override
    public void deleteById(String id) {
        calendarRepository.deleteById(id);
    }

   

    
} 