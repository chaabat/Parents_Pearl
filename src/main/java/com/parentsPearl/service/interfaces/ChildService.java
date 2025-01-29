package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.ChildRequest;
import com.parentsPearl.dto.response.ChildResponse;
 import java.util.List;
import java.util.Optional;

public interface ChildService {
    List<ChildResponse> findAll();
    Optional<ChildResponse> findById(Long id);
    ChildResponse save(ChildRequest child);
    void deleteById(Long id);
}
