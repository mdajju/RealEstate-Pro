package com.realestatepro.entity;


import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.realestatepro.enums.ComplaintStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "complaints")
public class Complaint {



    @Id
    private String id;



    /*
     * User who created complaint
     */
    private String userId;



    /*
     * Against whom complaint is raised
     *
     * Owner / Agent / Customer
     */
    private String againstUserId;



    /*
     * Related Property
     */
    private String propertyId;



    /*
     * Complaint Title
     */
    private String title;



    /*
     * Complaint Description
     */
    private String description;



    /*
     * Complaint Status
     */
    @Builder.Default
    private ComplaintStatus status =
            ComplaintStatus.PENDING;



    /*
     * Admin response
     */
    private String adminRemark;



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