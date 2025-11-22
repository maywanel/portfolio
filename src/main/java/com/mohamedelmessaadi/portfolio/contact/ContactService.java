package com.mohamedelmessaadi.portfolio.contact;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    private final AtomicLong sequence = new AtomicLong(0);
    private final CopyOnWriteArrayList<ContactMessage> messages = new CopyOnWriteArrayList<>();

    public ContactMessage submit(ContactRequest request) {
        var message = new ContactMessage(
                sequence.incrementAndGet(),
                Instant.now(),
                request.name(),
                request.email(),
                request.message()
        );
        messages.add(message);
        logger.info("New contact message received: id={}, name={}, email={}", message.id(), message.name(), message.email());
        return message;
    }

    public List<ContactMessage> getRecentMessages() {
        return List.copyOf(messages);
    }
}
