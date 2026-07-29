package com.realestatepro.dto.response;


import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;



@Data
@Builder
public class FavouriteResponse {


    private String id;



    private String userId;



    private String propertyId;



    private String propertyTitle;



    private String propertyAddress;



    private Double propertyPrice;



    private Boolean active;



    private LocalDateTime createdAt;



    private LocalDateTime updatedAt;

}