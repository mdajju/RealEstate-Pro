package com.realestatepro.mapper;


import org.springframework.stereotype.Component;

import com.realestatepro.dto.request.AgentRequest;
import com.realestatepro.dto.response.AgentResponse;
import com.realestatepro.entity.Agent;



@Component
public class AgentMapper {



    /*
     * Convert AgentRequest DTO to Agent Entity
     */
    public Agent toEntity(
            AgentRequest request) {


        return Agent.builder()

                .userId(
                        request.getUserId()
                )

                .licenseNumber(
                        request.getLicenseNumber()
                )

                .experience(
                        request.getExperience()
                )

                .specialization(
                        request.getSpecialization()
                )

                .description(
                        request.getDescription()
                )

                .profileImage(
                        request.getProfileImage()
                )

                .build();

    }





    /*
     * Convert Agent Entity to AgentResponse DTO
     */
    public AgentResponse toResponse(
            Agent agent) {


        return AgentResponse.builder()

                .id(
                        agent.getId()
                )

                .userId(
                        agent.getUserId()
                )

                .licenseNumber(
                        agent.getLicenseNumber()
                )

                .experience(
                        agent.getExperience()
                )

                .specialization(
                        agent.getSpecialization()
                )

                .description(
                        agent.getDescription()
                )

                .profileImage(
                        agent.getProfileImage()
                )

                .status(
                        agent.getStatus()
                )

                .approved(
                        agent.getApproved()
                )

                .active(
                        agent.getActive()
                )

                .createdAt(
                        agent.getCreatedAt()
                )

                .updatedAt(
                        agent.getUpdatedAt()
                )

                .build();

    }



}