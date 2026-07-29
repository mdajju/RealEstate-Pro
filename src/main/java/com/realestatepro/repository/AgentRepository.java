package com.realestatepro.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.Agent;



@Repository
public interface AgentRepository 
        extends MongoRepository<Agent, String> {



    /*
     * Get all active agents
     */
    List<Agent> findByActiveTrue();



    /*
     * Find agent by user id
     */
    Optional<Agent> findByUserIdAndActiveTrue(
            String userId
    );



    /*
     * Check duplicate agent profile
     */
    boolean existsByUserIdAndActiveTrue(
            String userId
    );



    /*
     * Find approved agents
     */
    List<Agent> findByApprovedTrueAndActiveTrue();


}