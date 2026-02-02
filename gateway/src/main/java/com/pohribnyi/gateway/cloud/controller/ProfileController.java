package com.pohribnyi.gateway.cloud.controller;


import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @GetMapping
    public Map<String, Object> getUserProfile(@AuthenticationPrincipal OidcUser principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        return Map.of(
                "email", principal.getEmail(),
                "name", principal.getFullName(),
                "picture", principal.getPicture()
        );
    }

}
