package com.realestatepro.service;

import com.realestatepro.dto.request.LoginRequest;
import com.realestatepro.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

}