package com.ngucochuongque.service;

import com.ngucochuongque.dto.response.ProductResponse;
import com.ngucochuongque.entity.Product;
import com.ngucochuongque.exception.ResourceNotFoundException;
import com.ngucochuongque.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> findAll(String category, String search) {
        List<Product> products;

        boolean hasCategory = category != null && !category.isBlank();
        boolean hasSearch   = search   != null && !search.isBlank();

        if (hasCategory && hasSearch) {
            products = productRepository.findByCategoryIdAndNameContaining(category, search);
        } else if (hasCategory) {
            products = productRepository.findByCategoryId(category);
        } else if (hasSearch) {
            products = productRepository.searchByName(search);
        } else {
            products = productRepository.findAll();
        }

        return products.stream().map(this::toResponse).toList();
    }

    public ProductResponse findById(Integer id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại: " + id));
        return toResponse(p);
    }

    private ProductResponse toResponse(Product p) {
        List<String> benefits = p.getBenefits().stream()
                .map(b -> b.getBenefit())
                .toList();

        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .category(p.getCategory().getId())
                .price(p.getPrice())
                .originalPrice(p.getOriginalPrice())
                .weight(p.getWeight())
                .rating(p.getRating())
                .reviews(p.getReviews())
                .badge(p.getBadge())
                .badgeType(p.getBadgeType())
                .description(p.getDescription())
                .benefits(benefits)
                .bgColor(p.getBgColor())
                .accentColor(p.getAccentColor())
                .build();
    }
}
