package com.realestatepro.service.impl;


import java.time.LocalDateTime;
import com.realestatepro.exception.ResourceAlreadyExistsException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.FavouriteRequest;
import com.realestatepro.dto.response.FavouriteResponse;
import com.realestatepro.entity.Favourite;
import com.realestatepro.entity.Property;
import com.realestatepro.exception.DuplicateResourceException;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.FavouriteMapper;
import com.realestatepro.repository.FavouriteRepository;
import com.realestatepro.repository.PropertyRepository;
import com.realestatepro.service.FavouriteService;

import lombok.RequiredArgsConstructor;

import com.realestatepro.repository.UserRepository;



@Service
@RequiredArgsConstructor
public class FavouriteServiceImpl implements FavouriteService {



    private final FavouriteRepository favouriteRepository;

    private final PropertyRepository propertyRepository;

    private final FavouriteMapper favouriteMapper;
    
    private final UserRepository userRepository;





    /*
     * Add Property Favourite
     */
    @Override
    public FavouriteResponse addFavourite(FavouriteRequest request) {

    	userRepository.findById(request.getUserId())
        .orElseThrow(() ->
                new ResourceNotFoundException(
                        "User not found with id : "
                        + request.getUserId()
                )
        );

        if (favouriteRepository
                .existsByUserIdAndPropertyIdAndActiveTrue(
                        request.getUserId(),
                        request.getPropertyId())) {


        	throw new ResourceAlreadyExistsException(
        	        "Property already added to favourites for this user."
        	);
        }



        Property property = propertyRepository
                .findById(request.getPropertyId())
                .orElseThrow(() ->
                new ResourceNotFoundException(
                        "Property not found with id : "
                        + request.getPropertyId()
                )
       
                );



        Favourite favourite = Favourite.builder()

                .userId(request.getUserId())

                .propertyId(property.getId())

                .active(true)

                .createdAt(LocalDateTime.now())

                .updatedAt(LocalDateTime.now())

                .build();



        Favourite savedFavourite =
                favouriteRepository.save(favourite);



        return buildFavouriteResponse(savedFavourite, property);

    }






    /*
     * Get User Favourite Properties
     */
    @Override
    public List<FavouriteResponse> getMyFavourites(String userId) {


        userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id : "
                                + userId
                        )
                );


        return favouriteRepository
                .findByUserIdAndActiveTrue(userId)

                .stream()

                .map(favourite -> {


                    Property property =
                            propertyRepository
                                    .findById(
                                            favourite.getPropertyId()
                                    )
                                    .orElse(null);



                    return buildFavouriteResponse(
                            favourite,
                            property
                    );


                })

                .toList();

    }







    /*
     * Remove Favourite (Soft Delete)
     */
    @Override
    public void removeFavourite(
            String userId,
            String propertyId) {



        
        		Favourite favourite =
                favouriteRepository
                        .findByUserIdAndPropertyIdAndActiveTrue(
                                userId,
                                propertyId
                        )

                        .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Favourite not found for user id : "
                                + userId
                                + " and property id : "
                                + propertyId
                        )
                );



        favourite.setActive(false);

        favourite.setUpdatedAt(LocalDateTime.now());



        favouriteRepository.save(favourite);

    }









    /*
     * Prepare Response With Property Details
     */
    private FavouriteResponse buildFavouriteResponse(
            Favourite favourite,
            Property property) {



        FavouriteResponse response =
                favouriteMapper.toResponse(favourite);



        if(property != null) {


            response.setPropertyTitle(
                    property.getTitle()
            );


            response.setPropertyAddress(
                    property.getAddress()
            );


            response.setPropertyPrice(
                    property.getPrice()
            );

        }



        return response;

    }

}