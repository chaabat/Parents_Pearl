package com.parentsPearl.repository;

 import com.parentsPearl.model.CalendarEvent;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarRepository extends JpaRepository<CalendarEvent, Long> {

}
