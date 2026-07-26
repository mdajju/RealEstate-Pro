package com.realestatepro.controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.PropertyRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.PropertyResponse;
import com.realestatepro.service.PropertyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {


    private final PropertyService propertyService;



    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OWNER')")
    @PostMapping
    public ResponseEntity<ApiResponse<PropertyResponse>> createProperty(
            @Valid @RequestBody PropertyRequest request) {


        PropertyResponse response =
                propertyService.createProperty(request);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    ApiResponse.<PropertyResponse>builder()
                    .success(true)
                    .message("Property created successfully")
                    .data(response)
                    .build()
                );
    }




    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OWNER','AGENT','CUSTOMER')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getPropertyById(
            @PathVariable String id) {


        PropertyResponse response =
                propertyService.getPropertyById(id);


        return ResponseEntity.ok(
                ApiResponse.<PropertyResponse>builder()
                .success(true)
                .message("Property fetched successfully")
                .data(response)
                .build()
        );
    }





    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OWNER','AGENT','CUSTOMER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getAllProperties() {


        List<PropertyResponse> response =
                propertyService.getAllProperties();


        return ResponseEntity.ok(
                ApiResponse.<List<PropertyResponse>>builder()
                .success(true)
                .message("Properties fetched successfully")
                .data(response)
                .build()
        );
    }





    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OWNER','AGENT')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> updateProperty(
            @PathVariable String id,
            @Valid @RequestBody PropertyRequest request) {


        PropertyResponse response =
                propertyService.updateProperty(id, request);


        return ResponseEntity.ok(
                ApiResponse.<PropertyResponse>builder()
                .success(true)
                .message("Property updated successfully")
                .data(response)
                .build()
        );
    }





    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProperty(
            @PathVariable String id) {


        propertyService.deleteProperty(id);


        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                .success(true)
                .message("Property deleted successfully")
                .build()
        );
    }

}