package com.realestatepro.service;

import java.util.List;

import com.realestatepro.dto.request.UserRequest;
import com.realestatepro.dto.response.UserListResponse;
import com.realestatepro.dto.response.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    UserResponse getUserById(String id);

    
    
    List<UserResponse> getAllUsers();

    UserResponse updateUser(String id, UserRequest request);

    void deleteUser(String id);
}