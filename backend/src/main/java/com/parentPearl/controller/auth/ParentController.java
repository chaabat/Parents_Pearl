package com.parentPearl.controller.auth;

import com.parentPearl.dto.request.ChildRequest;
import com.parentPearl.dto.request.ParentRequest;
import com.parentPearl.dto.response.ChildResponse;
import com.parentPearl.dto.response.ParentResponse;
import com.parentPearl.service.interfaces.ChildService;
import com.parentPearl.service.interfaces.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parents")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PARENT')")

public class ParentController {

    private final ParentService parentService;
    private final ChildService childService;

    @GetMapping("/{id}")
    public ResponseEntity<ParentResponse> getParentById(@PathVariable Long id) {
        return ResponseEntity.ok(parentService.getParentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParentResponse> updateParent(
            @PathVariable Long id,
            @RequestBody ParentRequest request) {
        return ResponseEntity.ok(parentService.updateParent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParent(@PathVariable Long id) {
        parentService.softDeleteParent(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{parentId}/children")
    public ResponseEntity<ChildResponse> addChild(
            @PathVariable Long parentId,
            @RequestBody ChildRequest request) {
        return ResponseEntity.ok(parentService.addChild(parentId, request));
    }

    @PutMapping("/{parentId}/children/{childId}")
    public ResponseEntity<ChildResponse> updateChild(
            @PathVariable Long parentId,
            @PathVariable Long childId,
            @RequestBody ChildRequest request) {
        return ResponseEntity.ok(parentService.updateChild(parentId, childId, request));
    }

    @DeleteMapping("/{parentId}/children/{childId}")
    public ResponseEntity<Void> deleteChild(
            @PathVariable Long parentId,
            @PathVariable Long childId) {
        parentService.softDeleteChild(parentId, childId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{parentId}/children")
    public ResponseEntity<List<ChildResponse>> getMyChildren(@PathVariable Long parentId) {
        return ResponseEntity.ok(childService.getChildrenByParentId(parentId));
    }

    @PostMapping("/{parentId}/children/{childId}/points")
    public ResponseEntity<Void> updateChildPoints(
            @PathVariable Long parentId,
            @PathVariable Long childId,
            @RequestParam int points,
            @RequestParam String reason) {
        parentService.updateChildPoints(parentId, childId, points, reason);
        return ResponseEntity.ok().build();
    }
}
