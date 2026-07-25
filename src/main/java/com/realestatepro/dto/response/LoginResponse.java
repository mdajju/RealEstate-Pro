package com.realestatepro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    private String tokenType;

    private String userId;

    private String firstName;

    private String lastName;

    private String email;

    private String role;
}