package com.realestatepro.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.realestatepro.enums.PropertyStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyResponse {


    private String id;


    private String title;


    private String description;


    /*
     * References
     */

    private String propertyTypeId;


    private String ownerId;


    private String agentId;


    private String stateId;


    private String cityId;


    /*
     * Location
     */

    private String address;


    private Double latitude;


    private Double longitude;


    /*
     * Property Details
     */

    private Double price;


    private Double area;


    private Integer bedrooms;


    private Integer bathrooms;


    private String facing;


    private PropertyStatus status;


    /*
     * Media
     */

    private List<String> images;


    private List<String> amenities;


    /*
     * Status
     */

    private Boolean active;


    /*
     * Auditing
     */

    private LocalDateTime createdAt;


    private LocalDateTime updatedAt;

}