package com.example.infertility_care.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.infertility_care.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long>{
	 boolean existsByEmail(String email);
	 Optional<UserEntity> findByEmail(String email);
}
