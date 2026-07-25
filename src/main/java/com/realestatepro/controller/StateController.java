package com.realestatepro.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.StateRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.StateResponse;
import com.realestatepro.service.StateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/states")
@RequiredArgsConstructor
@Validated
public class StateController {

    private final StateService stateService;

    @PostMapping
    public ResponseEntity<ApiResponse<StateResponse>> createState(
            @Valid @RequestBody StateRequest request) {

        StateResponse response = stateService.createState(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<StateResponse>builder()
                        .success(true)
                        .message("State created successfully")
                        .data(response)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StateResponse>>> getAllStates() {

        List<StateResponse> response = stateService.getAllStates();

        return ResponseEntity.ok(
                ApiResponse.<List<StateResponse>>builder()
                        .success(true)
                        .message("States fetched successfully")
                        .data(response)
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StateResponse>> getStateById(
            @PathVariable String id) {

        StateResponse response = stateService.getStateById(id);

        return ResponseEntity.ok(
                ApiResponse.<StateResponse>builder()
                        .success(true)
                        .message("State fetched successfully")
                        .data(response)
                        .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StateResponse>> updateState(
            @PathVariable String id,
            @Valid @RequestBody StateRequest request) {

        StateResponse response = stateService.updateState(id, request);

        return ResponseEntity.ok(
                ApiResponse.<StateResponse>builder()
                        .success(true)
                        .message("State updated successfully")
                        .data(response)
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteState(
            @PathVariable String id) {

        stateService.deleteState(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("State deleted successfully")
                        .build());
    }
}