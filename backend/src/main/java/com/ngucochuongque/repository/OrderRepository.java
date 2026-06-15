package com.ngucochuongque.repository;

import com.ngucochuongque.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    Optional<Order> findByOrderCode(String orderCode);

    boolean existsByOrderCode(String orderCode);

    List<Order> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
