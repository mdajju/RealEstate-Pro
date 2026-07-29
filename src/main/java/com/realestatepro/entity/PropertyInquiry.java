package com.realestatepro.entity;


import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.realestatepro.enums.InquiryStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "property_inquiries")
public class PropertyInquiry {



    @Id
    private String id;



    /*
     * Property for which inquiry is created
     */
    private String propertyId;



    /*
     * Customer who created inquiry
     */
    private String customerId;



    /*
     * Property owner
     */
    private String ownerId;



    /*
     * Customer message
     */
    private String message;



    /*
     * Inquiry status
     */
    @Builder.Default
    private InquiryStatus status = InquiryStatus.PENDING;



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