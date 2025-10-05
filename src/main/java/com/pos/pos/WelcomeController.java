package com.pos.pos;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class WelcomeController {
	@GetMapping("/user")
	public String welcome() {
		return "This is the users backend direction";
	}
}
