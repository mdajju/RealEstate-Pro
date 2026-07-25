package com.realestatepro.dto.response;

import java.time.LocalDateTime;

import com.realestatepro.enums.AccountStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;

    private String firstName;

    private String lastName;

    private String email;

    private String mobile;

    private String address;

    private String profileImage;

    private String roleId;

    private String roleName;

    private AccountStatus status;

    private Boolean verified;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}