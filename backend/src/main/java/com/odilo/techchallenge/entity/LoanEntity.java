package com.odilo.techchallenge.entity;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "loan")
public class LoanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id_card", nullable = false)
    private LibraryUserEntity user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "book_isbn", nullable = false)
    private BookEntity book;

    @Column(name = "expected_return_date", nullable = false)
    private OffsetDateTime expectedReturnDate;

    @Column(name = "actual_return_date")
    private OffsetDateTime actualReturnDate;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
        if (active == null) {
            active = Boolean.TRUE;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LibraryUserEntity getUser() { return user; }
    public void setUser(LibraryUserEntity user) { this.user = user; }
    public BookEntity getBook() { return book; }
    public void setBook(BookEntity book) { this.book = book; }
    public OffsetDateTime getExpectedReturnDate() { return expectedReturnDate; }
    public void setExpectedReturnDate(OffsetDateTime expectedReturnDate) { this.expectedReturnDate = expectedReturnDate; }
    public OffsetDateTime getActualReturnDate() { return actualReturnDate; }
    public void setActualReturnDate(OffsetDateTime actualReturnDate) { this.actualReturnDate = actualReturnDate; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
