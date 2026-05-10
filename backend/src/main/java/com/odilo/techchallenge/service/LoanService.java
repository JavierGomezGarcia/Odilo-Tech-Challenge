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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final LibraryUserRepository libraryUserRepository;
    private final BookRepository bookRepository;

    public LoanService(
            LoanRepository loanRepository,
            LibraryUserRepository libraryUserRepository,
            BookRepository bookRepository
    ) {
        this.loanRepository = loanRepository;
        this.libraryUserRepository = libraryUserRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional
    public LoanResponse createLoan(CreateLoanRequest request) {
        Long userId = request.userId();
        String isbn = request.bookIsbn().trim();

        LibraryUserEntity user = libraryUserRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        BookEntity book = bookRepository.findWithLockByIsbn(isbn)
                .orElseThrow(() -> new NotFoundException("Book not found with ISBN: " + isbn));

        if (book.getAvailableCopies() <= 0) {
            throw new ConflictException("No available copies for ISBN: " + isbn);
        }

        if (loanRepository.existsByUser_IdAndBook_IsbnAndActiveTrue(userId, isbn)) {
            throw new ConflictException("User already has an active loan for ISBN: " + isbn);
        }

        LoanEntity loan = new LoanEntity();
        loan.setUser(user);
        loan.setBook(book);
        loan.setExpectedReturnDate(request.expectedReturnDate());
        loan.setActualReturnDate(null);
        loan.setActive(true);

        book.setAvailableCopies(book.getAvailableCopies() - 1);

        LoanEntity saved = loanRepository.save(loan);
        return toResponse(saved);
    }

    @Transactional
    public LoanResponse returnLoan(Long loanId) {
        LoanEntity loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NotFoundException("Loan not found with id: " + loanId));

        if (!Boolean.TRUE.equals(loan.getActive())) {
            throw new ConflictException("Loan already returned: " + loanId);
        }

        BookEntity book = bookRepository.findWithLockByIsbn(loan.getBook().getIsbn())
                .orElseThrow(() -> new NotFoundException("Book not found with ISBN: " + loan.getBook().getIsbn()));

        loan.setActive(false);
        loan.setActualReturnDate(OffsetDateTime.now());
        book.setAvailableCopies(book.getAvailableCopies() + 1);

        return toResponse(loan);
    }

    @Transactional(readOnly = true)
    public List<LoanResponse> getUserLoans(Long userId, boolean active) {
        if (!libraryUserRepository.existsById(userId)) {
            throw new NotFoundException("User not found with id: " + userId);
        }

        return loanRepository.findByUser_IdAndActive(userId, active)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private LoanResponse toResponse(LoanEntity loan) {
        return new LoanResponse(
                loan.getId(),
                loan.getUser().getId(),
                loan.getBook().getIsbn(),
                loan.getExpectedReturnDate(),
                loan.getActualReturnDate(),
                loan.getActive(),
                loan.getCreatedAt()
        );
    }
}
