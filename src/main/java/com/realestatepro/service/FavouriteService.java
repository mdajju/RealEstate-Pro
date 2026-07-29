package com.realestatepro.service;


import java.util.List;

import com.realestatepro.dto.request.FavouriteRequest;
import com.realestatepro.dto.response.FavouriteResponse;



public interface FavouriteService {



    /*
     * Add property to favourite
     */
    FavouriteResponse addFavourite(FavouriteRequest request);




    /*
     * Get user's favourite properties
     */
    List<FavouriteResponse> getMyFavourites(String userId);




    /*
     * Remove property from favourite
     */
    void removeFavourite(
            String userId,
            String propertyId
    );


}