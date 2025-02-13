package com.parentsPearl.repository;

 import com.parentsPearl.model.CalendarEvent;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarRepository extends MongoRepository<CalendarEvent, String> {

}
