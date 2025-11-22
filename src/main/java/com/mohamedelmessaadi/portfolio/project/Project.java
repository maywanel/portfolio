package com.mohamedelmessaadi.portfolio.project;

import java.time.Instant;

public record Project(
        String name,
        String description,
        String htmlUrl,
        String language,
        int stars,
        Instant updatedAt
) { }
