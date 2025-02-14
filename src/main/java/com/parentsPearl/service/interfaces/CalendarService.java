package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.EventRequest;
import com.parentsPearl.dto.response.EventResponse;
import java.util.List;

public interface CalendarService {
    List<EventResponse> getEvents();
    EventResponse createEvent(EventRequest request);
    EventResponse updateEvent(String id, EventRequest request);
    void deleteEvent(String id);
    List<EventResponse> getReminders();
} 