package com.realestatepro.service;


import java.util.List;

import com.realestatepro.dto.request.NotificationRequest;
import com.realestatepro.dto.response.NotificationResponse;



public interface NotificationService {



    /*
     * Create notification
     */
    NotificationResponse createNotification(NotificationRequest request);



    /*
     * Get all notifications of user
     */
    List<NotificationResponse> getUserNotifications(String userId);



    /*
     * Get unread notifications
     */
    List<NotificationResponse> getUnreadNotifications(String userId);



    /*
     * Get unread notification count
     */
    long getUnreadCount(String userId);



    /*
     * Mark notification as read
     */
    NotificationResponse markAsRead(String notificationId);



    /*
     * Delete notification (soft delete)
     */
    void deleteNotification(String notificationId);

}