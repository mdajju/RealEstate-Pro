package com.realestatepro.enums;


public enum BookingStatus {


    /*
     * Customer has created booking request
     */
    PENDING,


    /*
     * Owner accepted booking request
     */
    ACCEPTED,


    /*
     * Booking confirmed after final approval/payment
     */
    CONFIRMED,


    /*
     * Property visit or booking process completed
     */
    COMPLETED,


    /*
     * Owner rejected booking request
     */
    REJECTED,


    /*
     * Customer cancelled booking request
     */
    CANCELLED

}