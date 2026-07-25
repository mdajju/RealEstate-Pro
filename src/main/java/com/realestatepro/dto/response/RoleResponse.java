package com.realestatepro.dto.response;

import com.realestatepro.enums.RoleType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleResponse {

    private String id;

    private RoleType roleName;

    private String description;

    private boolean active;
}