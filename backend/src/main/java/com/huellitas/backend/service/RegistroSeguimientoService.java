package com.huellitas.backend.service;

import com.huellitas.backend.model.RegistroSeguimiento;
import com.huellitas.backend.repository.ExpedienteRepository;
import com.huellitas.backend.repository.RegistroSeguimientoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Contiene la lógica para consultar el historial de seguimiento.
@Service
public class RegistroSeguimientoService {

    private final RegistroSeguimientoRepository registroRepository;
    private final ExpedienteRepository expedienteRepository;

    // Spring inyecta automáticamente los repositorios.
    public RegistroSeguimientoService(
            RegistroSeguimientoRepository registroRepository,
            ExpedienteRepository expedienteRepository) {

        this.registroRepository = registroRepository;
        this.expedienteRepository = expedienteRepository;
    }

    // Consultar los registros de un expediente.
    @Transactional(readOnly = true)
    public List<RegistroSeguimiento> listarPorExpediente(
            Long idExpediente) {

        // Comprobar que el expediente exista.
        if (!expedienteRepository.existsById(idExpediente)) {
            throw new IllegalArgumentException(
                "No existe un expediente con el ID " + idExpediente
            );
        }

        // Obtener los registros ordenados del más reciente al más antiguo.
        return registroRepository
                .findByExpediente_IdExpedienteOrderByFechaEventoDescIdRegistroDesc(
                    idExpediente
                );
    }
}

