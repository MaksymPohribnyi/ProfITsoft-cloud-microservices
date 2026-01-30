package com.pohribnyi.gateway.cloud.controller;


import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @GetMapping
    public Map<String, Object> getUserProfile(@AuthenticationPrincipal OidcUser principal) {
        Map<String, Object> response = new HashMap<>();
        if (principal != null) {
            response.put("email", principal.getEmail());
            response.put("name", principal.getFullName());
            response.put("picture", principal.getPicture());
        }
        return response;
    }

}
