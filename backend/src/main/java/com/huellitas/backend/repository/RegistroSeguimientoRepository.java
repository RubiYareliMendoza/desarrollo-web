package com.huellitas.backend.repository;

import com.huellitas.backend.model.RegistroSeguimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Permite consultar los registros de seguimiento en MySQL.
public interface RegistroSeguimientoRepository
        extends JpaRepository<RegistroSeguimiento, Long> {

    // Obtiene los registros de un expediente.
    // Los ordena del evento más reciente al más antiguo.
    List<RegistroSeguimiento>
        findByExpediente_IdExpedienteOrderByFechaEventoDescIdRegistroDesc(
            Long idExpediente
        );

    // Comprueba si el expediente tiene registros de seguimiento.
    boolean existsByExpediente_IdExpediente(Long idExpediente);
}

