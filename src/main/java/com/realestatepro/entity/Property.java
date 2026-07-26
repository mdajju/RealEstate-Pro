package com.realestatepro.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.realestatepro.enums.PropertyStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Document(collection = "properties")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Property {


    private String id;


    private String title;


    private String description;


    /*
     * Reference IDs
     */

    private String propertyTypeId;


    private String ownerId;


    private String agentId;


    private String stateId;


    private String cityId;


    /*
     * Location Details
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
     * Media and Features
     */

    private List<String> images;


    private List<String> amenities;


    /*
     * Record Status
     */

    @Builder.Default
    private Boolean active = true;


    @CreatedDate
    private LocalDateTime createdAt;


    @LastModifiedDate
    private LocalDateTime updatedAt;

}