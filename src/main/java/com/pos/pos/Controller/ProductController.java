package com.pos.pos.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pos.pos.Repository.ProductRepository;
import com.pos.pos.Model.Product;

@RestController
@RequestMapping("api/products")
public class ProductController {
	@Autowired
	private ProductRepository productRepository;

	@GetMapping
	public List<Product> list() {
		return productRepository.findAll();
	}

	@PostMapping
	public Product createProduct(Product product) {
		return productRepository.save(product);
	}

	@GetMapping("/{id}")
	public Product getProduct(@PathVariable Long id) {
		return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
	}

	@PutMapping("/{id}")
	public Product updateProduct(@PathVariable Long id, Product product) {
		Product existingProduct = productRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Product not found"));
		existingProduct.setName(product.getName());
		return productRepository.save(existingProduct);
	}

	@DeleteMapping("/{id}")
	public void deleteProduct(@PathVariable Long id) {
		productRepository.deleteById(id);
	}
}
