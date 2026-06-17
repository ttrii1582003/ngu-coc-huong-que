package com.ngucochuongque.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateOrderStatusRequest {
    @NotBlank
    @Pattern(regexp = "^(pending|confirmed|shipping|delivered|cancelled)$",
             message = "Trạng thái không hợp lệ")
    private String status;
}
