package com.realestatepro.enums;


public enum AgentStatus {


    /*
     * Agent registered but waiting for admin approval
     */
    PENDING,


    /*
     * Admin approved agent
     */
    APPROVED,


    /*
     * Admin rejected agent request
     */
    REJECTED,
    
    
    ACTIVE,
    
    
    BLOCKED,


    /*
     * Agent temporarily blocked
     */
    SUSPENDED

}