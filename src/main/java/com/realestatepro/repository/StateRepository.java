package com.realestatepro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.State;

@Repository
public interface StateRepository extends MongoRepository<State, String> {

    Optional<State> findByStateNameIgnoreCase(String stateName);

    boolean existsByStateNameIgnoreCaseAndActiveTrue(String stateName);

    List<State> findByActiveTrue();

}