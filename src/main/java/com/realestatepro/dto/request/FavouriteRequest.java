package com.realestatepro.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;



@Data
public class FavouriteRequest {


    @NotBlank(message = "User ID is required")
    private String userId;



    @NotBlank(message = "Property ID is required")
    private String propertyId;

}