package com.realestatepro.service.impl;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.PropertyImageRequest;
import com.realestatepro.dto.response.PropertyImageResponse;
import com.realestatepro.entity.PropertyImage;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.PropertyImageMapper;
import com.realestatepro.repository.PropertyImageRepository;
import com.realestatepro.service.PropertyImageService;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class PropertyImageServiceImpl implements PropertyImageService {



    private final PropertyImageRepository propertyImageRepository;

    private final PropertyImageMapper propertyImageMapper;



    /*
     * Upload Property Image
     */
    @Override
    public PropertyImageResponse uploadImage(PropertyImageRequest request) {


        PropertyImage propertyImage =
                propertyImageMapper.toEntity(request);


        PropertyImage savedImage =
                propertyImageRepository.save(propertyImage);


        return propertyImageMapper.toResponse(savedImage);
    }





    /*
     * Get Images By Property Id
     */
    @Override
    public List<PropertyImageResponse> getImagesByPropertyId(String propertyId) {


        return propertyImageRepository
                .findByPropertyIdAndActiveTrue(propertyId)
                .stream()
                .map(propertyImageMapper::toResponse)
                .toList();
    }






    /*
     * Soft Delete Image
     */
    @Override
    public void deleteImage(String imageId) {


        PropertyImage propertyImage =
                propertyImageRepository.findById(imageId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Property image not found."
                        )
                );



        propertyImage.setActive(false);

        propertyImage.setUpdatedAt(LocalDateTime.now());


        propertyImageRepository.save(propertyImage);

    }

}