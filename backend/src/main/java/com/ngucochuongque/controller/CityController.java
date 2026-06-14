package com.ngucochuongque.controller;

import com.ngucochuongque.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@RequiredArgsConstructor
public class CityController {

    private final CityService cityService;

    @GetMapping
    public ResponseEntity<List<String>> getAll() {
        return ResponseEntity.ok(cityService.findAllNames());
    }
}
