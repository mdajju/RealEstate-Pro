package com.realestatepro.service;

import com.realestatepro.dto.response.AdminDashboardResponse;
import com.realestatepro.dto.response.CustomerDashboardResponse;
import com.realestatepro.dto.response.OwnerDashboardResponse;

public interface DashboardService {

    /**
     * Admin Dashboard Statistics
     */
    AdminDashboardResponse getAdminDashboard();

    /**
     * Owner Dashboard Statistics
     */
    OwnerDashboardResponse getOwnerDashboard(String ownerId);

    /**
     * Customer Dashboard Statistics
     */
    CustomerDashboardResponse getCustomerDashboard(String customerId);

}