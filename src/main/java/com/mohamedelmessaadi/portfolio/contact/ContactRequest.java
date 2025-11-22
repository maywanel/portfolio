package com.mohamedelmessaadi.portfolio.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 120, message = "Name must be 120 characters or fewer")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        @Size(max = 160, message = "Email must be 160 characters or fewer")
        String email,

        @NotBlank(message = "Message is required")
        @Size(max = 5000, message = "Message must be 5000 characters or fewer")
        String message
) { }
