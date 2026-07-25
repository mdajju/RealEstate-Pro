package com.realestatepro.service;

import java.util.List;

import com.realestatepro.dto.request.RoleRequest;
import com.realestatepro.dto.response.RoleResponse;

public interface RoleService {

    RoleResponse createRole(RoleRequest request);

    RoleResponse getRoleById(String id);

    List<RoleResponse> getAllRoles();

    RoleResponse updateRole(String id, RoleRequest request);

    void deleteRole(String id);
}