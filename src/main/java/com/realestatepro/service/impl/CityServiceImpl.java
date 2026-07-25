package com.realestatepro.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.CityRequest;
import com.realestatepro.dto.response.CityResponse;
import com.realestatepro.entity.City;
import com.realestatepro.entity.State;
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


    @Override
    public CityResponse createCity(CityRequest request) {

        if (cityRepository.existsByCityNameIgnoreCaseAndActiveTrue(request.getCityName())) {
            throw new DuplicateResourceException("City already exists.");
        }

        State state = stateRepository.findById(request.getStateId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("State not found.")
                );


        City city = cityMapper.toEntity(request);

        city.setState(state);

        City savedCity = cityRepository.save(city);

        return cityMapper.toResponse(savedCity);
    }


    @Override
    public List<CityResponse> getAllCities() {

        return cityRepository.findByActiveTrue()
                .stream()
                .map(cityMapper::toResponse)
                .toList();
    }


    @Override
    public CityResponse getCityById(String id) {

        City city = cityRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("City not found.")
                );

        return cityMapper.toResponse(city);
    }


    @Override
    public CityResponse updateCity(String id, CityRequest request) {

        City city = cityRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("City not found.")
                );


        if (!city.getCityName().equalsIgnoreCase(request.getCityName())
                && cityRepository.existsByCityNameIgnoreCaseAndActiveTrue(request.getCityName())) {

            throw new DuplicateResourceException("City already exists.");
        }


        State state = stateRepository.findById(request.getStateId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("State not found.")
                );


        city.setCityName(request.getCityName());
        city.setState(state);
        city.setUpdatedAt(LocalDateTime.now());


        City updatedCity = cityRepository.save(city);

        return cityMapper.toResponse(updatedCity);
    }


    @Override
    public void deleteCity(String id) {

        City city = cityRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("City not found.")
                );


        city.setActive(false);
        city.setUpdatedAt(LocalDateTime.now());

        cityRepository.save(city);
    }
}