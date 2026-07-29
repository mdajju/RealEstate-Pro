package com.realestatepro.service.impl;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;


import com.realestatepro.dto.request.AgentRequest;
import com.realestatepro.dto.response.AgentResponse;
import com.realestatepro.entity.Agent;
import com.realestatepro.enums.AgentStatus;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.AgentMapper;
import com.realestatepro.repository.AgentRepository;
import com.realestatepro.repository.UserRepository;
import com.realestatepro.service.AgentService;


import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class AgentServiceImpl 
        implements AgentService {



    private final AgentRepository agentRepository;

    private final UserRepository userRepository;

    private final AgentMapper agentMapper;




    /*
     * Create Agent
     */
    @Override
    public AgentResponse createAgent(
            AgentRequest request) {



        userRepository.findById(
                request.getUserId()
        )
        .orElseThrow(
                () -> new ResourceNotFoundException(
                        "User not found with id : "
                        + request.getUserId()
                )
        );



        Agent agent =
                agentMapper.toEntity(request);



        agent.setStatus(
                AgentStatus.PENDING
        );


        agent.setApproved(false);


        agent.setActive(true);


        agent.setCreatedAt(
                LocalDateTime.now()
        );



        Agent saved =
                agentRepository.save(agent);



        return agentMapper.toResponse(saved);

    }







    /*
     * Get Agent By Id
     */
    @Override
    public AgentResponse getAgentById(
            String id) {



        Agent agent =
                agentRepository.findById(id)

                .filter(
                    Agent::getActive
                )

                .orElseThrow(
                    () -> new ResourceNotFoundException(
                        "Agent not found with id : "
                        + id
                    )
                );



        return agentMapper.toResponse(agent);

    }







    /*
     * Get All Agents
     */
    @Override
    public List<AgentResponse> getAllAgents() {



        return agentRepository
                .findByActiveTrue()

                .stream()

                .map(agentMapper::toResponse)

                .toList();

    }







    /*
     * Get Agent By User Id
     */
    @Override
    public AgentResponse getAgentByUserId(
            String userId) {



        Agent agent =
                agentRepository
                .findByUserIdAndActiveTrue(userId)

                .orElseThrow(
                    () -> new ResourceNotFoundException(
                        "Agent not found for user id : "
                        + userId
                    )
                );



        return agentMapper.toResponse(agent);

    }







    /*
     * Update Agent
     */
    @Override
    public AgentResponse updateAgent(
            String id,
            AgentRequest request) {



        Agent agent =
                agentRepository.findById(id)

                .orElseThrow(
                    () -> new ResourceNotFoundException(
                        "Agent not found with id : "
                        + id
                    )
                );



        agent.setLicenseNumber(
                request.getLicenseNumber()
        );


        agent.setExperience(
                request.getExperience()
        );


        agent.setSpecialization(
                request.getSpecialization()
        );


        agent.setDescription(
                request.getDescription()
        );


        agent.setProfileImage(
                request.getProfileImage()
        );


        agent.setUpdatedAt(
                LocalDateTime.now()
        );



        Agent updated =
                agentRepository.save(agent);



        return agentMapper.toResponse(updated);

    }







    /*
     * Approve Agent
     */
    @Override
    public AgentResponse approveAgent(
            String id) {



        Agent agent =
                getAgentEntity(id);



        agent.setStatus(
                AgentStatus.APPROVED
        );


        agent.setApproved(true);



        Agent saved =
                agentRepository.save(agent);



        return agentMapper.toResponse(saved);

    }







    /*
     * Reject Agent
     */
    @Override
    public AgentResponse rejectAgent(
            String id) {



        Agent agent =
                getAgentEntity(id);



        agent.setStatus(
                AgentStatus.REJECTED
        );


        agent.setApproved(false);



        Agent saved =
                agentRepository.save(agent);



        return agentMapper.toResponse(saved);

    }







    /*
     * Delete Agent
     */
    @Override
    public void deleteAgent(
            String id) {



        Agent agent =
                getAgentEntity(id);



        agent.setActive(false);


        agent.setUpdatedAt(
                LocalDateTime.now()
        );



        agentRepository.save(agent);

    }








    private Agent getAgentEntity(
            String id) {



        return agentRepository.findById(id)

                .orElseThrow(
                    () -> new ResourceNotFoundException(
                        "Agent not found with id : "
                        + id
                    )
                );

    }

}