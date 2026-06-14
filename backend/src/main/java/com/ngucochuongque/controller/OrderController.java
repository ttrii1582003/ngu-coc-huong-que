package com.ngucochuongque.controller;

import com.ngucochuongque.dto.request.CreateOrderRequest;
import com.ngucochuongque.dto.response.OrderResponse;
import com.ngucochuongque.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{orderCode}")
    public ResponseEntity<OrderResponse> getByCode(@PathVariable String orderCode) {
        return ResponseEntity.ok(orderService.findByCode(orderCode));
    }
}
