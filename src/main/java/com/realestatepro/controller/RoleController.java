package com.realestatepro.controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.RoleRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.RoleResponse;
import com.realestatepro.service.RoleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

   
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponse>> createRole(
            @Valid @RequestBody RoleRequest request) {

        RoleResponse response = roleService.createRole(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<RoleResponse>builder()
                        .success(true)
                        .message("Role created successfully")
                        .data(response)
                        .build());
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> getRoleById(@PathVariable String id) {

        RoleResponse response = roleService.getRoleById(id);

        return ResponseEntity.ok(
                ApiResponse.<RoleResponse>builder()
                        .success(true)
                        .message("Role fetched successfully")
                        .data(response)
                        .build());
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles(){

        List<RoleResponse> response = roleService.getAllRoles();

        return ResponseEntity.ok(
                ApiResponse.<List<RoleResponse>>builder()
                        .success(true)
                        .message("Roles fetched successfully")
                        .data(response)
                        .build());
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> updateRole(
            @PathVariable String id,
            @Valid @RequestBody RoleRequest request) {

        RoleResponse response = roleService.updateRole(id, request);

        return ResponseEntity.ok(
                ApiResponse.<RoleResponse>builder()
                        .success(true)
                        .message("Role updated successfully")
                        .data(response)
                        .build());
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRole(@PathVariable String id) {

        roleService.deleteRole(id);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Role deleted successfully")
                        .build());
    }
}