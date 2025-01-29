package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.CalendarEventRequest;
import com.parentsPearl.dto.response.CalendarEventResponse;
import com.parentsPearl.model.CalendarEvent;
import com.parentsPearl.model.User;
import com.parentsPearl.repository.CalendarRepository;
import com.parentsPearl.repository.UserRepository;
import com.parentsPearl.service.interfaces.CalendarService;
import com.parentsPearl.mapper.CalendarEventMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CalendarServiceImpl implements CalendarService {
    
    private final CalendarRepository calendarRepository;
    private final CalendarEventMapper calendarMapper;
    private final UserRepository userRepository;
    
    @Autowired
    public CalendarServiceImpl(CalendarRepository calendarRepository,
                             CalendarEventMapper calendarMapper,
                             UserRepository userRepository) {
        this.calendarRepository = calendarRepository;
        this.calendarMapper = calendarMapper;
        this.userRepository = userRepository;
    }
    
    @Override
    public List<CalendarEventResponse> findAll() {
        return calendarRepository.findAll().stream()
                .map(calendarMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<CalendarEventResponse> findById(Long id) {
        return calendarRepository.findById(id)
                .map(calendarMapper::toResponse);
    }
    
    @Override
    public CalendarEventResponse save(CalendarEventRequest request) {
        CalendarEvent entity = calendarMapper.toEntity(request);
        
        // Set the creator (from security context)
        User creator = userRepository.findById(1L) // TODO: Replace with actual logged-in user
                .orElseThrow(() -> new RuntimeException("User not found"));
        entity.setCreatedBy(creator);
        
        CalendarEvent saved = calendarRepository.save(entity);
        return calendarMapper.toResponse(saved);
    }
    
    @Override
    public void deleteById(Long id) {
        calendarRepository.deleteById(id);
    }
} 