package com.ngucochuongque.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateProfileRequest {
    @NotBlank
    private String fullName;
    private String phone;
}
