
package com.huellitas.backend.service;

import com.huellitas.backend.model.Mascota;
import com.huellitas.backend.repository.MascotaRepository;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MascotaService {

    // Repositorio que permite acceder a los datos de mascotas
    private final MascotaRepository mascotaRepository;

    // Recibe el repositorio automáticamente mediante Spring
    public MascotaService(MascotaRepository mascotaRepository) {
        this.mascotaRepository = mascotaRepository;
    }

    // Obtiene todas las mascotas registradas
    public List<Mascota> listarMascotas() {
        return mascotaRepository.findAll();
    }

    
    // Registra una mascota con su estado y fecha inicial
    public Mascota registrarMascota(Mascota mascota) {

        // Toda mascota nueva comienza como disponible
        mascota.setEstado("DISPONIBLE");

        // Guarda automáticamente la fecha y hora del registro
        mascota.setFechaRegistro(LocalDateTime.now());

        // Almacena la mascota mediante el repositorio
        return mascotaRepository.save(mascota);
    }

}
