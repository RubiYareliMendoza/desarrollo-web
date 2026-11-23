
package com.huellitas.backend.service;

import com.huellitas.backend.model.Mascota;
import com.huellitas.backend.repository.MascotaRepository;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;


@Service
public class MascotaService {

    // Repositorio que permite acceder a los datos de mascotas
    private final MascotaRepository mascotaRepository;

    // Recibe el repositorio automáticamente mediante Spring
    public MascotaService(MascotaRepository mascotaRepository) {
        this.mascotaRepository = mascotaRepository;
    }

    // Obtiene una mascota mediante su identificador.
    public Mascota obtenerMascotaPorId(Long id) {
        return mascotaRepository.findById(id).orElse(null);
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

    // Actualiza los datos de una mascota existente
    public Mascota actualizarMascota(Long id, Mascota datosActualizados) {

        // Busca la mascota por su identificador
        Mascota mascota = mascotaRepository.findById(id).orElse(null);

        // Si no existe, devuelve null para responder con 404
        if (mascota == null) {
            return null;
        }

        // Impide actualizar mascotas inactivas
        if ("INACTIVA".equalsIgnoreCase(mascota.getEstado())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "No se puede actualizar una mascota inactiva"
            );
        }

        // Actualiza únicamente los datos editables
        mascota.setNombre(datosActualizados.getNombre());
        mascota.setEspecie(datosActualizados.getEspecie());
        mascota.setRaza(datosActualizados.getRaza());
        mascota.setSexo(datosActualizados.getSexo());
        mascota.setFechaNacimientoEstimada(
            datosActualizados.getFechaNacimientoEstimada()
        );
        mascota.setTamano(datosActualizados.getTamano());
        mascota.setDescripcion(datosActualizados.getDescripcion());

        // Conserva ID, estado y fecha de registro
        return mascotaRepository.save(mascota);
    }

    // Desactiva una mascota sin eliminarla físicamente
    public boolean eliminarMascota(Long id) {

        // Busca la mascota por su identificador
        Mascota mascota = mascotaRepository.findById(id).orElse(null);

        // Si no existe, devuelve false
        if (mascota == null) {
            return false;
        }

        // Si ya está inactiva, no necesita modificarse
        if ("INACTIVA".equalsIgnoreCase(mascota.getEstado())) {
            return true;
        }

        // Desactiva la mascota y guarda el cambio
        mascota.setEstado("INACTIVA");
        mascotaRepository.save(mascota);

        return true;
    }

    // Consulta mascotas según su estado de adopción
    public List<Mascota> filtrarPorEstado(String estado) {
        return mascotaRepository.findByEstadoIgnoreCase(estado);
    }

    // Consulta mascotas según su especie
    public List<Mascota> filtrarPorEspecie(String especie) {
        return mascotaRepository.findByEspecieIgnoreCase(especie);
    }

    // Busca mascotas que coincidan parcialmente con un nombre
    public List<Mascota> filtrarPorNombre(String nombre) {
        return mascotaRepository.findByNombreContainingIgnoreCase(nombre);
    }

    // Busca mascotas utilizando varios filtros al mismo tiempo
    public List<Mascota> buscarConFiltros(
            String estado, String especie, String nombre) {

        // Convierte los textos vacíos en null para ignorar esos filtros
        if (estado != null && estado.isBlank()) {
            estado = null;
        }

        if (especie != null && especie.isBlank()) {
            especie = null;
        }

        if (nombre != null && nombre.isBlank()) {
            nombre = null;
        }

        // Consulta las mascotas que cumplen todas las condiciones
        return mascotaRepository.buscarConFiltros(
            estado, especie, nombre
        );
    }


}
