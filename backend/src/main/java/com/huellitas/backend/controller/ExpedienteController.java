package com.huellitas.backend.controller;

import com.huellitas.backend.model.Expediente;
import com.huellitas.backend.service.ExpedienteService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// Controlador REST para administrar los expedientes digitales.
@RestController
@RequestMapping("/api/expedientes")
@CrossOrigin(origins = {"http://127.0.0.1:3000", "http://localhost:3000"})
public class ExpedienteController {

    private final ExpedienteService expedienteService;

    // Spring inyecta el servicio automáticamente.
    public ExpedienteController(ExpedienteService expedienteService) {
        this.expedienteService = expedienteService;
    }

    // Consultar todos los expedientes.
    // GET /api/expedientes
    @GetMapping
    public List<Expediente> listarExpedientes() {
        return expedienteService.listarExpedientes();
    }

    // Consultar el expediente de una mascota.
    // GET /api/expedientes/mascota/1
    @GetMapping("/mascota/{idMascota}")
    public Expediente obtenerPorMascota(
            @PathVariable Long idMascota) {

        return expedienteService.obtenerPorMascota(idMascota);
    }

    // Crear un expediente para una mascota.
    // POST /api/expedientes/mascota/1
    @PostMapping("/mascota/{idMascota}")
    public ResponseEntity<Expediente> crearExpediente(
            @PathVariable Long idMascota,
            @RequestBody Map<String, String> datos) {

        String observaciones = datos.get("observacionesGenerales");

        Expediente expediente = expedienteService
                .crearExpediente(idMascota, observaciones);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(expediente);
    }

    // Actualizar las observaciones del expediente.
    // PUT /api/expedientes/mascota/1
    @PutMapping("/mascota/{idMascota}")
    public Expediente actualizarObservaciones(
            @PathVariable Long idMascota,
            @RequestBody Map<String, String> datos) {

        String observaciones = datos.get("observacionesGenerales");

        return expedienteService.actualizarObservaciones(
                idMascota, observaciones
        );
    }

    // Manejar mascotas o expedientes inexistentes.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> manejarNoEncontrado(
            IllegalArgumentException error) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", error.getMessage()));
    }

    // Evitar crear expedientes duplicados.
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> manejarDuplicados(
            IllegalStateException error) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("error", error.getMessage()));
    }
}
