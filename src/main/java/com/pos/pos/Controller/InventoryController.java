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

import com.pos.pos.Repository.InventoryRepository;
import com.pos.pos.Model.Inventory;

@RestController
@RequestMapping("api/inventories")
public class InventoryController {
	@Autowired
	private InventoryRepository inventoryRepository;

	@GetMapping
	public List<Inventory> list() {
		return inventoryRepository.findAll();
	}

	@PostMapping
	public Inventory createInventory(Inventory inventory) {
		return inventoryRepository.save(inventory);
	}

	@GetMapping("/{id}")
	public Inventory getInventory(@PathVariable Long id) {
		return inventoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Inventory not found"));
	}

	@DeleteMapping("/{id}")
	public void deleteInventory(@PathVariable Long id) {
		inventoryRepository.deleteById(id);
	}
}
