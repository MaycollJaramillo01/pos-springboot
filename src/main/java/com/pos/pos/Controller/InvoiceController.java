package com.pos.pos.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pos.pos.Repository.InvoiceRepository;
import com.pos.pos.Model.Invoice;

@RestController
@RequestMapping("api/invoices")
public class InvoiceController {
	@Autowired
	private InvoiceRepository invoiceRepository;

	@GetMapping
	public List<Invoice> list() {
		return invoiceRepository.findAll();
	}

	@PostMapping
	public Invoice createInvoice(Invoice invoice) {
		return invoiceRepository.save(invoice);
	}

	@GetMapping("/{id}")
	public Invoice getInvoice(@PathVariable Long id) {
		return invoiceRepository.findById(id).orElseThrow(() -> new RuntimeException("Invoice not found"));
	}

	@DeleteMapping("/{id}")
	public void deleteInvoice(@PathVariable Long id) {
		invoiceRepository.deleteById(id);
	}
}
