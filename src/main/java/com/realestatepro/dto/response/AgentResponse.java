package com.realestatepro.dto.response;


import java.time.LocalDateTime;

import com.realestatepro.enums.AgentStatus;

import lombok.Builder;
import lombok.Data;



@Data
@Builder
public class AgentResponse {



    private String id;



    private String userId;



    private String licenseNumber;



    private Integer experience;



    private String specialization;



    private String description;



    private String profileImage;



    private AgentStatus status;



    private Boolean approved;



    private Boolean active;



    private LocalDateTime createdAt;



    private LocalDateTime updatedAt;


}