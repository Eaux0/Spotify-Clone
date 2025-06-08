package io.music.user_service.controller;

import io.music.user_service.models.User;
import io.music.user_service.security.JwtUtil;
import io.music.user_service.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

        User user = userDetailsService.loadUserEntityByUsername(username);

        String token = jwtUtil.generateToken(
                Map.of(
                        "userId", user.getUserId(),
                        "name", user.getName(),
                        "role", user.getRole()),
                username);

        return Map.of("token", token);
    }
}
