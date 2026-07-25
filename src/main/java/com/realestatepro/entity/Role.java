package com.realestatepro.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.realestatepro.enums.RoleType;

import lombok.*;

@Document(collection = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    private String id;

    private RoleType roleName;

    private String description;
}