package com.parentsPearl.controller;

import com.parentsPearl.dto.request.EventRequest;
import com.parentsPearl.dto.response.EventResponse;
import com.parentsPearl.service.interfaces.CalendarService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/calendar")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class CalendarController {
    
    private final CalendarService calendarService;
    
    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getEvents() {
        return ResponseEntity.ok(calendarService.getEvents());
    }
    
    @PostMapping("/events")
    public ResponseEntity<EventResponse> createEvent(@RequestBody EventRequest request) {
        return ResponseEntity.ok(calendarService.createEvent(request));
    }

    @PostMapping("/events/{id}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable String id, @RequestBody EventRequest request) {
        return ResponseEntity.ok(calendarService.updateEvent(id, request));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        calendarService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reminders")
    public ResponseEntity<List<EventResponse>> getReminders() {
        return ResponseEntity.ok(calendarService.getReminders());
    }
} 