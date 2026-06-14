package com.ngucochuongque.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class CreateOrderRequest {

    @NotBlank(message = "Vui lòng nhập họ tên")
    private String customerName;

    @NotBlank(message = "Vui lòng nhập số điện thoại")
    @Pattern(regexp = "^[0-9]{9,11}$", message = "Số điện thoại không hợp lệ")
    private String customerPhone;

    private String customerEmail;

    @NotBlank(message = "Vui lòng nhập địa chỉ")
    private String address;

    @NotBlank(message = "Vui lòng chọn tỉnh/thành")
    private String city;

    private String district;

    @NotBlank(message = "deliveryMethod không được trống")
    @Pattern(regexp = "^(standard|express)$", message = "deliveryMethod phải là standard hoặc express")
    private String deliveryMethod;

    @NotBlank(message = "paymentMethod không được trống")
    @Pattern(regexp = "^(cod|bank)$", message = "paymentMethod phải là cod hoặc bank")
    private String paymentMethod;

    @NotEmpty(message = "Đơn hàng phải có ít nhất 1 sản phẩm")
    @Valid
    private List<OrderItemRequest> items;
}
