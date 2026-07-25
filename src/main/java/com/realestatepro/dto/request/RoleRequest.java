package com.realestatepro.dto.request;

import com.realestatepro.enums.RoleType;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleRequest {

    @NotNull(message = "Role name is required")
    private RoleType roleName;

    private String description;

    private boolean active;
}