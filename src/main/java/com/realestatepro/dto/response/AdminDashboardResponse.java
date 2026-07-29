package com.realestatepro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;

    private long totalOwners;

    private long totalCustomers;

    private long totalAgents;

    private long totalProperties;

    private long approvedProperties;

    private long pendingProperties;

    private long rejectedProperties;

    private long totalBookings;

    private long pendingBookings;

    private long acceptedBookings;

    private long completedBookings;

    private long cancelledBookings;

    private long totalReviews;

    private double averageRating;

    private long totalInquiries;

    private long totalFavourites;

}