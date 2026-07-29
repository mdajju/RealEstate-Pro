package com.realestatepro.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.PropertyImageRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.PropertyImageResponse;
import com.realestatepro.service.PropertyImageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/property-images")
@RequiredArgsConstructor
@Validated
public class PropertyImageController {



    private final PropertyImageService propertyImageService;




    /*
     * Upload Property Image
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PropertyImageResponse>> uploadImage(
            @Valid @RequestBody PropertyImageRequest request) {


        PropertyImageResponse response =
                propertyImageService.uploadImage(request);



        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                    ApiResponse.<PropertyImageResponse>builder()
                    .success(true)
                    .message("Property image uploaded successfully")
                    .data(response)
                    .build()
                );

    }






    /*
     * Get Images By Property ID
     */
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<ApiResponse<List<PropertyImageResponse>>> getImagesByPropertyId(
            @PathVariable String propertyId) {



        List<PropertyImageResponse> response =
                propertyImageService.getImagesByPropertyId(propertyId);



        return ResponseEntity.ok(
                ApiResponse.<List<PropertyImageResponse>>builder()
                .success(true)
                .message("Property images fetched successfully")
                .data(response)
                .build()
        );

    }







    /*
     * Delete Property Image
     */
    @DeleteMapping("/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable String imageId) {



        propertyImageService.deleteImage(imageId);



        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                .success(true)
                .message("Property image deleted successfully")
                .build()
        );

    }

}