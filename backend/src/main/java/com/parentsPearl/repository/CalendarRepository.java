package com.parentsPearl.repository;

import com.parentsPearl.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<Event, Long> {
    List<Event> findByIsReminderTrue();
}
