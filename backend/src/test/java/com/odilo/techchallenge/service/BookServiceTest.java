package com.odilo.techchallenge.service;

import com.odilo.techchallenge.dto.BookResponse;
import com.odilo.techchallenge.dto.CreateBookRequest;
import com.odilo.techchallenge.entity.BookEntity;
import com.odilo.techchallenge.exception.ConflictException;
import com.odilo.techchallenge.repository.BookRepository;
import com.odilo.techchallenge.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookService bookService;

    @Test
    void createBookShouldSucceed() {
        CreateBookRequest request = TestDataFactory.createBookRequest();
        BookEntity savedEntity = TestDataFactory.createBookEntity();
        savedEntity.setAvailableCopies(3);

        when(bookRepository.existsById(request.isbn())).thenReturn(false);
        when(bookRepository.save(any(BookEntity.class))).thenReturn(savedEntity);

        BookResponse response = bookService.createBook(request);

        assertEquals(request.isbn(), response.isbn());
        assertEquals(request.title(), response.title());
        assertEquals(3, response.totalCopies());
        assertEquals(3, response.availableCopies());
    }

    @Test
    void createBookShouldFailWhenIsbnExists() {
        CreateBookRequest request = TestDataFactory.createBookRequest();
        when(bookRepository.existsById(request.isbn())).thenReturn(true);

        assertThrows(ConflictException.class, () -> bookService.createBook(request));
    }

    @Test
    void searchByTitleShouldUseFindAllWhenNoTitle() {
        BookEntity book = TestDataFactory.createBookEntity();
        Page<BookEntity> page = new PageImpl<>(List.of(book), PageRequest.of(0, 10), 1);
        when(bookRepository.findAll(any(PageRequest.class))).thenReturn(page);

        Page<BookResponse> result = bookService.searchByTitle(null, 0, 10);

        assertEquals(1, result.getTotalElements());
        verify(bookRepository).findAll(any(PageRequest.class));
    }

    @Test
    void searchByTitleShouldFilterWhenTitlePresent() {
        BookEntity book = TestDataFactory.createBookEntity();
        Page<BookEntity> page = new PageImpl<>(List.of(book), PageRequest.of(0, 10), 1);
        when(bookRepository.findByTitleContainingIgnoreCase(eq("Clean"), any(PageRequest.class))).thenReturn(page);

        Page<BookResponse> result = bookService.searchByTitle("  Clean  ", 0, 10);

        assertEquals(1, result.getContent().size());
        assertEquals("9780132350884", result.getContent().getFirst().isbn());
        verify(bookRepository).findByTitleContainingIgnoreCase(eq("Clean"), any(PageRequest.class));
    }
}
