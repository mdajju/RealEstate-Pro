package com.realestatepro.dto.request;

import java.util.List;

import com.realestatepro.enums.PropertyStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyRequest {


    @NotBlank(message = "Property title is required")
    private String title;


    @NotBlank(message = "Property description is required")
    private String description;


    @NotBlank(message = "Property type is required")
    private String propertyTypeId;


    @NotBlank(message = "Owner is required")
    private String ownerId;


    private String agentId;


    @NotBlank(message = "State is required")
    private String stateId;


    @NotBlank(message = "City is required")
    private String cityId;


    @NotBlank(message = "Address is required")
    private String address;


    private Double latitude;


    private Double longitude;


    @NotNull(message = "Price is required")
    private Double price;


    @NotNull(message = "Area is required")
    private Double area;


    private Integer bedrooms;


    private Integer bathrooms;


    private String facing;


    private PropertyStatus status;


    private List<String> images;


    private List<String> amenities;

}