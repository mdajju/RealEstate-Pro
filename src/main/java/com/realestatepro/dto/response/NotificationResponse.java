package com.realestatepro.dto.response;


import java.time.LocalDateTime;

import com.realestatepro.enums.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {



    private String id;



    private String userId;



    private String title;



    private String message;



    private NotificationType type;



    private String referenceId;



    private Boolean read;



    private Boolean active;



    private LocalDateTime createdAt;



    private LocalDateTime updatedAt;


}