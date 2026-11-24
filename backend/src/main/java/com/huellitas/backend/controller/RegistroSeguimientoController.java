
package com.huellitas.backend.controller;

import com.huellitas.backend.dto.RegistroSeguimientoCrearDTO;
import com.huellitas.backend.model.RegistroSeguimiento;
import com.huellitas.backend.service.RegistroSeguimientoService;
import com.huellitas.backend.dto.RegistroSeguimientoEditarDTO;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registros-seguimiento")
@CrossOrigin(origins = {
    "http://127.0.0.1:3000",
    "http://localhost:3000"
})
public class RegistroSeguimientoController {

    private final RegistroSeguimientoService registroService;

    public RegistroSeguimientoController(
            RegistroSeguimientoService registroService) {
        this.registroService = registroService;
    }

    // GET: consultar historial de un expediente.
    @GetMapping("/expediente/{idExpediente}")
    public ResponseEntity<List<RegistroSeguimiento>> listarPorExpediente(
            @PathVariable Long idExpediente) {

        List<RegistroSeguimiento> registros =
            registroService.listarPorExpediente(idExpediente);

        return ResponseEntity.ok(registros);
    }

    // POST: registrar vacuna, consulta u otro evento.
    @PostMapping
    public ResponseEntity<RegistroSeguimiento> crearRegistro(
            @Valid @RequestBody RegistroSeguimientoCrearDTO datos) {

        RegistroSeguimiento nuevo =
            registroService.crearRegistro(datos);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(nuevo);
    }

    // Responder 404 si no existe el expediente consultado.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> manejarNoEncontrado(
            IllegalArgumentException error) {

        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", error.getMessage()));
    }

    // PUT: editar un registro de seguimiento.
    @PutMapping("/{idRegistro}")
    public ResponseEntity<RegistroSeguimiento> actualizarRegistro(
            @PathVariable Long idRegistro,
            @Valid @RequestBody RegistroSeguimientoEditarDTO datos) {

        RegistroSeguimiento actualizado =
            registroService.actualizarRegistro(idRegistro, datos);

        return ResponseEntity.ok(actualizado);
    }

    // DELETE: eliminar un registro de seguimiento.
    @DeleteMapping("/{idRegistro}")
    public ResponseEntity<Void> eliminarRegistro(
            @PathVariable Long idRegistro) {

        registroService.eliminarRegistro(idRegistro);

        return ResponseEntity.noContent().build();
    }

}
