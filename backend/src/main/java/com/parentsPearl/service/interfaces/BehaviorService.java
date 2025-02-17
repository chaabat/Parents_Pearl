package com.parentsPearl.service.interfaces;

import com.parentsPearl.dto.request.BehaviorRecordRequest;
import com.parentsPearl.dto.response.BehaviorRecordResponse;
import java.util.List;
import java.util.Optional;

public interface BehaviorService {
    List<BehaviorRecordResponse> findAll();
    Optional<BehaviorRecordResponse> findById(Long id);
    BehaviorRecordResponse create(BehaviorRecordRequest request);
    void deleteById(Long id);
    List<BehaviorRecordResponse> findByChildId(Long childId);
}
