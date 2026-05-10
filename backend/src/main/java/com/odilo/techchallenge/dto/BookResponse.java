package com.odilo.techchallenge.dto;

import java.time.OffsetDateTime;

public record BookResponse(
        String isbn,
        String title,
        int totalCopies,
        int availableCopies,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}
