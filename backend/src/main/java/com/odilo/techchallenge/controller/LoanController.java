package com.odilo.techchallenge.controller;

import com.odilo.techchallenge.dto.CreateLoanRequest;
import com.odilo.techchallenge.dto.LoanResponse;
import com.odilo.techchallenge.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LoanResponse createLoan(@Valid @RequestBody CreateLoanRequest request) {
        return loanService.createLoan(request);
    }

    @PostMapping("/{loanId}/return")
    public LoanResponse returnLoan(@PathVariable Long loanId) {
        return loanService.returnLoan(loanId);
    }
}
