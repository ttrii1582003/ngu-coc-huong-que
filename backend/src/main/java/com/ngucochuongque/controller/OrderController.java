package com.ngucochuongque.controller;

import com.ngucochuongque.dto.request.CreateOrderRequest;
import com.ngucochuongque.dto.response.OrderResponse;
import com.ngucochuongque.entity.User;
import com.ngucochuongque.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> create(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal User currentUser) {
        Integer userId = currentUser != null ? currentUser.getId() : null;
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(request, userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.findMyOrders(currentUser.getId()));
    }

    @GetMapping("/{orderCode}")
    public ResponseEntity<OrderResponse> getByCode(@PathVariable String orderCode) {
        return ResponseEntity.ok(orderService.findByCode(orderCode));
    }

    @PatchMapping("/{orderCode}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable String orderCode,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.cancelByCustomer(orderCode, currentUser.getId()));
    }
}
