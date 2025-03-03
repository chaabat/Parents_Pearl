package com.parentPearl.controller.auth;

import com.parentPearl.dto.request.PointRequest;
import com.parentPearl.dto.response.PointResponse;
import com.parentPearl.service.interfaces.PointService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/points")
public class PointsController {

    private final PointService pointService;

    // Endpoints pour les parents
    @PreAuthorize("hasRole('PARENT')")
    @PostMapping("/parents/{parentId}/children/{childId}")
    public ResponseEntity<PointResponse> awardPoints(
            @PathVariable Long parentId,
            @PathVariable Long childId,
            @RequestBody PointRequest request) {
        return ResponseEntity.ok(pointService.awardPoints(parentId, childId, request));
    }

    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/parents/{parentId}/children/{childId}/points/child-history")
    public ResponseEntity<List<PointResponse>> getChildPointHistory(
            @PathVariable Long parentId,
            @PathVariable Long childId) {
        return ResponseEntity.ok(pointService.getChildPointHistory(parentId, childId));
    }

    // Endpoints pour les enfants
    @PreAuthorize("hasRole('CHILD')")
    @GetMapping("/children/{childId}/points/history")
    public ResponseEntity<List<PointResponse>> getMyPointHistory(
            @PathVariable Long childId) {
        return ResponseEntity.ok(pointService.getMyPointHistory(childId));
    }

    @PreAuthorize("hasRole('CHILD')")
    @GetMapping("/children/{childId}/points/total")
    public ResponseEntity<Integer> getMyTotalPoints(
            @PathVariable Long childId) {
        return ResponseEntity.ok(pointService.getMyTotalPoints(childId));
    }
}
