package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.ParentRequest;
import com.parentsPearl.dto.response.ParentResponse;
import java.util.List;
import java.util.Optional;

public interface ParentService {
    List<ParentResponse > findAll();
    Optional<ParentResponse> findById(String id);
    ParentResponse save(ParentRequest parent);
    void deleteById(String id);
}
