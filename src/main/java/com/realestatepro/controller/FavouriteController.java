package com.realestatepro.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.FavouriteRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.FavouriteResponse;
import com.realestatepro.service.FavouriteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/favourites")
@RequiredArgsConstructor
@Validated
public class FavouriteController {



    private final FavouriteService favouriteService;





    /*
     * Add Property To Favourite
     */
    @PostMapping
    public ResponseEntity<ApiResponse<FavouriteResponse>> addFavourite(
            @Valid @RequestBody FavouriteRequest request) {



        FavouriteResponse response =
                favouriteService.addFavourite(request);



        return ResponseEntity.status(HttpStatus.CREATED)

                .body(
                        ApiResponse.<FavouriteResponse>builder()

                        .success(true)

                        .message("Property added to favourites successfully")

                        .data(response)

                        .build()
                );

    }








    /*
     * Get User Favourite Properties
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<FavouriteResponse>>> getMyFavourites(
            @PathVariable String userId) {



        List<FavouriteResponse> response =
                favouriteService.getMyFavourites(userId);



        return ResponseEntity.ok(

                ApiResponse.<List<FavouriteResponse>>builder()

                .success(true)

                .message("Favourite properties fetched successfully")

                .data(response)

                .build()

        );

    }








    /*
     * Remove Favourite Property
     */
    @DeleteMapping("/{userId}/{propertyId}")
    public ResponseEntity<ApiResponse<Void>> removeFavourite(

            @PathVariable String userId,

            @PathVariable String propertyId

    ) {



        favouriteService.removeFavourite(
                userId,
                propertyId
        );



        return ResponseEntity.ok(

                ApiResponse.<Void>builder()

                .success(true)

                .message("Property removed from favourites successfully")

                .build()

        );

    }


}