package com.pos.pos.Model;

import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
	public String brand;
	public String name;
	public String barCode;
	public String measureUnit;
	public int stocks;
	public double costPrice;
	public double sellPrice;
	public boolean active;
	public double taxPercentage;

	@ManyToMany
	@JoinTable(
	name="product-categories",
	joinColumns = @JoinColumn(name = "product_id"),
	inverseJoinColumns = @JoinColumn(name = "category_id"))
	Set<Category> productCategories;


	@CreationTimestamp
	@Column(name="created_at", nullable= false, updatable= false)
	private String createdAt;
	private String updatedAt;
}
