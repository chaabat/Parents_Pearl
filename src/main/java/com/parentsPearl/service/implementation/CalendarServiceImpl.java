package com.parentsPearl.service.implementation;

import com.parentsPearl.dto.request.EventRequest;
import com.parentsPearl.dto.response.EventResponse;
import com.parentsPearl.model.Event;
import com.parentsPearl.repository.CalendarRepository;
import com.parentsPearl.service.interfaces.CalendarService;
import com.parentsPearl.mapper.EventMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarServiceImpl implements CalendarService {
    
    private final CalendarRepository calendarRepository;
    private final EventMapper eventMapper;

    @Override
    public List<EventResponse> getEvents() {
        return calendarRepository.findAll().stream()
                .map(eventMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EventResponse createEvent(EventRequest request) {
        Event event = eventMapper.toEntity(request);
        Event saved = calendarRepository.save(event);
        return eventMapper.toResponse(saved);
    }

    @Override
    public EventResponse updateEvent(String id, EventRequest request) {
        return calendarRepository.findById(id)
                .map(event -> {
                    eventMapper.updateEntity(request, event);
                    Event updated = calendarRepository.save(event);
                    return eventMapper.toResponse(updated);
                })
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    @Override
    public void deleteEvent(String id) {
        calendarRepository.deleteById(id);
    }

    @Override
    public List<EventResponse> getReminders() {
        return calendarRepository.findByIsReminderTrue().stream()
                .map(eventMapper::toResponse)
                .collect(Collectors.toList());
    }
} 