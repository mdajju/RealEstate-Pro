package com.realestatepro.entity;


import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.realestatepro.enums.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {



    @Id
    private String id;



    /*
     * User who receives notification
     */
    private String userId;



    /*
     * Notification title
     */
    private String title;



    /*
     * Notification message content
     */
    private String message;



    /*
     * Type of notification
     */
    private NotificationType type;



    /*
     * Related entity ID
     *
     * Example:
     * Booking ID
     * Property ID
     * Inquiry ID
     */
    private String referenceId;



    /*
     * Notification read status
     *
     * false = unread
     * true  = read
     */
    @Builder.Default
    private Boolean read = false;



    /*
     * Soft delete support
     */
    @Builder.Default
    private Boolean active = true;



    @CreatedDate
    private LocalDateTime createdAt;



    @LastModifiedDate
    private LocalDateTime updatedAt;

}