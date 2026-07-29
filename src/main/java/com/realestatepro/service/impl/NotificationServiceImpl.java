package com.realestatepro.service.impl;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.NotificationRequest;
import com.realestatepro.dto.response.NotificationResponse;
import com.realestatepro.entity.Notification;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.NotificationMapper;
import com.realestatepro.repository.NotificationRepository;
import com.realestatepro.repository.UserRepository;
import com.realestatepro.service.NotificationService;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class NotificationServiceImpl 
        implements NotificationService {




    private final NotificationRepository notificationRepository;

    private final NotificationMapper notificationMapper;

    private final UserRepository userRepository;





    /*
     * Create Notification
     */
    @Override
    public NotificationResponse createNotification(
            NotificationRequest request) {


        userRepository.findById(
                request.getUserId()
        )
        .orElseThrow(() ->
                new ResourceNotFoundException(
                        "User not found with id : "
                        + request.getUserId()
                )
        );



        Notification notification =
                notificationMapper.toEntity(request);



        notification.setRead(false);

        notification.setActive(true);

        notification.setCreatedAt(
                LocalDateTime.now()
        );

        notification.setUpdatedAt(
                LocalDateTime.now()
        );



        Notification savedNotification =
                notificationRepository.save(notification);



        return notificationMapper.toResponse(
                savedNotification
        );

    }









    /*
     * Get All User Notifications
     */
    @Override
    public List<NotificationResponse> getUserNotifications(
            String userId) {



        userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id : "
                                + userId
                        )
                );



        return notificationRepository
                .findByUserIdAndActiveTrue(userId)

                .stream()

                .map(notificationMapper::toResponse)

                .toList();

    }









    /*
     * Get Unread Notifications
     */
    @Override
    public List<NotificationResponse> getUnreadNotifications(
            String userId) {



        return notificationRepository
                .findByUserIdAndReadFalseAndActiveTrue(userId)

                .stream()

                .map(notificationMapper::toResponse)

                .toList();

    }









    /*
     * Count Unread Notifications
     */
    @Override
    public long getUnreadCount(
            String userId) {


        return notificationRepository
                .countByUserIdAndReadFalseAndActiveTrue(
                        userId
                );

    }









    /*
     * Mark Notification As Read
     */
    @Override
    public NotificationResponse markAsRead(
            String notificationId) {



        Notification notification =
                notificationRepository.findById(notificationId)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Notification not found with id : "
                                + notificationId
                        )
                );



        notification.setRead(true);



        notification.setUpdatedAt(
                LocalDateTime.now()
        );



        Notification updatedNotification =
                notificationRepository.save(notification);



        return notificationMapper.toResponse(
                updatedNotification
        );

    }









    /*
     * Soft Delete Notification
     */
    @Override
    public void deleteNotification(
            String notificationId) {



        Notification notification =
                notificationRepository.findById(notificationId)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Notification not found with id : "
                                + notificationId
                        )
                );



        notification.setActive(false);



        notification.setUpdatedAt(
                LocalDateTime.now()
        );



        notificationRepository.save(notification);

    }


}