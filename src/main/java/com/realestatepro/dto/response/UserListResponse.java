package com.realestatepro.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserListResponse {


    private String id;


    private String firstName;


    private String lastName;


    private String email;


    private String mobile;


    private String address;


    private String profileImage;


    private String roleId;


    private String roleName;


    private String status;


    private Boolean verified;


    private LocalDateTime createdAt;


    private LocalDateTime updatedAt;

}