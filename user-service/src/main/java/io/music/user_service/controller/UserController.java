package io.music.user_service.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.music.user_service.dto.UserResponseDto;
import io.music.user_service.models.User;
import io.music.user_service.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/createUser")
    public User createUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User createdUser = userService.createUser(user);
        return createdUser;
    }

    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        List<User> allUsers = userService.getAllUsers();
        List<UserResponseDto> userResponse = new ArrayList<>();
        for (int i = 0; i < allUsers.size(); i++) {
            userResponse.add(new UserResponseDto(allUsers.get(i).getName(), allUsers.get(i).getRole(),
                    allUsers.get(i).getUserId()));
        }
        return userResponse;
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return "Deleted";
    }

    @GetMapping("/{id}")
    public UserResponseDto getUserById(@PathVariable("id") Long id) {
        User currUser = userService.getUserById(id);
        return new UserResponseDto(currUser.getName(), currUser.getRole(), currUser.getUserId());
    }

    @GetMapping("/me")
    public Principal getLoggedInUser(Principal principal) {
        return principal;
    }

    @GetMapping("/{username}")
    public UserResponseDto getUserByUsername(String username) {
        User currUser = userService.getUserWithUsername(username);
        return new UserResponseDto(currUser.getName(), currUser.getRole(), currUser.getUserId());
    }

}
