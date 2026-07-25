package com.realestatepro.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.CityRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.CityResponse;
import com.realestatepro.service.CityService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
@Validated
public class CityController {


    private final CityService cityService;


    @PostMapping
    public ResponseEntity<ApiResponse<CityResponse>> createCity(
            @Valid @RequestBody CityRequest request) {


        CityResponse response = cityService.createCity(request);


        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<CityResponse>builder()
                        .success(true)
                        .message("City created successfully")
                        .data(response)
                        .build());
    }



    @GetMapping
    public ResponseEntity<ApiResponse<List<CityResponse>>> getAllCities() {


        List<CityResponse> response = cityService.getAllCities();


        return ResponseEntity.ok(
                ApiResponse.<List<CityResponse>>builder()
                        .success(true)
                        .message("Cities fetched successfully")
                        .data(response)
                        .build());
    }



    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CityResponse>> getCityById(
            @PathVariable String id) {


        CityResponse response = cityService.getCityById(id);


        return ResponseEntity.ok(
                ApiResponse.<CityResponse>builder()
                        .success(true)
                        .message("City fetched successfully")
                        .data(response)
                        .build());
    }



    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CityResponse>> updateCity(
            @PathVariable String id,
            @Valid @RequestBody CityRequest request) {


        CityResponse response = cityService.updateCity(id, request);


        return ResponseEntity.ok(
                ApiResponse.<CityResponse>builder()
                        .success(true)
                        .message("City updated successfully")
                        .data(response)
                        .build());
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCity(
            @PathVariable String id) {


        cityService.deleteCity(id);


        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("City deleted successfully")
                        .build());
    }
}