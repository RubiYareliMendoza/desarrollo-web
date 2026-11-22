package com.huellitas.backend.service;
import com.huellitas.backend.model.Mascota;
import com.huellitas.backend.repository.MascotaRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ImagenMascotaService {

    private static final long TAMANO_MAXIMO = 5L * 1024 * 1024;

    private final MascotaRepository mascotaRepository;

    private final Path directorio = Path.of(
            "uploads", "mascotas"
    ).toAbsolutePath().normalize();

    public ImagenMascotaService(MascotaRepository mascotaRepository) {
        this.mascotaRepository = mascotaRepository;
    }

    @Transactional
    public Mascota guardarImagen(Long idMascota, MultipartFile archivo) {

        Mascota mascota = mascotaRepository.findById(idMascota)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "La mascota no existe"
                ));

        if (archivo == null || archivo.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debes seleccionar una imagen"
            );
        }

        if (archivo.getSize() > TAMANO_MAXIMO) {
            throw new ResponseStatusException(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "La imagen no debe superar los 5 MB"
            );
        }

        Path destino = null;

        try {
            byte[] contenido = archivo.getBytes();

            String extension = detectarExtension(contenido);

            if (extension == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Solo se permiten imágenes JPG, PNG o WebP"
                );
            }

            Files.createDirectories(directorio);

            String nombreArchivo = UUID.randomUUID() + "." + extension;

            destino = directorio.resolve(nombreArchivo);

            Files.write(destino, contenido);

            // Guardar la URL pública en MySQL
            mascota.setImagenPrincipalUrl(
                    "/api/mascotas/imagenes/" + nombreArchivo
            );

            return mascotaRepository.saveAndFlush(mascota);

        } catch (IOException e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "No se pudo guardar la imagen",
                    e
            );

        } catch (RuntimeException e) {

            // Evitar dejar un archivo nuevo si falla el guardado
            if (destino != null) {
                try {
                    Files.deleteIfExists(destino);
                } catch (IOException ex) {
                    e.addSuppressed(ex);
                }
            }

            throw e;
        }
    }

    // Identificar el formato por el contenido del archivo
    private String detectarExtension(byte[] datos) {

        if (datos.length >= 3
                && (datos[0] & 0xFF) == 0xFF
                && (datos[1] & 0xFF) == 0xD8
                && (datos[2] & 0xFF) == 0xFF) {
            return "jpg";
        }

        if (datos.length >= 8
                && (datos[0] & 0xFF) == 0x89
                && datos[1] == 0x50
                && datos[2] == 0x4E
                && datos[3] == 0x47
                && datos[4] == 0x0D
                && datos[5] == 0x0A
                && datos[6] == 0x1A
                && datos[7] == 0x0A) {
            return "png";
        }

        if (datos.length >= 12
                && datos[0] == 'R'
                && datos[1] == 'I'
                && datos[2] == 'F'
                && datos[3] == 'F'
                && datos[8] == 'W'
                && datos[9] == 'E'
                && datos[10] == 'B'
                && datos[11] == 'P') {
            return "webp";
        }

        return null;
    }
}
