package com.odilo.techchallenge.repository;

import com.odilo.techchallenge.entity.LibraryUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LibraryUserRepository extends JpaRepository<LibraryUserEntity, Long> {
}
