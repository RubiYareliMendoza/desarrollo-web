package com.huellitas.backend.repository;
import com.huellitas.backend.model.Expediente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Permite realizar operaciones sobre la tabla expedientes.
public interface ExpedienteRepository
        extends JpaRepository<Expediente, Long> {

    // Busca el expediente asociado a una mascota.
    Optional<Expediente> findByMascota_IdMascota(Long idMascota);

    // Comprueba si una mascota ya tiene expediente.
    boolean existsByMascota_IdMascota(Long idMascota);
}
