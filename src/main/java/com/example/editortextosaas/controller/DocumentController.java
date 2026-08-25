package com.example.editortextosaas.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.editortextosaas.model.Document;
import com.example.editortextosaas.service.DocumentService;

@RestController
@RequestMapping("/api/documentos")
public class DocumentController {

    // Longitud maxima permitida para el titulo de un documento
    private static final int TITULO_MAX = 150;

    private final DocumentService service;

    public DocumentController(DocumentService service) {
        this.service = service;
    }

    // GET /api/documentos -> listar todos
    @GetMapping
    public List<Document> listar() {
        return service.listarTodos();
    }

    // GET /api/documentos/{id} -> obtener uno
    @GetMapping("/{id}")
    public Document obtener(@PathVariable Long id) {
        return service.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));
    }

    // POST /api/documentos -> crear
    @PostMapping
    public Document crear(@RequestBody Document doc) {
        validarTitulo(doc);
        return service.crear(doc);
    }

    // PUT /api/documentos/{id} -> actualizar
    @PutMapping("/{id}")
    public Document actualizar(@PathVariable Long id, @RequestBody Document datos) {
        validarTitulo(datos);
        return service.actualizar(id, datos);
    }

    // DELETE /api/documentos/{id} -> eliminar
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

    // Validaciones del titulo, compartidas por crear y actualizar
    private void validarTitulo(Document doc) {
        if (doc.getTitle() == null || doc.getTitle().isBlank()) {
            throw new IllegalArgumentException("El titulo no puede estar vacio");
        }
        if (doc.getTitle().length() > TITULO_MAX) {
            throw new IllegalArgumentException(
                    "El titulo no puede superar los " + TITULO_MAX + " caracteres");
        }
    }
}
