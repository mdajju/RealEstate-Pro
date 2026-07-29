package com.realestatepro.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.ReviewRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.ReviewResponse;
import com.realestatepro.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Validated
public class ReviewController {



    private final ReviewService reviewService;





    /*
     * Add Property Review
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(
            @Valid @RequestBody ReviewRequest request) {



        ReviewResponse response =
                reviewService.addReview(request);



        return ResponseEntity.status(HttpStatus.CREATED)

                .body(
                        ApiResponse.<ReviewResponse>builder()

                        .success(true)

                        .message("Review added successfully")

                        .data(response)

                        .build()
                );

    }









    /*
     * Get Reviews By Property
     */
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getPropertyReviews(
            @PathVariable String propertyId) {



        List<ReviewResponse> response =
                reviewService.getPropertyReviews(propertyId);



        return ResponseEntity.ok(

                ApiResponse.<List<ReviewResponse>>builder()

                .success(true)

                .message("Property reviews fetched successfully")

                .data(response)

                .build()

        );

    }









    /*
     * Get Reviews By User
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getUserReviews(
            @PathVariable String userId) {



        List<ReviewResponse> response =
                reviewService.getUserReviews(userId);



        return ResponseEntity.ok(

                ApiResponse.<List<ReviewResponse>>builder()

                .success(true)

                .message("User reviews fetched successfully")

                .data(response)

                .build()

        );

    }









    /*
     * Delete Review (Soft Delete)
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable String reviewId) {



        reviewService.deleteReview(reviewId);



        return ResponseEntity.ok(

                ApiResponse.<Void>builder()

                .success(true)

                .message("Review deleted successfully")

                .build()

        );

    }


}