package com.realestatepro.service.impl;


import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.response.AdminDashboardResponse;
import com.realestatepro.dto.response.CustomerDashboardResponse;
import com.realestatepro.dto.response.OwnerDashboardResponse;
import com.realestatepro.entity.Property;
import com.realestatepro.entity.Review;
import com.realestatepro.entity.Role;
import com.realestatepro.enums.BookingStatus;
import com.realestatepro.enums.PropertyStatus;
import com.realestatepro.enums.RoleType;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.repository.FavouriteRepository;
import com.realestatepro.repository.NotificationRepository;
import com.realestatepro.repository.PropertyBookingRepository;
import com.realestatepro.repository.PropertyInquiryRepository;
import com.realestatepro.repository.PropertyRepository;
import com.realestatepro.repository.ReviewRepository;
import com.realestatepro.repository.RoleRepository;
import com.realestatepro.repository.UserRepository;
import com.realestatepro.service.DashboardService;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class DashboardServiceImpl 
        implements DashboardService {



    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PropertyRepository propertyRepository;

    private final PropertyBookingRepository bookingRepository;

    private final ReviewRepository reviewRepository;

    private final FavouriteRepository favouriteRepository;

    private final PropertyInquiryRepository inquiryRepository;

    private final NotificationRepository notificationRepository;





    /*
     * ADMIN DASHBOARD
     */
    @Override
    public AdminDashboardResponse getAdminDashboard() {



        Role ownerRole =
                roleRepository
                .findByRoleName(RoleType.OWNER)
                .orElse(null);



        Role customerRole =
                roleRepository
                .findByRoleName(RoleType.CUSTOMER)
                .orElse(null);



        Role agentRole =
                roleRepository
                .findByRoleName(RoleType.AGENT)
                .orElse(null);




        long totalReviews =
                reviewRepository.countByActiveTrue();




        double averageRating =
                reviewRepository.findAll()

                .stream()

                .filter(review ->
                        Boolean.TRUE.equals(
                                review.getActive()
                        )
                )

                .mapToInt(
                        Review::getRating
                )

                .average()

                .orElse(0.0);




        return AdminDashboardResponse.builder()


                .totalUsers(
                        userRepository.count()
                )


                .totalOwners(
                        ownerRole == null
                        ? 0
                        : userRepository.countByRole(ownerRole)
                )


                .totalCustomers(
                        customerRole == null
                        ? 0
                        : userRepository.countByRole(customerRole)
                )


                .totalAgents(
                        agentRole == null
                        ? 0
                        : userRepository.countByRole(agentRole)
                )


                .totalProperties(
                        propertyRepository.countByActiveTrue()
                )


                .approvedProperties(
                        propertyRepository
                        .countByStatus(
                                PropertyStatus.AVAILABLE
                        )
                )


                .pendingProperties(
                        propertyRepository
                        .countByStatus(
                                PropertyStatus.PENDING_APPROVAL
                        )
                )


                .rejectedProperties(
                        propertyRepository
                        .countByStatus(
                                PropertyStatus.REJECTED
                        )
                )



                .totalBookings(
                        bookingRepository.countByActiveTrue()
                )



                .pendingBookings(
                        bookingRepository
                        .countByStatusAndActiveTrue(
                                BookingStatus.PENDING
                        )
                )



                .acceptedBookings(
                        bookingRepository
                        .countByStatusAndActiveTrue(
                                BookingStatus.ACCEPTED
                        )
                )



                .completedBookings(
                        bookingRepository
                        .countByStatusAndActiveTrue(
                                BookingStatus.COMPLETED
                        )
                )



                .cancelledBookings(
                        bookingRepository
                        .countByStatusAndActiveTrue(
                                BookingStatus.CANCELLED
                        )
                )



                .totalReviews(
                        totalReviews
                )



                .averageRating(
                        averageRating
                )



                .totalInquiries(
                        inquiryRepository.countByActiveTrue()
                )



                .totalFavourites(
                        favouriteRepository.countByActiveTrue()
                )


                .build();

    }









    /*
     * OWNER DASHBOARD
     */
    @Override
    public OwnerDashboardResponse getOwnerDashboard(
            String ownerId) {



        userRepository.findById(ownerId)

        .orElseThrow(() ->
                new ResourceNotFoundException(
                        "Owner not found with id : "
                        + ownerId
                )
        );




        List<Property> properties =
                propertyRepository
                .findByOwnerId(ownerId);




        long totalReviews = 0;

        int totalRating = 0;




        for(Property property : properties) {



            List<Review> reviews =
                    reviewRepository
                    .findByPropertyIdAndActiveTrue(
                            property.getId()
                    );



            totalReviews += reviews.size();



            for(Review review : reviews) {

                totalRating += review.getRating();

            }

        }





        double averageRating =
                totalReviews == 0
                ? 0.0
                : (double) totalRating / totalReviews;




        return OwnerDashboardResponse.builder()



                .totalProperties(
                        propertyRepository
                        .countByOwnerIdAndActiveTrue(
                                ownerId
                        )
                )



                .activeProperties(
                        propertyRepository
                        .countByOwnerIdAndStatusAndActiveTrue(
                                ownerId,
                                PropertyStatus.AVAILABLE
                        )
                )



                .pendingProperties(
                        propertyRepository
                        .countByOwnerIdAndStatusAndActiveTrue(
                                ownerId,
                                PropertyStatus.PENDING_APPROVAL
                        )
                )



                .totalBookings(
                        bookingRepository
                        .countByOwnerIdAndActiveTrue(
                                ownerId
                        )
                )



                .pendingBookings(
                        bookingRepository
                        .countByOwnerIdAndStatusAndActiveTrue(
                                ownerId,
                                BookingStatus.PENDING
                        )
                )



                .acceptedBookings(
                        bookingRepository
                        .countByOwnerIdAndStatusAndActiveTrue(
                                ownerId,
                                BookingStatus.ACCEPTED
                        )
                )



                .completedBookings(
                        bookingRepository
                        .countByOwnerIdAndStatusAndActiveTrue(
                                ownerId,
                                BookingStatus.COMPLETED
                        )
                )



                .cancelledBookings(
                        bookingRepository
                        .countByOwnerIdAndStatusAndActiveTrue(
                                ownerId,
                                BookingStatus.CANCELLED
                        )
                )



                .totalReviews(
                        totalReviews
                )



                .averageRating(
                        averageRating
                )



                .totalInquiries(
                        inquiryRepository
                        .countByOwnerIdAndActiveTrue(
                                ownerId
                        )
                )


                .build();

    }









    /*
     * CUSTOMER DASHBOARD
     */
    @Override
    public CustomerDashboardResponse getCustomerDashboard(
            String customerId) {



        userRepository.findById(customerId)

        .orElseThrow(() ->
                new ResourceNotFoundException(
                        "Customer not found with id : "
                        + customerId
                )
        );




        return CustomerDashboardResponse.builder()



                .totalBookings(
                        bookingRepository
                        .countByCustomerIdAndActiveTrue(
                                customerId
                        )
                )



                .upcomingVisits(
                        bookingRepository
                        .countByCustomerIdAndStatusAndActiveTrue(
                                customerId,
                                BookingStatus.ACCEPTED
                        )
                )



                .completedBookings(
                        bookingRepository
                        .countByCustomerIdAndStatusAndActiveTrue(
                                customerId,
                                BookingStatus.COMPLETED
                        )
                )



                .cancelledBookings(
                        bookingRepository
                        .countByCustomerIdAndStatusAndActiveTrue(
                                customerId,
                                BookingStatus.CANCELLED
                        )
                )



                .favouriteProperties(
                        favouriteRepository
                        .countByUserIdAndActiveTrue(
                                customerId
                        )
                )



                .reviewsGiven(
                        reviewRepository
                        .countByUserIdAndActiveTrue(
                                customerId
                        )
                )



                .notifications(
                        notificationRepository
                        .countByUserIdAndReadFalseAndActiveTrue(
                                customerId
                        )
                )



                .build();

    }

}