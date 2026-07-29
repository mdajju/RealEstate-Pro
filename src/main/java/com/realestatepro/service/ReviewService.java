package com.realestatepro.service;


import java.util.List;

import com.realestatepro.dto.request.ReviewRequest;
import com.realestatepro.dto.response.ReviewResponse;



public interface ReviewService {



    /*
     * Add property review
     */
    ReviewResponse addReview(
            ReviewRequest request
    );




    /*
     * Get all reviews of a property
     */
    List<ReviewResponse> getPropertyReviews(
            String propertyId
    );




    /*
     * Get reviews submitted by user
     */
    List<ReviewResponse> getUserReviews(
            String userId
    );




    /*
     * Delete review (Soft Delete)
     */
    void deleteReview(
            String reviewId
    );


}