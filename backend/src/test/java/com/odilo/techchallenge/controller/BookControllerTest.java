package com.odilo.techchallenge.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.odilo.techchallenge.dto.BookResponse;
import com.odilo.techchallenge.dto.CreateBookRequest;
import com.odilo.techchallenge.exception.GlobalExceptionHandler;
import com.odilo.techchallenge.service.BookService;
import com.odilo.techchallenge.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookController.class)
@Import(GlobalExceptionHandler.class)
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookService bookService;

    @Test
    void createBookShouldReturn201() throws Exception {
        CreateBookRequest request = TestDataFactory.createBookRequest();
        BookResponse response = TestDataFactory.createBookResponse();
        when(bookService.createBook(request)).thenReturn(response);

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isbn").value("9780132350884"));
    }

    @Test
    void createBookShouldReturn400WhenValidationFails() throws Exception {
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"isbn\":\"\",\"title\":\"\",\"totalCopies\":-1}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void searchBooksShouldReturnPagedDataAndForwardParams() throws Exception {
        BookResponse response = TestDataFactory.createBookResponse();
        when(bookService.searchByTitle(eq("Clean"), eq(1), eq(5)))
                .thenReturn(new PageImpl<>(List.of(response), PageRequest.of(1, 5), 10));

        mockMvc.perform(get("/books")
                        .param("title", "Clean")
                        .param("page", "1")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].isbn").value("9780132350884"))
                .andExpect(jsonPath("$.number").value(1))
                .andExpect(jsonPath("$.size").value(5));

        verify(bookService).searchByTitle("Clean", 1, 5);
    }
}
