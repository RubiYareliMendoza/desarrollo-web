package com.huellitas.backend.service;

import com.huellitas.backend.model.Expediente;
import com.huellitas.backend.model.Mascota;
import com.huellitas.backend.repository.ExpedienteRepository;
import com.huellitas.backend.repository.MascotaRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import java.util.List;

// Contiene la lógica para administrar los expedientes digitales.
@Service
public class ExpedienteService {

    private final ExpedienteRepository expedienteRepository;
    private final MascotaRepository mascotaRepository;
    private final EntityManager entityManager;

    // Spring proporciona automáticamente los repositorios.
    public ExpedienteService(
            ExpedienteRepository expedienteRepository,
            MascotaRepository mascotaRepository,
            EntityManager entityManager) {

        this.expedienteRepository = expedienteRepository;
        this.mascotaRepository = mascotaRepository;
        this.entityManager = entityManager;
    }

    // Consultar todos los expedientes registrados.
    @Transactional(readOnly = true)
    public List<Expediente> listarExpedientes() {
        return expedienteRepository.findAll();
    }

    // Consultar el expediente de una mascota específica.
    @Transactional(readOnly = true)
    public Expediente obtenerPorMascota(Long idMascota) {

        // Primero comprobamos que la mascota exista.
        if (!mascotaRepository.existsById(idMascota)) {
            throw new IllegalArgumentException(
                "No existe una mascota con el ID " + idMascota
            );
        }

        return expedienteRepository.findByMascota_IdMascota(idMascota)
                .orElseThrow(() -> new IllegalArgumentException(
                    "La mascota todavía no tiene un expediente."
                ));
    }

    // Crear un expediente para una mascota existente.
    @Transactional
    public Expediente crearExpediente(
            Long idMascota, String observaciones) {

        // Buscar la mascota en MySQL.
        Mascota mascota = mascotaRepository.findById(idMascota)
                .orElseThrow(() -> new IllegalArgumentException(
                    "No existe una mascota con el ID " + idMascota
                ));

        // Evitar que una mascota tenga dos expedientes.
        if (expedienteRepository.existsByMascota_IdMascota(idMascota)) {
            throw new IllegalStateException(
                "Esta mascota ya tiene un expediente registrado."
            );
        }

        // Crear el expediente y asociarlo a la mascota.
        Expediente expediente = new Expediente();
        expediente.setMascota(mascota);
        expediente.setObservacionesGenerales(observaciones);
        
        // Guardar el expediente en MySQL.
        Expediente expedienteGuardado =
                expedienteRepository.saveAndFlush(expediente);

        // Recuperar los valores generados por la base de datos,
        // como la fecha de creación.
        expedienteRepository.flush();
        
        // Actualizar la entidad desde MySQL.
        entityManager.refresh(expedienteGuardado);

        return expedienteGuardado;
    }

    // Actualizar las observaciones de un expediente.
    @Transactional
    public Expediente actualizarObservaciones(
            Long idMascota, String observaciones) {

        // Obtener el expediente existente.
        Expediente expediente = expedienteRepository
                .findByMascota_IdMascota(idMascota)
                .orElseThrow(() -> new IllegalArgumentException(
                    "No existe un expediente para esta mascota."
                ));

        // Modificar únicamente las observaciones generales.
        expediente.setObservacionesGenerales(observaciones);

        // Guardar los cambios.
        return expedienteRepository.save(expediente);
    }
}
