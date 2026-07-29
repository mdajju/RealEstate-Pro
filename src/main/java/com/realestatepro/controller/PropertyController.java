package com.realestatepro.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.PropertyRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.PropertyResponse;
import com.realestatepro.service.PropertyService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(
        name = "Property Management",
        description = "APIs for creating, updating, fetching and deleting properties"
)
public class PropertyController {



    private final PropertyService propertyService;





    /*
     * Create Property
     */
    @Operation(
            summary = "Create property",
            description = "Owner/Admin can create a new property"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201",
            description = "Property created successfully"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Invalid property data"
    )
    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN','ADMIN','OWNER')"
    )
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
                        .message(
                                "Property created successfully"
                        )
                        .data(response)
                        .build()
                );

    }







    /*
     * Get Property By Id
     */
    @Operation(
            summary = "Get property by id",
            description = "Fetch property details using property id"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Property fetched successfully"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Property not found"
    )
    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN','ADMIN','OWNER','AGENT','CUSTOMER')"
    )
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getPropertyById(
            @PathVariable String id) {



        PropertyResponse response =
                propertyService.getPropertyById(id);



        return ResponseEntity.ok(

                ApiResponse.<PropertyResponse>builder()
                .success(true)
                .message(
                        "Property fetched successfully"
                )
                .data(response)
                .build()

        );

    }








    /*
     * Get All Properties
     */
    @Operation(
            summary = "Get all properties",
            description = "Fetch all active properties"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Properties fetched successfully"
    )
    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN','ADMIN','OWNER','AGENT','CUSTOMER')"
    )
    @GetMapping
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getAllProperties() {



        List<PropertyResponse> response =
                propertyService.getAllProperties();



        return ResponseEntity.ok(

                ApiResponse.<List<PropertyResponse>>builder()
                .success(true)
                .message(
                        "Properties fetched successfully"
                )
                .data(response)
                .build()

        );

    }









    /*
     * Update Property
     */
    @Operation(
            summary = "Update property",
            description = "Update existing property details"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Property updated successfully"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Property not found"
    )
    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN','ADMIN','OWNER','AGENT')"
    )
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> updateProperty(
            @PathVariable String id,
            @Valid @RequestBody PropertyRequest request) {



        PropertyResponse response =
                propertyService.updateProperty(
                        id,
                        request
                );



        return ResponseEntity.ok(

                ApiResponse.<PropertyResponse>builder()
                .success(true)
                .message(
                        "Property updated successfully"
                )
                .data(response)
                .build()

        );

    }









    /*
     * Delete Property
     */
    @Operation(
            summary = "Delete property",
            description = "Soft delete property"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Property deleted successfully"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Property not found"
    )
    @PreAuthorize(
            "hasAnyRole('SUPER_ADMIN','ADMIN')"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProperty(
            @PathVariable String id) {



        propertyService.deleteProperty(id);



        return ResponseEntity.ok(

                ApiResponse.<String>builder()
                .success(true)
                .message(
                        "Property deleted successfully"
                )
                .build()

        );

    }


}