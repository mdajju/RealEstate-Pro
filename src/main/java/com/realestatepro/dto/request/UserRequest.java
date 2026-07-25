package com.realestatepro.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    @NotBlank(message = "First Name is required")
    private String firstName;

    @NotBlank(message = "Last Name is required")
    private String lastName;

    @Email(message = "Invalid Email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Mobile Number is required")
    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Mobile number must be 10 digits and start with 6-9"
    )
    private String mobile;

    @NotBlank(message = "Password is required")
    private String password;

    private String address;

    private String profileImage;

    @NotBlank(message = "Role Id is required")
    private String roleId;
}