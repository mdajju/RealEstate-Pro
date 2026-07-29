package com.realestatepro.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.NotificationRequest;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.dto.response.NotificationResponse;
import com.realestatepro.service.NotificationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {



    private final NotificationService notificationService;





    /*
     * Create Notification
     */
    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
            @Valid @RequestBody NotificationRequest request) {



        NotificationResponse response =
                notificationService.createNotification(request);



        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                    ApiResponse.<NotificationResponse>builder()
                    .success(true)
                    .message("Notification created successfully")
                    .data(response)
                    .build()
                );

    }







    /*
     * Get User Notifications
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUserNotifications(
            @PathVariable String userId) {



        List<NotificationResponse> response =
                notificationService.getUserNotifications(userId);



        return ResponseEntity.ok(
                ApiResponse.<List<NotificationResponse>>builder()
                .success(true)
                .message("User notifications fetched successfully")
                .data(response)
                .build()
        );

    }







    /*
     * Get Unread Notifications
     */
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUnreadNotifications(
            @PathVariable String userId) {



        List<NotificationResponse> response =
                notificationService.getUnreadNotifications(userId);



        return ResponseEntity.ok(
                ApiResponse.<List<NotificationResponse>>builder()
                .success(true)
                .message("Unread notifications fetched successfully")
                .data(response)
                .build()
        );

    }







    /*
     * Get Unread Notification Count
     */
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @PathVariable String userId) {



        long count =
                notificationService.getUnreadCount(userId);



        return ResponseEntity.ok(
                ApiResponse.<Long>builder()
                .success(true)
                .message("Unread notification count fetched successfully")
                .data(count)
                .build()
        );

    }







    /*
     * Mark Notification As Read
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @PathVariable String notificationId) {



        NotificationResponse response =
                notificationService.markAsRead(notificationId);



        return ResponseEntity.ok(
                ApiResponse.<NotificationResponse>builder()
                .success(true)
                .message("Notification marked as read successfully")
                .data(response)
                .build()
        );

    }







    /*
     * Delete Notification (Soft Delete)
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable String notificationId) {



        notificationService.deleteNotification(notificationId);



        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                .success(true)
                .message("Notification deleted successfully")
                .build()
        );

    }


}