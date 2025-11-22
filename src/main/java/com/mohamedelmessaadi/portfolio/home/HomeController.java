package com.mohamedelmessaadi.portfolio.home;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index.html";
    }

    @GetMapping("/contacts")
    public String contacts() {
        return "contacts.html";
    }
}
