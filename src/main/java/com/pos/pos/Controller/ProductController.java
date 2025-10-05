package com.pos.pos.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pos.pos.Repository.ProductRepository;
import com.pos.pos.Model.Product;

@RestController
@RequestMapping("api/products")
public class ProductController {

	@Autowired
	private ProductRepository productRepository;

	// list all roles
	@GetMapping
	public List<Product> list() {
		return productRepository.findAll();
	}
}
