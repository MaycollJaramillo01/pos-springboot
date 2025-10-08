package com.pos.pos.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    private String invoiceNumber;
    
    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Column(nullable = false, precision = 10)
    private Double subtotal;
    
    @Column(name = "tax_amount", nullable = false, precision = 10)
    private Double taxAmount;
    
    @Column(name = "total_amount", nullable = false, precision = 10)
    private Double totalAmount;
    
    @Column(name = "tax_rate", precision = 5)
    @Builder.Default
    private Double taxRate = 0.0;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private InvoiceStatus status = InvoiceStatus.DRAFT;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.CASH;
    
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    
    private String notes;
    
    @Column(name = "xml_data", columnDefinition = "TEXT")
    private String xmlData;
    
    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Relaciones
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    private Order order;
    
    
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InvoiceItem> invoiceItems;
    
    public enum InvoiceStatus {
        DRAFT, ISSUED, PAID, CANCELLED
    }
    
    public enum PaymentMethod {
        CASH, CARD, TRANSFER, CHECK
    }
}
