package com.pos.pos.Model;

import java.time.LocalDateTime;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Product {
	@GeneratedValue
	@Id
	public Long id;
	public String sku;
	public String brand;
	public String name;
	public String description;
	public String barCode;
	public String measureUnit;
	public int stocks;
	public Double costPrice;
	public Double sellPrice;
	public Boolean isActive;
	public Double taxPercentage;

	//@TODO: falta CreatedBy

	@ManyToMany
	@JoinTable(
	name="product-categories",
	joinColumns = @JoinColumn(name = "product_id"),
	inverseJoinColumns = @JoinColumn(name = "category_id"))
	Set<Category> productCategories;


	@CreationTimestamp
	@Column(name="created_at", nullable= false, updatable= false)
	private LocalDateTime createdAt;
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PreUpdate
	public void preUpdate() {
		this.updatedAt = LocalDateTime.now();
	}
}
