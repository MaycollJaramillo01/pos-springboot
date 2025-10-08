package com.pos.pos.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pos.pos.Repository.InvoiceItemRepository;
import com.pos.pos.Model.InvoiceItem;

@RestController
@RequestMapping("api/invoice-items")
public class InvoiceItemController {
	@Autowired
	private InvoiceItemRepository invoiceItemRepository;

	@GetMapping
	public List<InvoiceItem> list() {
		return invoiceItemRepository.findAll();
	}

	@PostMapping
	public InvoiceItem createInvoiceItem(InvoiceItem invoiceItem) {
		return invoiceItemRepository.save(invoiceItem);
	}

	@GetMapping("/{id}")
	public InvoiceItem getInvoiceItem(@PathVariable Long id) {
		return invoiceItemRepository.findById(id).orElseThrow(() -> new RuntimeException("InvoiceItem not found"));
	}

	@DeleteMapping("/{id}")
	public void deleteInvoiceItem(@PathVariable Long id) {
		invoiceItemRepository.deleteById(id);
	}
}
