package com.pos.pos.Repository;

import com.pos.pos.Model.Product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	boolean existsByBarCode(String barCode);
	Product findByBarCode(String barCode);
}
