package com.example.editortextosaas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.editortextosaas.model.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {

}
