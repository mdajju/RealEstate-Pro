package com.realestatepro.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.PropertyResponse;
import com.realestatepro.service.PropertyApprovalService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/admin/properties")
@RequiredArgsConstructor
public class PropertyApprovalController {


    private final PropertyApprovalService propertyApprovalService;



    /*
     * Get all properties waiting for approval
     */
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getPendingProperties() {


        List<PropertyResponse> properties =
                propertyApprovalService.getPendingProperties();


        return ResponseEntity.ok(
                ApiResponse.<List<PropertyResponse>>builder()
                        .success(true)
                        .message("Pending properties fetched successfully")
                        .data(properties)
                        .build()
        );
    }




    /*
     * Approve Property
     *
     * Status:
     * PENDING_APPROVAL -> AVAILABLE
     *
     * active:
     * false -> true
     */
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<PropertyResponse>> approveProperty(
            @PathVariable String id) {


        PropertyResponse response =
                propertyApprovalService.approveProperty(id);


        return ResponseEntity.ok(
                ApiResponse.<PropertyResponse>builder()
                        .success(true)
                        .message("Property approved successfully")
                        .data(response)
                        .build()
        );
    }





    /*
     * Reject Property
     *
     * Status:
     * PENDING_APPROVAL -> REJECTED
     *
     * active:
     * false
     */
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<PropertyResponse>> rejectProperty(
            @PathVariable String id) {


        PropertyResponse response =
                propertyApprovalService.rejectProperty(id);


        return ResponseEntity.ok(
                ApiResponse.<PropertyResponse>builder()
                        .success(true)
                        .message("Property rejected successfully")
                        .data(response)
                        .build()
        );
    }

}