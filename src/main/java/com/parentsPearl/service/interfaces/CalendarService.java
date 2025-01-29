package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.CalendarEventRequest;
import com.parentsPearl.dto.response.CalendarEventResponse;
 import java.util.List;
import java.util.Optional;

public interface CalendarService {
    List<CalendarEventResponse> findAll();
    Optional<CalendarEventResponse> findById(Long id);
    CalendarEventResponse save(CalendarEventRequest event);
    void deleteById(Long id);
}
