
package com.huellitas.backend.service;
import com.huellitas.backend.dto.RegistroSeguimientoEditarDTO;
import com.huellitas.backend.dto.RegistroSeguimientoCrearDTO;
import com.huellitas.backend.model.Expediente;
import com.huellitas.backend.model.RegistroSeguimiento;
import com.huellitas.backend.repository.ExpedienteRepository;
import com.huellitas.backend.repository.RegistroSeguimientoRepository;
import com.huellitas.backend.repository.UsuarioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class RegistroSeguimientoService {

    private final RegistroSeguimientoRepository registroRepository;
    private final ExpedienteRepository expedienteRepository;
    private final UsuarioRepository usuarioRepository;

    public RegistroSeguimientoService(
            RegistroSeguimientoRepository registroRepository,
            ExpedienteRepository expedienteRepository,
            UsuarioRepository usuarioRepository) {

        this.registroRepository = registroRepository;
        this.expedienteRepository = expedienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // GET: consultar el historial de un expediente.
    @Transactional(readOnly = true)
    public List<RegistroSeguimiento> listarPorExpediente(
            Long idExpediente) {

        if (!expedienteRepository.existsById(idExpediente)) {
            throw new IllegalArgumentException(
                "No existe un expediente con el ID " + idExpediente
            );
        }

        return registroRepository
            .findByExpediente_IdExpedienteOrderByFechaEventoDescIdRegistroDesc(
                idExpediente
            );
    }

    // POST: registrar un nuevo evento en el historial.
    @Transactional
    public RegistroSeguimiento crearRegistro(
            RegistroSeguimientoCrearDTO datos) {

        // Comprobar que el expediente exista.
        Expediente expediente = expedienteRepository
            .findById(datos.idExpediente())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No existe el expediente indicado."
            ));

        // Comprobar que el usuario responsable exista.
        if (!usuarioRepository.existsById(datos.idUsuarioRegistro())) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No existe el usuario responsable."
            );
        }

        // Validar que el peso, si se indica, sea positivo.
        if (datos.pesoKg() != null &&
                datos.pesoKg().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El peso debe ser mayor que cero."
            );
        }

        // Crear el registro.
        RegistroSeguimiento registro = new RegistroSeguimiento();

        registro.setExpediente(expediente);
        registro.setIdUsuarioRegistro(datos.idUsuarioRegistro());
        registro.setTipo(datos.tipo().trim().toUpperCase());
        registro.setNombre(datos.nombre().trim());
        registro.setFechaEvento(datos.fechaEvento());
        registro.setDescripcion(datos.descripcion());
        registro.setPesoKg(datos.pesoKg());
        registro.setVeterinario(datos.veterinario());
        registro.setProximaFecha(datos.proximaFecha());

        // Guardar en MySQL.
        return registroRepository.save(registro);
    }

    // PUT: actualizar un registro existente.
    @Transactional
    public RegistroSeguimiento actualizarRegistro(
            Long idRegistro,
            RegistroSeguimientoEditarDTO datos) {

        RegistroSeguimiento registro = registroRepository
            .findById(idRegistro)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No existe el registro de seguimiento."
            ));

        if (datos.pesoKg() != null &&
                datos.pesoKg().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El peso debe ser mayor que cero."
            );
        }

        registro.setTipo(datos.tipo().trim().toUpperCase());
        registro.setNombre(datos.nombre().trim());
        registro.setFechaEvento(datos.fechaEvento());
        registro.setDescripcion(datos.descripcion());
        registro.setPesoKg(datos.pesoKg());
        registro.setVeterinario(datos.veterinario());
        registro.setProximaFecha(datos.proximaFecha());

        return registroRepository.save(registro);
    }

    // DELETE: eliminar un registro del historial.
    @Transactional
    public void eliminarRegistro(Long idRegistro) {

        RegistroSeguimiento registro = registroRepository
            .findById(idRegistro)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No existe el registro de seguimiento."
            ));

        registroRepository.delete(registro);
    }

}
