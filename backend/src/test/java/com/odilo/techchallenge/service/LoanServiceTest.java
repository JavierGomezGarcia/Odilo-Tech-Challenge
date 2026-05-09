package com.odilo.techchallenge.service;

import com.odilo.techchallenge.dto.CreateLoanRequest;
import com.odilo.techchallenge.dto.LoanResponse;
import com.odilo.techchallenge.entity.BookEntity;
import com.odilo.techchallenge.entity.LibraryUserEntity;
import com.odilo.techchallenge.entity.LoanEntity;
import com.odilo.techchallenge.exception.ConflictException;
import com.odilo.techchallenge.exception.NotFoundException;
import com.odilo.techchallenge.repository.BookRepository;
import com.odilo.techchallenge.repository.LibraryUserRepository;
import com.odilo.techchallenge.repository.LoanRepository;
import com.odilo.techchallenge.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LoanServiceTest {

    @Mock
    private LoanRepository loanRepository;
    @Mock
    private LibraryUserRepository libraryUserRepository;
    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private LoanService loanService;

    @Test
    void createLoanShouldSucceedAndDecreaseAvailableCopies() {
        CreateLoanRequest request = TestDataFactory.createLoanRequest();
        LibraryUserEntity user = TestDataFactory.createUserEntity();
        BookEntity book = TestDataFactory.createBookEntity();
        book.setAvailableCopies(2);
        LoanEntity saved = TestDataFactory.createLoanEntity();
        saved.setBook(book);
        saved.setUser(user);

        when(libraryUserRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findWithLockByIsbn("9780132350884")).thenReturn(Optional.of(book));
        when(loanRepository.existsByUser_IdAndBook_IsbnAndActiveTrue(1L, "9780132350884")).thenReturn(false);
        when(loanRepository.save(any(LoanEntity.class))).thenReturn(saved);

        LoanResponse response = loanService.createLoan(request);

        assertEquals(1, book.getAvailableCopies());
        assertEquals("9780132350884", response.bookIsbn());
    }

    @Test
    void createLoanShouldFailWhenUserNotFound() {
        when(libraryUserRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> loanService.createLoan(TestDataFactory.createLoanRequest()));
    }

    @Test
    void createLoanShouldFailWhenBookNotFound() {
        CreateLoanRequest request = TestDataFactory.createLoanRequest();
        when(libraryUserRepository.findById(1L)).thenReturn(Optional.of(TestDataFactory.createUserEntity()));
        when(bookRepository.findWithLockByIsbn("9780132350884")).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> loanService.createLoan(request));
    }

    @Test
    void createLoanShouldFailWhenNoAvailableCopies() {
        CreateLoanRequest request = TestDataFactory.createLoanRequest();
        BookEntity book = TestDataFactory.createBookEntity();
        book.setAvailableCopies(0);

        when(libraryUserRepository.findById(1L)).thenReturn(Optional.of(TestDataFactory.createUserEntity()));
        when(bookRepository.findWithLockByIsbn("9780132350884")).thenReturn(Optional.of(book));

        assertThrows(ConflictException.class, () -> loanService.createLoan(request));
    }

    @Test
    void createLoanShouldFailWhenDuplicateActiveLoan() {
        CreateLoanRequest request = TestDataFactory.createLoanRequest();
        BookEntity book = TestDataFactory.createBookEntity();
        when(libraryUserRepository.findById(1L)).thenReturn(Optional.of(TestDataFactory.createUserEntity()));
        when(bookRepository.findWithLockByIsbn("9780132350884")).thenReturn(Optional.of(book));
        when(loanRepository.existsByUser_IdAndBook_IsbnAndActiveTrue(1L, "9780132350884")).thenReturn(true);

        assertThrows(ConflictException.class, () -> loanService.createLoan(request));
    }

    @Test
    void returnLoanShouldSucceed() {
        LoanEntity loan = TestDataFactory.createLoanEntity();
        loan.setActive(true);
        BookEntity book = loan.getBook();
        book.setAvailableCopies(1);

        when(loanRepository.findById(10L)).thenReturn(Optional.of(loan));
        when(bookRepository.findWithLockByIsbn("9780132350884")).thenReturn(Optional.of(book));

        LoanResponse result = loanService.returnLoan(10L);

        assertNotNull(result.actualReturnDate());
        assertEquals(2, book.getAvailableCopies());
        assertEquals(false, result.active());
    }

    @Test
    void returnLoanShouldFailWhenAlreadyReturned() {
        LoanEntity loan = TestDataFactory.createLoanEntity();
        loan.setActive(false);
        when(loanRepository.findById(10L)).thenReturn(Optional.of(loan));

        assertThrows(ConflictException.class, () -> loanService.returnLoan(10L));
    }

    @Test
    void getUserLoansShouldFailWhenUserNotFound() {
        when(libraryUserRepository.existsById(1L)).thenReturn(false);

        assertThrows(NotFoundException.class, () -> loanService.getUserLoans(1L, true));
    }

    @Test
    void getUserLoansShouldReturnListWhenUserExists() {
        LoanEntity loan = TestDataFactory.createLoanEntity();
        when(libraryUserRepository.existsById(1L)).thenReturn(true);
        when(loanRepository.findByUser_IdAndActive(1L, true)).thenReturn(List.of(loan));

        List<LoanResponse> result = loanService.getUserLoans(1L, true);

        assertEquals(1, result.size());
        verify(loanRepository).findByUser_IdAndActive(1L, true);
    }
}
