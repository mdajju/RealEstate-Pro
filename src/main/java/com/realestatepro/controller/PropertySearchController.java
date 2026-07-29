package com.realestatepro.controller;


import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.PropertySearchRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.PropertyResponse;
import com.realestatepro.service.PropertySearchService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertySearchController {


    private final PropertySearchService propertySearchService;



    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','AGENT','OWNER','CUSTOMER')")
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> searchProperties(
            @Valid @RequestBody PropertySearchRequest request) {


        List<PropertyResponse> response =
                propertySearchService.searchProperties(request);



        return ResponseEntity.ok(
                ApiResponse.<List<PropertyResponse>>builder()
                        .success(true)
                        .message("Properties searched successfully")
                        .data(response)
                        .build()
        );
    }

}