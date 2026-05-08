package com.odilo.techchallenge.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record CreateLoanRequest(
        @NotNull Long userId,
        @NotBlank String bookIsbn,
        @NotNull @Future OffsetDateTime expectedReturnDate
) {
}
