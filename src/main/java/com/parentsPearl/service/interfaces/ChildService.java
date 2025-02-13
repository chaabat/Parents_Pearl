package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.ChildRequest;
import com.parentsPearl.dto.response.ChildResponse;
 import java.util.List;
import java.util.Optional;

public interface ChildService {
    List<ChildResponse> findAll();
    Optional<ChildResponse> findById(String id);
    ChildResponse save(ChildRequest child);
    void deleteById(String id);
    ChildResponse update(String id, ChildRequest child);
    List<ChildResponse> findByParentId(String parentId);
}
