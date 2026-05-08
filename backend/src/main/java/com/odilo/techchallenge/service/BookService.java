package com.odilo.techchallenge.service;

import com.odilo.techchallenge.dto.BookResponse;
import com.odilo.techchallenge.dto.CreateBookRequest;
import com.odilo.techchallenge.entity.BookEntity;
import com.odilo.techchallenge.exception.ConflictException;
import com.odilo.techchallenge.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        if (bookRepository.existsById(request.isbn())) {
            throw new ConflictException("Book with ISBN already exists: " + request.isbn());
        }

        BookEntity book = new BookEntity();
        book.setIsbn(request.isbn().trim());
        book.setTitle(request.title().trim());
        book.setTotalCopies(request.totalCopies());
        book.setAvailableCopies(request.totalCopies());

        return toResponse(bookRepository.save(book));
    }

    @Transactional(readOnly = true)
    public List<BookResponse> searchByTitle(String title) {
        List<BookEntity> books = (title == null || title.isBlank())
                ? bookRepository.findAll()
                : bookRepository.findByTitleContainingIgnoreCase(title.trim());
        return books.stream().map(this::toResponse).toList();
    }

    private BookResponse toResponse(BookEntity book) {
        return new BookResponse(
                book.getIsbn(),
                book.getTitle(),
                book.getTotalCopies(),
                book.getAvailableCopies(),
                book.getCreatedAt(),
                book.getUpdatedAt()
        );
    }
}
