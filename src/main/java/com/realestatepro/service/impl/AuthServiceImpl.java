package com.realestatepro.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.LoginRequest;
import com.realestatepro.dto.response.LoginResponse;
import com.realestatepro.security.CustomUserDetails;
import com.realestatepro.security.JwtService;
import com.realestatepro.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public LoginResponse login(LoginRequest request) {

        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        CustomUserDetails user =
                (CustomUserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(user);

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getUser().getId())
                .firstName(user.getUser().getFirstName())
                .lastName(user.getUser().getLastName())
                .email(user.getUser().getEmail())
                .role(user.getUser().getRole().getRoleName().name())
                .build();
    }
}