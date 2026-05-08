package com.odilo.techchallenge.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateBookRequest(
        @NotBlank String isbn,
        @NotBlank String title,
        @Min(0) int totalCopies
) {
}
