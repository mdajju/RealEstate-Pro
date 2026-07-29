package com.realestatepro.mapper;


import org.springframework.stereotype.Component;

import com.realestatepro.dto.request.NotificationRequest;
import com.realestatepro.dto.response.NotificationResponse;
import com.realestatepro.entity.Notification;



@Component
public class NotificationMapper {



    /*
     * Convert Request DTO to Entity
     */
    public Notification toEntity(NotificationRequest request) {


        return Notification.builder()

                .userId(request.getUserId())

                .title(request.getTitle())

                .message(request.getMessage())

                .type(request.getType())

                .referenceId(request.getReferenceId())

                .read(false)

                .active(true)

                .build();

    }





    /*
     * Convert Entity to Response DTO
     */
    public NotificationResponse toResponse(Notification notification) {


        return NotificationResponse.builder()

                .id(notification.getId())

                .userId(notification.getUserId())

                .title(notification.getTitle())

                .message(notification.getMessage())

                .type(notification.getType())

                .referenceId(notification.getReferenceId())

                .read(notification.getRead())

                .active(notification.getActive())

                .createdAt(notification.getCreatedAt())

                .updatedAt(notification.getUpdatedAt())

                .build();

    }

}