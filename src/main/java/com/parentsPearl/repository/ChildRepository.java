package com.parentsPearl.repository;

import com.parentsPearl.model.Child;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChildRepository extends MongoRepository<Child, String> {
    List<Child> findByParentId(String parentId);
}
