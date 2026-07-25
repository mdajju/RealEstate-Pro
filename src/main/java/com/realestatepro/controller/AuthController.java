package com.realestatepro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.LoginRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.LoginResponse;
import com.realestatepro.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        ApiResponse<LoginResponse> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(true);
        apiResponse.setMessage("Login successful");
        apiResponse.setData(response);

        return ResponseEntity.ok(apiResponse);
    }
}