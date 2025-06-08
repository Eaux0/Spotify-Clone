package io.music.user_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import io.music.user_service.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}