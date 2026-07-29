package com.realestatepro.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.ComplaintRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.ComplaintResponse;

import com.realestatepro.service.ComplaintService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    // Create Complaint
    @PostMapping
    public ResponseEntity<ApiResponse<ComplaintResponse>> createComplaint(
            @Valid @RequestBody ComplaintRequest request) {

        ComplaintResponse response =
                complaintService.createComplaint(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<ComplaintResponse>builder()
                        .success(true)
                        .message("Complaint created successfully.")
                        .data(response)
                        .build());
    }

    // Get Complaint By ID
    @GetMapping("/{complaintId}")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getComplaintById(
            @PathVariable String complaintId) {

        ComplaintResponse response =
                complaintService.getComplaintById(complaintId);

        return ResponseEntity.ok(
                ApiResponse.<ComplaintResponse>builder()
                        .success(true)
                        .message("Complaint fetched successfully.")
                        .data(response)
                        .build());
    }

    // Get Complaints By User
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getComplaintsByUser(
            @PathVariable String userId) {

        List<ComplaintResponse> response =
                complaintService.getComplaintsByUser(userId);

        return ResponseEntity.ok(
                ApiResponse.<List<ComplaintResponse>>builder()
                        .success(true)
                        .message("Complaints fetched successfully.")
                        .data(response)
                        .build());
    }

    // Get All Complaints
    @GetMapping
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getAllComplaints() {

        List<ComplaintResponse> response =
                complaintService.getAllComplaints();

        return ResponseEntity.ok(
                ApiResponse.<List<ComplaintResponse>>builder()
                        .success(true)
                        .message("All complaints fetched successfully.")
                        .data(response)
                        .build());
    }

    // Update Complaint Status
    @PutMapping("/{complaintId}")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateComplaintStatus(

            @PathVariable String complaintId,

            @RequestParam String status,

            @RequestParam(required = false) String adminRemark) {

        ComplaintResponse response =
                complaintService.updateComplaintStatus(
                        complaintId,
                        status,
                        adminRemark);

        return ResponseEntity.ok(
                ApiResponse.<ComplaintResponse>builder()
                        .success(true)
                        .message("Complaint updated successfully.")
                        .data(response)
                        .build());
    }

}