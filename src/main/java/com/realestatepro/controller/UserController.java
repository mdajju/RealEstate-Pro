package com.realestatepro.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.UserRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.UserResponse;
import com.realestatepro.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(
        name = "User Management",
        description = "User management APIs"
)
public class UserController {


    private final UserService userService;



    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(
            @Valid @RequestBody UserRequest request) {


        UserResponse response =
                userService.registerUser(request);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("User registered successfully")
                        .data(response)
                        .build()
                );
    }




    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN','ADMIN')"
    )
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {


        List<UserResponse> response =
                userService.getAllUsers();


        return ResponseEntity.ok(
                ApiResponse.<List<UserResponse>>builder()
                .success(true)
                .message("Users fetched successfully")
                .data(response)
                .build()
        );
    }





    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN','ADMIN')"
    )
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable String id) {


        UserResponse response =
                userService.getUserById(id);


        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User fetched successfully")
                .data(response)
                .build()
        );
    }





    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN','ADMIN')"
    )
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UserRequest request) {


        UserResponse response =
                userService.updateUser(id, request);


        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User updated successfully")
                .data(response)
                .build()
        );
    }





    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN','ADMIN')"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(
            @PathVariable String id) {


        userService.deleteUser(id);


        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                .success(true)
                .message("User deleted successfully")
                .build()
        );
    }

}