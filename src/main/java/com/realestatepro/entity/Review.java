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
@Document(collection = "reviews")
public class Review {


    @Id
    private String id;



    /*
     * Customer who submitted review
     */
    private String userId;



    /*
     * Property being reviewed
     */
    private String propertyId;



    /*
     * Rating (1-5)
     */
    private Integer rating;



    /*
     * Customer feedback
     */
    private String comment;



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