package com.realestatepro.enums;


public enum ComplaintStatus {


    /*
     * Complaint created by user
     */
    PENDING,


    /*
     * Admin is reviewing complaint
     */
    UNDER_REVIEW,


    /*
     * Complaint accepted and action taken
     */
    RESOLVED,


    /*
     * Complaint rejected by admin
     */
    REJECTED,


    /*
     * Complaint closed after resolution
     */
    CLOSED

}