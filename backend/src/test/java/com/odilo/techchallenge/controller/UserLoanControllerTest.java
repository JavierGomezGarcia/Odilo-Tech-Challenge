package com.odilo.techchallenge.controller;

import com.odilo.techchallenge.dto.LoanResponse;
import com.odilo.techchallenge.exception.GlobalExceptionHandler;
import com.odilo.techchallenge.service.LoanService;
import com.odilo.techchallenge.support.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserLoanController.class)
@Import(GlobalExceptionHandler.class)
class UserLoanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LoanService loanService;

    @Test
    void getUserLoansShouldReturn200() throws Exception {
        LoanResponse response = TestDataFactory.createLoanResponse();
        when(loanService.getUserLoans(1L, true)).thenReturn(List.of(response));

        mockMvc.perform(get("/users/1/loans").param("active", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookIsbn").value("9780132350884"));

        verify(loanService).getUserLoans(1L, true);
    }

    @Test
    void getUserLoansShouldUseDefaultActiveTrue() throws Exception {
        when(loanService.getUserLoans(1L, true)).thenReturn(List.of());

        mockMvc.perform(get("/users/1/loans"))
                .andExpect(status().isOk());

        verify(loanService).getUserLoans(1L, true);
    }
}
