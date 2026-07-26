package com.realestatepro.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.CityRequest;
import com.realestatepro.dto.response.CityResponse;
import com.realestatepro.entity.City;
import com.realestatepro.exception.DuplicateResourceException;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.CityMapper;
import com.realestatepro.repository.CityRepository;
import com.realestatepro.repository.StateRepository;
import com.realestatepro.service.CityService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class CityServiceImpl implements CityService {


    private final CityRepository cityRepository;

    private final StateRepository stateRepository;

    private final CityMapper cityMapper;



    /*
     * Convert City Entity to City Response
     * and fetch State Name using stateId
     */
    private CityResponse mapCityResponse(City city) {

        CityResponse response = cityMapper.toResponse(city);


        stateRepository.findById(city.getStateId())
                .ifPresent(state ->
                        response.setStateName(state.getStateName())
                );


        return response;
    }



    @Override
    public CityResponse createCity(CityRequest request) {


        if (cityRepository.existsByCityNameIgnoreCaseAndActiveTrue(request.getCityName())) {

            throw new DuplicateResourceException(
                    "City already exists."
            );
        }


        City city = cityMapper.toEntity(request);


        City savedCity = cityRepository.save(city);


        return mapCityResponse(savedCity);
    }




    @Override
    public List<CityResponse> getAllCities() {


        return cityRepository.findByActiveTrue()
                .stream()
                .map(this::mapCityResponse)
                .toList();
    }





    @Override
    public CityResponse getCityById(String id) {


        City city = cityRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "City not found."
                        )
                );


        return mapCityResponse(city);
    }





    @Override
    public CityResponse updateCity(
            String id,
            CityRequest request) {


        City city = cityRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "City not found."
                        )
                );



        if (!city.getCityName()
                .equalsIgnoreCase(request.getCityName())
                &&
            cityRepository.existsByCityNameIgnoreCaseAndActiveTrue(
                    request.getCityName())) {


            throw new DuplicateResourceException(
                    "City already exists."
            );
        }



        city.setCityName(request.getCityName());

        city.setStateId(request.getStateId());

        city.setUpdatedAt(LocalDateTime.now());



        City updatedCity = cityRepository.save(city);



        return mapCityResponse(updatedCity);
    }






    @Override
    public void deleteCity(String id) {


        City city = cityRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "City not found."
                        )
                );



        city.setActive(false);

        city.setUpdatedAt(LocalDateTime.now());



        cityRepository.save(city);
    }

}