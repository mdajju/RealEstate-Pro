package com.realestatepro.mapper;


import org.springframework.stereotype.Component;

import com.realestatepro.dto.response.PropertyBookingResponse;
import com.realestatepro.entity.PropertyBooking;



@Component
public class PropertyBookingMapper {



    /*
     * Entity -> Response DTO
     */
    public PropertyBookingResponse toResponse(PropertyBooking booking) {


        if (booking == null) {
            return null;
        }


        return PropertyBookingResponse.builder()

                .id(booking.getId())

                .propertyId(booking.getPropertyId())

                .customerId(booking.getCustomerId())

                .ownerId(booking.getOwnerId())

                .message(booking.getMessage())

                .visitDate(booking.getVisitDate())

                .status(booking.getStatus())

                .active(booking.getActive())

                .createdAt(booking.getCreatedAt())

                .updatedAt(booking.getUpdatedAt())

                .build();

    }



}