package com.pos.pos.Model;

import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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
public class Category {
	@GeneratedValue
	@Id
	public Long id;
	public String name;

	@ManyToMany(mappedBy = "productCategories")
	Set<Product> products;

	@CreationTimestamp
	@Column(name="created_at", nullable= false, updatable= false)
	private String createdAt;
	private String updatedAt;

}
