package com.ngucochuongque.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Category {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false, length = 100)
    private String label;
}
