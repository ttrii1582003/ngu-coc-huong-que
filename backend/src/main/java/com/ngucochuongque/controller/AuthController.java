package com.ngucochuongque.controller;

import com.ngucochuongque.dto.request.GoogleLoginRequest;
import com.ngucochuongque.dto.request.LoginRequest;
import com.ngucochuongque.dto.request.RegisterRequest;
import com.ngucochuongque.dto.response.AuthResponse;
import com.ngucochuongque.entity.User;
import com.ngucochuongque.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/google")
    public AuthResponse loginWithGoogle(@Valid @RequestBody GoogleLoginRequest req) {
        return authService.loginWithGoogle(req.getIdToken());
    }

    @GetMapping("/me")
    public AuthResponse me(@AuthenticationPrincipal User user) {
        return authService.getMe(user);
    }
}
