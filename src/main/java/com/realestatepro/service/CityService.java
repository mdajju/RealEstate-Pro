package com.realestatepro.service;

import java.util.List;

import com.realestatepro.dto.request.CityRequest;
import com.realestatepro.dto.response.CityResponse;

public interface CityService {

    CityResponse createCity(CityRequest request);

    List<CityResponse> getAllCities();

    CityResponse getCityById(String id);

    CityResponse updateCity(String id, CityRequest request);

    void deleteCity(String id);
    
    List<CityResponse> getCitiesByState(String stateId);
}