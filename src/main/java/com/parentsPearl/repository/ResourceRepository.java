package com.parentsPearl.repository;

import com.parentsPearl.model.EducationalResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends JpaRepository<EducationalResource, Long> {

}
