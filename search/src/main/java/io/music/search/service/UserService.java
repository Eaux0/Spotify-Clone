package io.music.search.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.music.search.models.User;
import io.music.search.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getUserByString(String name) {
        return userRepository.findByNameContainingIgnoreCase(name);
    }

    public String getArtistName(Long userId) {
        return userRepository.getArtistName(userId);
    }

}
