package com.pos.pos.Model;

import java.sql.Date;
import java.time.LocalDateTime;

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
@Builder @NoArgsConstructor @AllArgsConstructor
@Entity
public class Inventory {
	@GeneratedValue
	@Id
	public Long id;
	private double quantity;
	private int minStock;
	private int maxStock;
	LocalDateTime lastRestockDate;


	@CreationTimestamp
	@Column(name="created_at", nullable= false, updatable= false)
	private Date createdAt;
	private LocalDateTime updatedAt;

}
