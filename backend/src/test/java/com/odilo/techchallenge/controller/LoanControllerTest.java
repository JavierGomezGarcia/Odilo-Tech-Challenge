package com.odilo.techchallenge.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.odilo.techchallenge.dto.CreateLoanRequest;
import com.odilo.techchallenge.dto.LoanResponse;
import com.odilo.techchallenge.exception.GlobalExceptionHandler;
import com.odilo.techchallenge.service.LoanService;
import com.odilo.techchallenge.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LoanController.class)
@Import(GlobalExceptionHandler.class)
class LoanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LoanService loanService;

    @Test
    void createLoanShouldReturn201() throws Exception {
        CreateLoanRequest request = TestDataFactory.createLoanRequest();
        LoanResponse response = TestDataFactory.createLoanResponse();
        when(loanService.createLoan(any(CreateLoanRequest.class))).thenReturn(response);

        mockMvc.perform(post("/loans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookIsbn").value("9780132350884"));
    }

    @Test
    void createLoanShouldReturn400WhenValidationFails() throws Exception {
        mockMvc.perform(post("/loans")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\":null,\"bookIsbn\":\"\",\"expectedReturnDate\":null}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnLoanShouldReturn200() throws Exception {
        LoanResponse response = TestDataFactory.createLoanResponse();
        when(loanService.returnLoan(10L)).thenReturn(response);

        mockMvc.perform(post("/loans/10/return"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));

        verify(loanService).returnLoan(10L);
    }
}
