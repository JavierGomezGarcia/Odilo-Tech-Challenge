package com.odilo.techchallenge.controller;

import com.odilo.techchallenge.dto.LoanResponse;
import com.odilo.techchallenge.service.LoanService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserLoanController {

    private final LoanService loanService;

    public UserLoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping("/{userId}/loans")
    public List<LoanResponse> getUserLoans(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "true") boolean active
    ) {
        return loanService.getUserLoans(userId, active);
    }
}
