package com.odilo.techchallenge.repository;

import com.odilo.techchallenge.entity.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<LoanEntity, Long> {

    boolean existsByUser_IdAndBook_IsbnAndActiveTrue(Long userId, String isbn);

    List<LoanEntity> findByUser_IdAndActive(Long userId, boolean active);
}
