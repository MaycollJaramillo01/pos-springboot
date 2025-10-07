package com.pos.pos.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
	@GeneratedValue
	@Id
	public Long id;

	@Column(name = "order_number", nullable = false, unique = true, length = 50)
	private String orderNumber;

	@Enumerated(EnumType.STRING)
	@Builder.Default
	private OrderStatus status = OrderStatus.PENDING;

	@Column(nullable = false, precision = 10, scale = 2)
	private Double subtotal;

	@Column(name = "tax_amount", precision = 10, scale = 2)
	@Builder.Default
	private Double taxAmount = 0.0;

	@Column(name = "shipping_amount", precision = 10, scale = 2)
	@Builder.Default
	private Double shippingAmount = 0.0;

	@Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
	private Double totalAmount;

	@Column(name = "shipping_address", columnDefinition = "TEXT")
	private String shippingAddress;

	@Column(name = "billing_address", columnDefinition = "TEXT")
	private String billingAddress;

	private String notes;

	@Column(name = "created_at")
	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();

	@Column(name = "updated_at")
	@Builder.Default
	private LocalDateTime updatedAt = LocalDateTime.now();

	public enum OrderStatus {
		PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
	}

	@PreUpdate
	public void preUpdate() {
		this.updatedAt = LocalDateTime.now();
	}
}
