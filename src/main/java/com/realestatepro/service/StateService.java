package com.realestatepro.service;

import java.util.List;

import com.realestatepro.dto.request.StateRequest;
import com.realestatepro.dto.response.StateResponse;

public interface StateService {

    StateResponse createState(StateRequest request);

    List<StateResponse> getAllStates();

    StateResponse getStateById(String id);

    StateResponse updateState(String id, StateRequest request);

    void deleteState(String id);

}