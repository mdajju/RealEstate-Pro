package com.realestatepro.dto.response;


import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;



@Data
@Builder
public class ReviewResponse {



    private String id;



    private String userId;



    private String userName;



    private String propertyId;



    private String propertyTitle;



    private Integer rating;



    private String comment;



    private Boolean active;



    private LocalDateTime createdAt;



    private LocalDateTime updatedAt;


}