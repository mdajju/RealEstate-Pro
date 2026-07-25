package com.realestatepro.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.RoleRequest;
import com.realestatepro.dto.response.RoleResponse;
import com.realestatepro.entity.Role;
import com.realestatepro.repository.RoleRepository;
import com.realestatepro.service.RoleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public RoleResponse createRole(RoleRequest request) {

        if (roleRepository.existsByRoleName(request.getRoleName())) {
            throw new RuntimeException("Role already exists");
        }

        Role role = Role.builder()
                .roleName(request.getRoleName())
                .description(request.getDescription())
                .build();

        role = roleRepository.save(role);

        return mapToResponse(role);
    }

    @Override
    public RoleResponse getRoleById(String id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        return mapToResponse(role);
    }

    @Override
    public List<RoleResponse> getAllRoles() {

        return roleRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponse updateRole(String id, RoleRequest request) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        role.setRoleName(request.getRoleName());
        role.setDescription(request.getDescription());

        role = roleRepository.save(role);

        return mapToResponse(role);
    }

    @Override
    public void deleteRole(String id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        roleRepository.delete(role);
    }

    private RoleResponse mapToResponse(Role role) {

        return RoleResponse.builder()
                .id(role.getId())
                .roleName(role.getRoleName())
                .description(role.getDescription())
                .build();
    }
}