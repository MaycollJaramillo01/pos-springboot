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

import com.pos.pos.Repository.CategoryRepository;
import com.pos.pos.Model.Category;

@RestController
@RequestMapping("api/categories")
public class CategoryController {
	@Autowired
	private CategoryRepository categoryRepository;

	@GetMapping
	public List<Category> list() {
		return categoryRepository.findAll();
	}

	@PostMapping
	public Category createCategory(Category category) {
		return categoryRepository.save(category);
	}

	@GetMapping("/{id}")
	public Category getCategory(@PathVariable Long id) {
		return categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
	}

	@PutMapping("/{id}")
	public Category updateCategory(@PathVariable Long id, Category category) {
		Category existingCategory = categoryRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Category not found"));
		existingCategory.setName(category.getName());
		return categoryRepository.save(existingCategory);
	}

	@DeleteMapping("/{id}")
	public void deleteCategory(@PathVariable Long id) {
		categoryRepository.deleteById(id);
	}
}
