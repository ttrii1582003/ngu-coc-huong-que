package com.ngucochuongque.service;

import com.ngucochuongque.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CityService {

    private final CityRepository cityRepository;

    public List<String> findAllNames() {
        return cityRepository.findAllByOrderByNameAsc().stream()
                .map(c -> c.getName())
                .toList();
    }
}
