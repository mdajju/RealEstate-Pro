package com.realestatepro.service;


import java.util.List;

import com.realestatepro.dto.request.AgentRequest;
import com.realestatepro.dto.response.AgentResponse;


public interface AgentService {



    /*
     * Create Agent Profile
     */
    AgentResponse createAgent(
            AgentRequest request
    );



    /*
     * Get Agent By Id
     */
    AgentResponse getAgentById(
            String id
    );



    /*
     * Get All Agents
     */
    List<AgentResponse> getAllAgents();



    /*
     * Get Agents By User
     */
    AgentResponse getAgentByUserId(
            String userId
    );



    /*
     * Update Agent
     */
    AgentResponse updateAgent(
            String id,
            AgentRequest request
    );



    /*
     * Approve Agent
     */
    AgentResponse approveAgent(
            String id
    );



    /*
     * Reject Agent
     */
    AgentResponse rejectAgent(
            String id
    );



    /*
     * Delete Agent
     */
    void deleteAgent(
            String id
    );

}