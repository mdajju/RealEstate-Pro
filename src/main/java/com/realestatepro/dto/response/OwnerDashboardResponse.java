package com.realestatepro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDashboardResponse {

    private long totalProperties;

    private long activeProperties;

    private long pendingProperties;

    private long totalBookings;

    private long pendingBookings;

    private long acceptedBookings;

    private long completedBookings;

    private long cancelledBookings;

    private long totalReviews;

    private double averageRating;

    private long totalInquiries;

}