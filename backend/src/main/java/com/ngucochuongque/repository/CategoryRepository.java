package com.ngucochuongque.repository;

import com.ngucochuongque.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, String> {
}
