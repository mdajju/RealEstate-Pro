package com.realestatepro.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.UserRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.UserResponse;
import com.realestatepro.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(
            @Valid @RequestBody UserRequest request) {

        UserResponse response = userService.registerUser(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("User registered successfully")
                        .data(response)
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable String id) {

        UserResponse response = userService.getUserById(id);

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("User fetched successfully")
                        .data(response)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {

        List<UserResponse> response = userService.getAllUsers();

        return ResponseEntity.ok(
                ApiResponse.<List<UserResponse>>builder()
                        .success(true)
                        .message("Users fetched successfully")
                        .data(response)
                        .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UserRequest request) {

        UserResponse response = userService.updateUser(id, request);

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("User updated successfully")
                        .data(response)
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(
            @PathVariable String id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("User deleted successfully")
                        .data(null)
                        .build());
    }
}