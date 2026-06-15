package com.ngucochuongque.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class CreateProductRequest {
    @NotBlank  private String name;
    @NotBlank  private String categoryId;
    @NotNull @Min(1) private Integer price;
    private Integer originalPrice;
    @NotBlank  private String weight;
    @NotBlank  private String description;
    @NotBlank  private String bgColor;
    @NotBlank  private String accentColor;
    private String badge;
    private String badgeType;
    private String imageUrl;
    private List<String> benefits;
}
