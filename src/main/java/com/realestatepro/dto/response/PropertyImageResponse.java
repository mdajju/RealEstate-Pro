package com.realestatepro.dto.response;


import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class PropertyImageResponse {


    private String id;



    private String propertyId;



    private String imageUrl;



    private String fileName;



    private Integer displayOrder;



    private Boolean active;



    private LocalDateTime createdAt;



    private LocalDateTime updatedAt;

}