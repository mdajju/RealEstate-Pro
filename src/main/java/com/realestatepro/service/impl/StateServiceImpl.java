package com.realestatepro.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.StateRequest;
import com.realestatepro.dto.response.StateResponse;
import com.realestatepro.entity.State;
import com.realestatepro.exception.DuplicateResourceException;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.mapper.StateMapper;
import com.realestatepro.repository.StateRepository;
import com.realestatepro.service.StateService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StateServiceImpl implements StateService {

    private final StateRepository stateRepository;
    private final StateMapper stateMapper;

    @Override
    public StateResponse createState(StateRequest request) {

        if (stateRepository.existsByStateNameIgnoreCaseAndActiveTrue(request.getStateName())) {
        	throw new DuplicateResourceException("State already exists.");
        }

        State state = stateMapper.toEntity(request);

        State savedState = stateRepository.save(state);

        return stateMapper.toResponse(savedState);
    }

    @Override
    public List<StateResponse> getAllStates() {

        return stateRepository.findByActiveTrue()
                .stream()
                .map(stateMapper::toResponse)
                .toList();
    }

    @Override
    public StateResponse getStateById(String id) {

        State state = stateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("State not found."));

        return stateMapper.toResponse(state);
    }

    @Override
    public StateResponse updateState(String id, StateRequest request) {

        System.out.println("UPDATE ID : " + id);
        System.out.println("NEW STATE NAME : " + request.getStateName());

        State state = stateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("State not found."));

        System.out.println("FOUND STATE : " + state.getStateName());

        if (!state.getStateName().equalsIgnoreCase(request.getStateName())
                && stateRepository.existsByStateNameIgnoreCaseAndActiveTrue(request.getStateName())) {

            throw new DuplicateResourceException("State already exists.");
        }

        state.setStateName(request.getStateName());
        state.setUpdatedAt(LocalDateTime.now());

        State updatedState = stateRepository.save(state);

        return stateMapper.toResponse(updatedState);
    }

    @Override
    public void deleteState(String id) {

    	State state = stateRepository.findById(id)
    	        .orElseThrow(() -> new ResourceNotFoundException("State not found."));

        state.setActive(false);
        state.setUpdatedAt(LocalDateTime.now());

        stateRepository.save(state);
    }

}