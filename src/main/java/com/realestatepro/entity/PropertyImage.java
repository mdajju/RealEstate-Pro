package com.realestatepro.entity;


import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "property_images")
public class PropertyImage {


    @Id
    private String id;



    /*
     * Related Property Id
     */
    private String propertyId;



    /*
     * Image URL
     * 
     * Example:
     * AWS S3 URL
     * Cloudinary URL
     */
    private String imageUrl;



    /*
     * Original file name
     */
    private String fileName;



    /*
     * Image order
     * 
     * Useful for gallery display
     */
    @Builder.Default
    private Integer displayOrder = 0;



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



    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

}