package com.ngucochuongque.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderItemRequest {

    @NotNull(message = "productId không được null")
    private Integer productId;

    @NotNull(message = "quantity không được null")
    @Min(value = 1, message = "quantity phải >= 1")
    private Integer quantity;
}
