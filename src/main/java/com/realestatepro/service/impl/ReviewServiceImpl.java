package com.realestatepro.service.impl;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.ReviewRequest;
import com.realestatepro.dto.response.ReviewResponse;
import com.realestatepro.entity.Property;
import com.realestatepro.entity.Review;
import com.realestatepro.entity.User;
import com.realestatepro.exception.DuplicateResourceException;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.ReviewMapper;
import com.realestatepro.repository.PropertyRepository;
import com.realestatepro.repository.ReviewRepository;
import com.realestatepro.repository.UserRepository;
import com.realestatepro.service.ReviewService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {


    private final ReviewRepository reviewRepository;

    private final PropertyRepository propertyRepository;

    private final UserRepository userRepository;

    private final ReviewMapper reviewMapper;



    /*
     * Add Review
     */
    @Override
    public ReviewResponse addReview(
            ReviewRequest request) {



        /*
         * Check User Exists
         */
        User user =
                userRepository
                        .findById(request.getUserId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found with id : "
                                        + request.getUserId()
                                )
                        );



        /*
         * Check Duplicate Review
         */
        if(reviewRepository
                .existsByUserIdAndPropertyIdAndActiveTrue(
                        request.getUserId(),
                        request.getPropertyId())) {


            throw new DuplicateResourceException(
                    "User already reviewed this property."
            );

        }



        /*
         * Validate Rating
         */
        if(request.getRating() < 1 ||
                request.getRating() > 5) {


            throw new IllegalArgumentException(
                    "Rating must be between 1 and 5"
            );

        }



        /*
         * Validate Property
         */
        Property property =
                propertyRepository
                        .findById(request.getPropertyId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Property not found with id : "
                                        + request.getPropertyId()
                                )
                        );



        Review review =
                Review.builder()

                .userId(user.getId())

                .propertyId(property.getId())

                .rating(request.getRating())

                .comment(request.getComment())

                .active(true)

                .createdAt(LocalDateTime.now())

                .updatedAt(LocalDateTime.now())

                .build();



        Review savedReview =
                reviewRepository.save(review);



        return buildReviewResponse(
                savedReview,
                property
        );

    }







    /*
     * Get Property Reviews
     */
    @Override
    public List<ReviewResponse> getPropertyReviews(
            String propertyId) {



        propertyRepository
                .findById(propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property not found with id : "
                                + propertyId
                        )
                );



        return reviewRepository
                .findByPropertyIdAndActiveTrue(propertyId)

                .stream()

                .map(review -> {


                    Property property =
                            propertyRepository
                                    .findById(
                                            review.getPropertyId()
                                    )
                                    .orElse(null);



                    return buildReviewResponse(
                            review,
                            property
                    );


                })

                .toList();

    }







    /*
     * Get User Reviews
     */
    @Override
    public List<ReviewResponse> getUserReviews(
            String userId) {



        userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id : "
                                + userId
                        )
                );



        return reviewRepository
                .findByUserIdAndActiveTrue(userId)

                .stream()

                .map(review -> {


                    Property property =
                            propertyRepository
                                    .findById(
                                            review.getPropertyId()
                                    )
                                    .orElse(null);



                    return buildReviewResponse(
                            review,
                            property
                    );


                })

                .toList();

    }








    /*
     * Delete Review
     */
    @Override
    public void deleteReview(
            String reviewId) {



        Review review =
                reviewRepository
                        .findById(reviewId)

                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Review not found with id : "
                                        + reviewId
                                )
                        );



        review.setActive(false);

        review.setUpdatedAt(
                LocalDateTime.now()
        );



        reviewRepository.save(review);

    }








    /*
     * Build Response
     */
    private ReviewResponse buildReviewResponse(
            Review review,
            Property property) {



        ReviewResponse response =
                reviewMapper.toResponse(review);



        if(property != null) {


            response.setPropertyTitle(
                    property.getTitle()
            );

        }



        User user =
                userRepository
                        .findById(review.getUserId())
                        .orElse(null);



        if(user != null) {


            response.setUserName(
                    user.getFirstName()
                    + " "
                    + user.getLastName()
            );

        }



        return response;

    }


}