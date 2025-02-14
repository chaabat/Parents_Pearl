package com.parentsPearl.repository;

import com.parentsPearl.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CalendarRepository extends MongoRepository<Event, String> {
    List<Event> findByIsReminderTrue();
}
