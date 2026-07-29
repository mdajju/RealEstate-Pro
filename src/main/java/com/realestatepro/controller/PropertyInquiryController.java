package com.realestatepro.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.PropertyInquiryRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.PropertyInquiryResponse;
import com.realestatepro.service.PropertyInquiryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/property-inquiries")
@RequiredArgsConstructor
@Validated
public class PropertyInquiryController {



    private final PropertyInquiryService propertyInquiryService;




    /*
     * Create Property Inquiry
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PropertyInquiryResponse>> createInquiry(
            @Valid @RequestBody PropertyInquiryRequest request) {



        PropertyInquiryResponse response =
                propertyInquiryService.createInquiry(request);



        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                    ApiResponse.<PropertyInquiryResponse>builder()
                    .success(true)
                    .message("Property inquiry created successfully")
                    .data(response)
                    .build()
                );

    }







    /*
     * Get Customer Inquiries
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<PropertyInquiryResponse>>> getCustomerInquiries(
            @PathVariable String customerId) {



        List<PropertyInquiryResponse> response =
                propertyInquiryService.getCustomerInquiries(customerId);



        return ResponseEntity.ok(
                ApiResponse.<List<PropertyInquiryResponse>>builder()
                .success(true)
                .message("Customer inquiries fetched successfully")
                .data(response)
                .build()
        );

    }








    /*
     * Get Owner Received Inquiries
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<ApiResponse<List<PropertyInquiryResponse>>> getOwnerInquiries(
            @PathVariable String ownerId) {



        List<PropertyInquiryResponse> response =
                propertyInquiryService.getOwnerInquiries(ownerId);



        return ResponseEntity.ok(
                ApiResponse.<List<PropertyInquiryResponse>>builder()
                .success(true)
                .message("Owner inquiries fetched successfully")
                .data(response)
                .build()
        );

    }








    /*
     * Get Property Inquiries
     */
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<ApiResponse<List<PropertyInquiryResponse>>> getPropertyInquiries(
            @PathVariable String propertyId) {



        List<PropertyInquiryResponse> response =
                propertyInquiryService.getPropertyInquiries(propertyId);



        return ResponseEntity.ok(
                ApiResponse.<List<PropertyInquiryResponse>>builder()
                .success(true)
                .message("Property inquiries fetched successfully")
                .data(response)
                .build()
        );

    }








    /*
     * Accept Inquiry
     */
    @PutMapping("/{inquiryId}/accept")
    public ResponseEntity<ApiResponse<PropertyInquiryResponse>> acceptInquiry(
            @PathVariable String inquiryId) {



        PropertyInquiryResponse response =
                propertyInquiryService.acceptInquiry(inquiryId);



        return ResponseEntity.ok(
                ApiResponse.<PropertyInquiryResponse>builder()
                .success(true)
                .message("Inquiry accepted successfully")
                .data(response)
                .build()
        );

    }








    /*
     * Reject Inquiry
     */
    @PutMapping("/{inquiryId}/reject")
    public ResponseEntity<ApiResponse<PropertyInquiryResponse>> rejectInquiry(
            @PathVariable String inquiryId) {



        PropertyInquiryResponse response =
                propertyInquiryService.rejectInquiry(inquiryId);



        return ResponseEntity.ok(
                ApiResponse.<PropertyInquiryResponse>builder()
                .success(true)
                .message("Inquiry rejected successfully")
                .data(response)
                .build()
        );

    }








    /*
     * Close Inquiry
     */
    @PutMapping("/{inquiryId}/close")
    public ResponseEntity<ApiResponse<PropertyInquiryResponse>> closeInquiry(
            @PathVariable String inquiryId) {



        PropertyInquiryResponse response =
                propertyInquiryService.closeInquiry(inquiryId);



        return ResponseEntity.ok(
                ApiResponse.<PropertyInquiryResponse>builder()
                .success(true)
                .message("Inquiry closed successfully")
                .data(response)
                .build()
        );

    }









    /*
     * Delete Inquiry
     */
    @DeleteMapping("/{inquiryId}")
    public ResponseEntity<ApiResponse<Void>> deleteInquiry(
            @PathVariable String inquiryId) {



        propertyInquiryService.deleteInquiry(inquiryId);



        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                .success(true)
                .message("Inquiry deleted successfully")
                .build()
        );

    }


}