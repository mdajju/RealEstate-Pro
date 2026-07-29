package com.realestatepro.dto.request;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Data;



@Data
public class ReviewRequest {



    /*
     * Customer ID
     */
    @NotBlank(message = "User ID is required")
    private String userId;



    /*
     * Property ID
     */
    @NotBlank(message = "Property ID is required")
    private String propertyId;



    /*
     * Rating value 1-5
     */
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be minimum 1")
    @Max(value = 5, message = "Rating must be maximum 5")
    private Integer rating;



    /*
     * Review comment
     */
    @NotBlank(message = "Comment is required")
    private String comment;


}