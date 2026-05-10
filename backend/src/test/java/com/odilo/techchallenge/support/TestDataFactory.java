package com.odilo.techchallenge.support;

import com.odilo.techchallenge.dto.BookResponse;
import com.odilo.techchallenge.dto.CreateBookRequest;
import com.odilo.techchallenge.dto.CreateLoanRequest;
import com.odilo.techchallenge.dto.LoanResponse;
import com.odilo.techchallenge.entity.BookEntity;
import com.odilo.techchallenge.entity.LibraryUserEntity;
import com.odilo.techchallenge.entity.LoanEntity;

import java.time.OffsetDateTime;

public final class TestDataFactory {

    private TestDataFactory() {
    }

    public static CreateBookRequest createBookRequest() {
        return new CreateBookRequest("9780132350884", "Clean Code", 3);
    }

    public static BookEntity createBookEntity() {
        BookEntity book = new BookEntity();
        book.setIsbn("9780132350884");
        book.setTitle("Clean Code");
        book.setTotalCopies(3);
        book.setAvailableCopies(3);
        return book;
    }

    public static BookResponse createBookResponse() {
        return new BookResponse("9780132350884", "Clean Code", 3, 3, OffsetDateTime.now(), OffsetDateTime.now());
    }

    public static CreateLoanRequest createLoanRequest() {
        return new CreateLoanRequest(1L, "9780132350884", OffsetDateTime.now().plusDays(7));
    }

    public static LibraryUserEntity createUserEntity() {
        LibraryUserEntity user = new LibraryUserEntity();
        user.setId(1L);
        user.setFullName("John Reader");
        user.setEmail("john.reader@example.com");
        return user;
    }

    public static LoanEntity createLoanEntity() {
        LoanEntity loan = new LoanEntity();
        loan.setId(10L);
        loan.setUser(createUserEntity());
        loan.setBook(createBookEntity());
        loan.setExpectedReturnDate(OffsetDateTime.now().plusDays(7));
        loan.setActualReturnDate(null);
        loan.setActive(true);
        return loan;
    }

    public static LoanResponse createLoanResponse() {
        return new LoanResponse(
                10L,
                1L,
                "9780132350884",
                OffsetDateTime.now().plusDays(7),
                null,
                true,
                OffsetDateTime.now()
        );
    }
}
