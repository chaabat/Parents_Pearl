package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.ChildRequest;
import com.parentsPearl.dto.response.ChildResponse;
import java.util.List;

public interface ChildService {
    List<ChildResponse> findAll();
    ChildResponse findById(Long id);
    ChildResponse create(ChildRequest request);
    ChildResponse update(Long id, ChildRequest request);
    void delete(Long id);
    List<ChildResponse> findByParentId(Long parentId);
}
