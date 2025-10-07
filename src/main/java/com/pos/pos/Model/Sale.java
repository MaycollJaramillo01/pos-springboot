package com.pos.pos.Model;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Sale {
	@GeneratedValue
	@Id
	public Long id;
	private double amount;
	private double taxAmount;
	private String saleStatus;
	// @TODO: add saled by
	@CreationTimestamp
	@Column(name="created_at", nullable= false, updatable= false)
	private String createdAt;
	private String updatedAt;
}
