package com.pos.pos.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pos.pos.Repository.SaleRepository;
import com.pos.pos.Model.Sale;

@RestController
@RequestMapping("api/sales")
public class SaleController {
	@Autowired
	private SaleRepository saleRepository;

	@GetMapping
	public List<Sale> list() {
		return saleRepository.findAll();
	}

	@PostMapping
	public Sale createSale(Sale sale) {
		return saleRepository.save(sale);
	}

	@GetMapping("/{id}")
	public Sale getSale(@PathVariable Long id) {
		return saleRepository.findById(id).orElseThrow(() -> new RuntimeException("Sale not found"));
	}

	@DeleteMapping("/{id}")
	public void deleteSale(@PathVariable Long id) {
		saleRepository.deleteById(id);
	}
}
