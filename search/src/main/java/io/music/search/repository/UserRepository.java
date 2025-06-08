package io.music.search.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import io.music.search.models.User;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByNameContainingIgnoreCase(String name);

    @Query(value = "select name from public.users where user_id=:userId", nativeQuery = true)
    String getArtistName(@Param("userId") Long userId);
}
