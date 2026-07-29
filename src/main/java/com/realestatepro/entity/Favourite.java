package com.realestatepro.entity;


import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "favourites")
public class Favourite {


    @Id
    private String id;



    /*
     * User who added favourite
     */
    private String userId;



    /*
     * Property added to favourite
     */
    private String propertyId;



    /*
     * Soft Delete
     */
    @Builder.Default
    private Boolean active = true;



    /*
     * Audit Fields
     */
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();



    @LastModifiedDate
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

}