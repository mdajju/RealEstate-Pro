package com.realestatepro.dto.request;

import lombok.Data;

@Data
public class PropertySearchRequest {


    /*
     * Location Filters
     */

    private String cityId;


    private String stateId;



    /*
     * Property Type
     */

    private String propertyTypeId;



    /*
     * Price Filter
     */

    private Double minPrice;


    private Double maxPrice;



    /*
     * Property Specifications
     */

    private Integer bedrooms;


    private Integer bathrooms;

}