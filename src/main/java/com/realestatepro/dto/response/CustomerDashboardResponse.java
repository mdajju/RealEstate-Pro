package com.realestatepro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDashboardResponse {

    private long totalBookings;

    private long upcomingVisits;

    private long completedBookings;

    private long cancelledBookings;

    private long favouriteProperties;

    private long reviewsGiven;

    private long notifications;

}