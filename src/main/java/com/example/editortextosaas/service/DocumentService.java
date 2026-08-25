package com.example.editortextosaas.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.editortextosaas.model.Document;
import com.example.editortextosaas.repository.DocumentRepository;

@Service
public class DocumentService {

    private final DocumentRepository repository;

    public DocumentService(DocumentRepository repository) {
        this.repository = repository;
    }

    // Listar todos los documentos
    public List<Document> listarTodos() {
        return repository.findAll();
    }

    // Buscar un documento por su id
    public Optional<Document> buscarPorId(Long id) {
        return repository.findById(id);
    }

    // Crear un documento nuevo
    public Document crear(Document doc) {
        LocalDateTime ahora = LocalDateTime.now();
        doc.setCreatedAt(ahora);
        doc.setLastModified(ahora);
        return repository.save(doc);
    }

    // Actualizar un documento existente
    public Document actualizar(Long id, Document datos) {
        Document doc = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));

        doc.setTitle(datos.getTitle());
        doc.setContent(datos.getContent());
        doc.setAuthor(datos.getAuthor());
        doc.setLastModified(LocalDateTime.now());

        return repository.save(doc);
    }

    // Eliminar un documento
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
