package com.realestatepro.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.UserRequest;
import com.realestatepro.dto.response.UserResponse;
import com.realestatepro.entity.Role;
import com.realestatepro.entity.User;
import com.realestatepro.exception.DuplicateResourceException;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.repository.RoleRepository;
import com.realestatepro.repository.UserRepository;
import com.realestatepro.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse registerUser(UserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists.");
        }

        if (userRepository.existsByMobile(request.getMobile())) {
            throw new DuplicateResourceException("Mobile number already exists.");
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found."));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword()))
                .address(request.getAddress())
                .profileImage(request.getProfileImage())
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    @Override
    public UserResponse getUserById(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        return mapToResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse updateUser(String id, UserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found."));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
        	user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setAddress(request.getAddress());
        user.setProfileImage(request.getProfileImage());
        user.setRole(role);
        user.setUpdatedAt(java.time.LocalDateTime.now());

        User updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    @Override
    public void deleteUser(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        userRepository.delete(user);
    }

    private UserResponse mapToResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .address(user.getAddress())
                .profileImage(user.getProfileImage())
                .roleId(user.getRole() != null ? user.getRole().getId() : null)
                .roleName(user.getRole() != null ? user.getRole().getRoleName().name() : null)
                .status(user.getStatus())
                .verified(user.getVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    
    }
}