package io.music.user_service.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.music.user_service.models.User;
import io.music.user_service.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        if (!user.getRole().startsWith("ROLE_"))
            throw new IllegalStateException("Role does not being with ROLE_, current role: " + user.getRole());

        if (!(user.getRole().substring(5).equals("USER") || user.getRole().substring(5).equals("ADMIN")))
            throw new IllegalStateException(
                    "The current role is not ROLE_USER or ROLE_ADMIN, current role: " + user.getRole());

        User tempUser = userRepository.findByUsername(user.getUsername());
        if (tempUser != null) {
            throw new IllegalStateException("This username already exists. Please enter a new one");
        }

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long userId) {
        userRepository.delete(getUserById(userId));
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserWithUsername(String username) {
        return userRepository.findByUsername(username);
    }

}
