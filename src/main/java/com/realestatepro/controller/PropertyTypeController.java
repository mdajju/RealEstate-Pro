package com.realestatepro.controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.PropertyTypeRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.PropertyTypeResponse;
import com.realestatepro.service.PropertyTypeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/property-types")
@RequiredArgsConstructor
public class PropertyTypeController {


    private final PropertyTypeService propertyTypeService;



    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<PropertyTypeResponse>> createPropertyType(
            @Valid @RequestBody PropertyTypeRequest request) {


        PropertyTypeResponse response =
                propertyTypeService.createPropertyType(request);


        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PropertyTypeResponse>builder()
                        .success(true)
                        .message("Property type created successfully")
                        .data(response)
                        .build());
    }



    @GetMapping
    public ResponseEntity<ApiResponse<List<PropertyTypeResponse>>> getAllPropertyTypes() {


        List<PropertyTypeResponse> response =
                propertyTypeService.getAllPropertyTypes();


        return ResponseEntity.ok(
                ApiResponse.<List<PropertyTypeResponse>>builder()
                .success(true)
                .message("Property types fetched successfully")
                .data(response)
                .build());
    }




    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyTypeResponse>> getPropertyTypeById(
            @PathVariable String id) {


        PropertyTypeResponse response =
                propertyTypeService.getPropertyTypeById(id);


        return ResponseEntity.ok(
                ApiResponse.<PropertyTypeResponse>builder()
                .success(true)
                .message("Property type fetched successfully")
                .data(response)
                .build());
    }





    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<PropertyTypeResponse>> updatePropertyType(
            @PathVariable String id,
            @Valid @RequestBody PropertyTypeRequest request) {


        PropertyTypeResponse response =
                propertyTypeService.updatePropertyType(id, request);


        return ResponseEntity.ok(
                ApiResponse.<PropertyTypeResponse>builder()
                .success(true)
                .message("Property type updated successfully")
                .data(response)
                .build());
    }





    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePropertyType(
            @PathVariable String id) {


        propertyTypeService.deletePropertyType(id);


        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                .success(true)
                .message("Property type deleted successfully")
                .build());
    }

}