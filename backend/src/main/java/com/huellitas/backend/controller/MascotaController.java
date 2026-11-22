package com.huellitas.backend.controller;
import com.huellitas.backend.service.ImagenMascotaService;
import org.springframework.web.multipart.MultipartFile;
import com.huellitas.backend.model.Mascota;
import com.huellitas.backend.service.MascotaService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
// Indica que esta clase recibe peticiones HTTP y devuelve respuestas JSON
@RestController
@RequestMapping("/api/mascotas")
@CrossOrigin(origins = {"http://127.0.0.1:3000", "http://localhost:3000"})
public class MascotaController {
    private final MascotaService mascotaService;
    private final ImagenMascotaService imagenMascotaService;
    public MascotaController(
        MascotaService mascotaService,
        ImagenMascotaService imagenMascotaService) {

    this.mascotaService = mascotaService;
    this.imagenMascotaService = imagenMascotaService;
}

    // GET: consulta mascotas utilizando filtros opcionales
    @GetMapping
    public ResponseEntity<List<Mascota>> listarMascotas(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String especie,
            @RequestParam(required = false) String nombre) {

        // Obtiene las mascotas que cumplen los filtros indicados
        List<Mascota> mascotas = mascotaService.buscarConFiltros(
                estado, especie, nombre
        );

        // Devuelve los resultados en formato JSON
        return ResponseEntity.ok(mascotas);
    }

    // POST: recibe los datos de una mascota y la registra
    @PostMapping
    public ResponseEntity<Mascota> registrarMascota(@Valid @RequestBody Mascota mascota) {
        Mascota nuevaMascota = mascotaService.registrarMascota(mascota);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaMascota);
    }

    // PUT: actualiza los datos de una mascota existente
    @PutMapping("/{id}")
    public ResponseEntity<Mascota> actualizarMascota(
            @PathVariable Long id,
            @Valid @RequestBody Mascota mascota) {

        // Solicita al servicio actualizar la mascota
        Mascota mascotaActualizada = mascotaService.actualizarMascota(id, mascota);

        // Si la mascota no existe, responde con HTTP 404
        if (mascotaActualizada == null) {
            return ResponseEntity.notFound().build();
        }

        // Devuelve la mascota actualizada con HTTP 200
        return ResponseEntity.ok(mascotaActualizada);
    }

    // DELETE: desactiva una mascota sin borrar sus datos de MySQL
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMascota(@PathVariable Long id) {

        // Solicita al servicio desactivar la mascota
        boolean eliminada = mascotaService.eliminarMascota(id);

        // Si la mascota no existe, devuelve HTTP 404
        if (!eliminada) {
            return ResponseEntity.notFound().build();
        }

        // Si se desactivó correctamente, devuelve HTTP 204
        return ResponseEntity.noContent().build();
    }

    // POST: sube una fotografía principal para una mascota
    @PostMapping(
        value = "/{id}/imagen",
        consumes = "multipart/form-data"
    )
    public ResponseEntity<Mascota> subirImagen(
            @PathVariable Long id,
            @RequestParam("archivo") MultipartFile archivo) {

        Mascota mascotaActualizada =
                imagenMascotaService.guardarImagen(id, archivo);

        return ResponseEntity.ok(mascotaActualizada);
    }

    // GET: permite visualizar las fotografías guardadas
    @GetMapping("/imagenes/{nombreArchivo:.+}")
    public ResponseEntity<Resource> obtenerImagen(
            @PathVariable String nombreArchivo) {

        // Solo aceptar nombres de archivos generados por nuestro sistema
        if (!nombreArchivo.matches(
                "[0-9a-fA-F-]{36}\\.(jpg|png|webp)")) {
            return ResponseEntity.badRequest().build();
        }

        Path directorio = Path.of(
                "uploads", "mascotas"
        ).toAbsolutePath().normalize();

        Path rutaImagen = directorio.resolve(nombreArchivo).normalize();

        if (!rutaImagen.startsWith(directorio)
                || !Files.isRegularFile(rutaImagen)) {
            return ResponseEntity.notFound().build();
        }

        MediaType tipoImagen;

        if (nombreArchivo.endsWith(".png")) {
            tipoImagen = MediaType.IMAGE_PNG;
        } else if (nombreArchivo.endsWith(".webp")) {
            tipoImagen = MediaType.parseMediaType("image/webp");
        } else {
            tipoImagen = MediaType.IMAGE_JPEG;
        }

        Resource recurso = new FileSystemResource(rutaImagen);

        return ResponseEntity.ok()
                .contentType(tipoImagen)
                .body(recurso);
    }




}
