package com.huellitas.backend.controller;

import com.huellitas.backend.dto.SolicitudCrearDTO;
import com.huellitas.backend.dto.SolicitudRespuestaDTO;
import com.huellitas.backend.dto.SolicitudRevisionDTO;
import com.huellitas.backend.service.SolicitudAdopcionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/solicitudes-adopcion")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5500"
})
public class SolicitudAdopcionController {

    private final SolicitudAdopcionService solicitudService;

    public SolicitudAdopcionController(
            SolicitudAdopcionService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @PostMapping
    public ResponseEntity<SolicitudRespuestaDTO> crearSolicitud(
            @Valid @RequestBody SolicitudCrearDTO datos) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(solicitudService.crearSolicitud(datos));
    }

    @GetMapping("/mis-solicitudes")
    public ResponseEntity<List<SolicitudRespuestaDTO>> listarMisSolicitudes(
            @RequestParam Long idAdoptante) {
        return ResponseEntity.ok(
                solicitudService.listarMisSolicitudes(idAdoptante));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<SolicitudRespuestaDTO>> listarPendientes(
            @RequestParam Long idAdministrador) {
        return ResponseEntity.ok(
                solicitudService.listarPendientes(idAdministrador));
    }

    @PutMapping("/{id}/revision")
    public ResponseEntity<SolicitudRespuestaDTO> revisarSolicitud(
            @PathVariable Long id,
            @Valid @RequestBody SolicitudRevisionDTO datos) {
        return ResponseEntity.ok(
                solicitudService.revisarSolicitud(id, datos));
    }
}