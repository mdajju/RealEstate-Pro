package com.realestatepro.dto.request;


import com.realestatepro.enums.NotificationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {



    /*
     * User who will receive notification
     */
    @NotBlank(message = "User ID is required")
    private String userId;



    /*
     * Notification title
     */
    @NotBlank(message = "Notification title is required")
    private String title;



    /*
     * Notification message
     */
    @NotBlank(message = "Notification message is required")
    private String message;



    /*
     * Notification category
     */
    @NotNull(message = "Notification type is required")
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


}