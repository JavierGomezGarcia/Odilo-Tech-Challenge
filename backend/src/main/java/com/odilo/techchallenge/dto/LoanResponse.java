package com.odilo.techchallenge.dto;

import java.time.OffsetDateTime;

public record LoanResponse(
        Long id,
        Long userId,
        String bookIsbn,
        OffsetDateTime expectedReturnDate,
        OffsetDateTime actualReturnDate,
        boolean active,
        OffsetDateTime createdAt
) {
}
