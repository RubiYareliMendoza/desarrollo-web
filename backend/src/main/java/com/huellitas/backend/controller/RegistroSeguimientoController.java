package com.huellitas.backend.controller;

import com.huellitas.backend.model.RegistroSeguimiento;
import com.huellitas.backend.service.RegistroSeguimientoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Controlador REST para consultar el historial de seguimiento.
@RestController
@RequestMapping("/api/registros-seguimiento")
@CrossOrigin(origins = {
    "http://127.0.0.1:3000",
    "http://localhost:3000"
})
public class RegistroSeguimientoController {

    private final RegistroSeguimientoService registroService;

    // Spring proporciona automáticamente el servicio.
    public RegistroSeguimientoController(
            RegistroSeguimientoService registroService) {
        this.registroService = registroService;
    }

    // GET: consultar los registros de un expediente.
    // Ejemplo: /api/registros-seguimiento/expediente/1
    @GetMapping("/expediente/{idExpediente}")
    public ResponseEntity<List<RegistroSeguimiento>> listarPorExpediente(
            @PathVariable Long idExpediente) {

        List<RegistroSeguimiento> registros =
                registroService.listarPorExpediente(idExpediente);

        return ResponseEntity.ok(registros);
    }

    // Responder con 404 cuando el expediente no exista.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> manejarNoEncontrado(
            IllegalArgumentException error) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", error.getMessage()));
    }
}
