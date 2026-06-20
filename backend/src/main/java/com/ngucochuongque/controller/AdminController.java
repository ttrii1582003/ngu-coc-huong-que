package com.ngucochuongque.controller;

import com.ngucochuongque.dto.request.CreateProductRequest;
import com.ngucochuongque.dto.request.UpdateOrderStatusRequest;
import com.ngucochuongque.dto.response.OrderResponse;
import com.ngucochuongque.dto.response.ProductResponse;
import com.ngucochuongque.dto.response.RevenuePointResponse;
import com.ngucochuongque.service.OrderService;
import com.ngucochuongque.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final OrderService orderService;
    private final ProductService productService;

    // --- Stats ---

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(orderService.getStats());
    }

    // --- Revenue series ---

    @GetMapping("/revenue")
    public ResponseEntity<List<RevenuePointResponse>> getRevenueSeries(
            @RequestParam(defaultValue = "day") String groupBy,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(orderService.getRevenueSeries(groupBy, from, to));
    }

    // --- Orders ---

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(orderService.findAllOrders(status));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus()));
    }

    // --- Products ---

    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
