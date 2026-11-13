package com.huellitas.backend.controller;

import com.huellitas.backend.model.Mascota;
import com.huellitas.backend.service.MascotaService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

// Indica que esta clase recibe peticiones HTTP y devuelve respuestas JSON
@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    private final MascotaService mascotaService;

    // Recibe el servicio mediante inyección de dependencias
    public MascotaController(MascotaService mascotaService) {
        this.mascotaService = mascotaService;
    }

    // GET: consulta todas las mascotas registradas
    @GetMapping
    public ResponseEntity<List<Mascota>> listarMascotas() {
        List<Mascota> mascotas = mascotaService.listarMascotas();
        return ResponseEntity.ok(mascotas);
    }

    // POST: recibe los datos de una mascota y la registra
    @PostMapping
    public ResponseEntity<Mascota> registrarMascota(@Valid @RequestBody Mascota mascota) {
        Mascota nuevaMascota = mascotaService.registrarMascota(mascota);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaMascota);
    }
}
