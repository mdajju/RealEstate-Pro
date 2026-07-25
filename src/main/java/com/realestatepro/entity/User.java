package com.realestatepro.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.realestatepro.enums.AccountStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    private String firstName;

    private String lastName;

    private String email;

    private String mobile;

    private String password;

    private String profileImage;

    private String address;

    @DBRef
    private Role role;

    @Builder.Default
    private AccountStatus status = AccountStatus.ACTIVE;

    @Builder.Default
    private Boolean verified = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;
}