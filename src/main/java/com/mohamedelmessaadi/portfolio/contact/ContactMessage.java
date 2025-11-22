package com.mohamedelmessaadi.portfolio.contact;

import java.time.Instant;

public record ContactMessage(
        long id,
        Instant receivedAt,
        String name,
        String email,
        String message
) { }
