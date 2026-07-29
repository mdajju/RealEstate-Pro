package com.realestatepro.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.response.AdminDashboardResponse;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.CustomerDashboardResponse;
import com.realestatepro.dto.response.OwnerDashboardResponse;
import com.realestatepro.service.DashboardService;

import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {




    private final DashboardService dashboardService;





    /*
     * Admin Dashboard
     */
    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> 
    getAdminDashboard() {



        AdminDashboardResponse response =
                dashboardService.getAdminDashboard();



        return ResponseEntity.ok(

                ApiResponse
                .<AdminDashboardResponse>builder()

                .success(true)

                .message(
                    "Admin dashboard fetched successfully."
                )

                .data(response)

                .build()

        );

    }








    /*
     * Owner Dashboard
     */
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<ApiResponse<OwnerDashboardResponse>>
    getOwnerDashboard(
            @PathVariable String ownerId) {



        OwnerDashboardResponse response =
                dashboardService
                .getOwnerDashboard(ownerId);



        return ResponseEntity.ok(

                ApiResponse
                .<OwnerDashboardResponse>builder()

                .success(true)

                .message(
                    "Owner dashboard fetched successfully."
                )

                .data(response)

                .build()

        );

    }









    /*
     * Customer Dashboard
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<CustomerDashboardResponse>>
    getCustomerDashboard(
            @PathVariable String customerId) {



        CustomerDashboardResponse response =
                dashboardService
                .getCustomerDashboard(customerId);



        return ResponseEntity.ok(

                ApiResponse
                .<CustomerDashboardResponse>builder()

                .success(true)

                .message(
                    "Customer dashboard fetched successfully."
                )

                .data(response)

                .build()

        );

    }


}