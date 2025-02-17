package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.ParentRequest;
import com.parentsPearl.dto.response.ParentResponse;
import java.util.List;

public interface ParentService {
    List<ParentResponse> findAll();
    ParentResponse findById(Long id);
    ParentResponse save(ParentRequest request);
    void deleteById(Long id);
}
