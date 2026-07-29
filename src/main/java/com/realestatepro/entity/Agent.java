package com.realestatepro.entity;


import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.realestatepro.enums.AgentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "agents")
public class Agent {



    @Id
    private String id;



    /*
     * Existing User Reference
     */
    private String userId;



    /*
     * Agent Information
     */
    private String licenseNumber;


    private Integer experience;


    private String specialization;


    private String description;


    private String profileImage;



    /*
     * Agent Status
     */
    @Builder.Default
    private AgentStatus status = AgentStatus.PENDING;



    /*
     * Approval
     */
    @Builder.Default
    private Boolean approved = false;



    /*
     * Soft Delete
     */
    @Builder.Default
    private Boolean active = true;



    /*
     * Audit Fields
     */
    @Builder.Default
    private LocalDateTime createdAt =
            LocalDateTime.now();



    @LastModifiedDate
    private LocalDateTime updatedAt;


}