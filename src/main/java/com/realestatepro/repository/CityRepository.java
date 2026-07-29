package com.realestatepro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.City;


@Repository
public interface CityRepository extends MongoRepository<City, String> {


    Optional<City> findByCityNameIgnoreCase(String cityName);


    boolean existsByCityNameIgnoreCaseAndActiveTrue(String cityName);


    List<City> findByStateId(String stateId);


    List<City> findByActiveTrue();
    
    

}