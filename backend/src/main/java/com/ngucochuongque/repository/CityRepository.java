package com.ngucochuongque.repository;

import com.ngucochuongque.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Integer> {

    List<City> findAllByOrderByNameAsc();
}
