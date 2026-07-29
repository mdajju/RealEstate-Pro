package com.realestatepro.dto.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class PropertyImageRequest {


    /*
     * Related Property ID
     */
    @NotBlank(message = "Property ID is required")
    private String propertyId;



    /*
     * Image URL
     *
     * Later this will come from:
     * AWS S3 / Cloudinary
     */
    @NotBlank(message = "Image URL is required")
    private String imageUrl;



    /*
     * Original uploaded file name
     */
    @NotBlank(message = "File name is required")
    private String fileName;



    /*
     * Image display order
     */
    private Integer displayOrder;

}