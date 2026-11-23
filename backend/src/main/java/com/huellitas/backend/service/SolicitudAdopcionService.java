package com.huellitas.backend.service;

import com.huellitas.backend.dto.SolicitudCrearDTO;
import com.huellitas.backend.dto.SolicitudRespuestaDTO;
import com.huellitas.backend.dto.SolicitudRevisionDTO;
import com.huellitas.backend.model.Adopcion;
import com.huellitas.backend.model.Mascota;
import com.huellitas.backend.model.SolicitudAdopcion;
import com.huellitas.backend.model.Usuario;
import com.huellitas.backend.repository.AdopcionRepository;
import com.huellitas.backend.repository.MascotaRepository;
import com.huellitas.backend.repository.SolicitudAdopcionRepository;
import com.huellitas.backend.repository.UsuarioRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SolicitudAdopcionService {

    private final SolicitudAdopcionRepository solicitudRepository;
    private final MascotaRepository mascotaRepository;
    private final UsuarioRepository usuarioRepository;
    private final AdopcionRepository adopcionRepository;

    public SolicitudAdopcionService(
            SolicitudAdopcionRepository solicitudRepository,
            MascotaRepository mascotaRepository,
            UsuarioRepository usuarioRepository,
            AdopcionRepository adopcionRepository) {
        this.solicitudRepository = solicitudRepository;
        this.mascotaRepository = mascotaRepository;
        this.usuarioRepository = usuarioRepository;
        this.adopcionRepository = adopcionRepository;
    }

    @Transactional
    public SolicitudRespuestaDTO crearSolicitud(SolicitudCrearDTO datos) {
        Usuario adoptante = buscarUsuarioConRol(
                datos.idAdoptante(), "ADOPTANTE");

        Mascota mascota = mascotaRepository.findById(datos.idMascota())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No se encontró la mascota"));

        if (!"DISPONIBLE".equalsIgnoreCase(mascota.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La mascota ya no está disponible para adopción");
        }

        boolean yaTienePendiente =
                solicitudRepository
                        .existsByMascota_IdMascotaAndAdoptante_IdUsuarioAndEstado(
                                mascota.getIdMascota(),
                                adoptante.getIdUsuario(),
                                "PENDIENTE");

        if (yaTienePendiente) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya tienes una solicitud pendiente para esta mascota");
        }

        SolicitudAdopcion solicitud = new SolicitudAdopcion();
        solicitud.setMascota(mascota);
        solicitud.setAdoptante(adoptante);
        solicitud.setFechaSolicitud(LocalDateTime.now());
        solicitud.setEstado("PENDIENTE");
        solicitud.setMensaje(datos.mensaje());

        return convertirARespuesta(solicitudRepository.save(solicitud));
    }

    @Transactional(readOnly = true)
    public List<SolicitudRespuestaDTO> listarMisSolicitudes(
            Long idAdoptante) {
        buscarUsuarioConRol(idAdoptante, "ADOPTANTE");

        return solicitudRepository
                .findByAdoptante_IdUsuarioOrderByFechaSolicitudDesc(
                        idAdoptante)
                .stream()
                .map(this::convertirARespuesta)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitudRespuestaDTO> listarPendientes(
            Long idAdministrador) {
        buscarUsuarioConRol(idAdministrador, "ADMINISTRADOR");

        return solicitudRepository
                .findByEstadoOrderByFechaSolicitudAsc("PENDIENTE")
                .stream()
                .map(this::convertirARespuesta)
                .toList();
    }

    @Transactional
    public SolicitudRespuestaDTO revisarSolicitud(
            Long idSolicitud,
            SolicitudRevisionDTO datos) {
        Usuario administrador = buscarUsuarioConRol(
                datos.idRevisor(), "ADMINISTRADOR");

        SolicitudAdopcion solicitud =
                solicitudRepository.findById(idSolicitud)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "No se encontró la solicitud"));

        if (!"PENDIENTE".equalsIgnoreCase(solicitud.getEstado())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La solicitud ya fue revisada");
        }

        String nuevoEstado = datos.estado().toUpperCase(Locale.ROOT);
        Mascota mascota = solicitud.getMascota();

        if ("APROBADA".equals(nuevoEstado)) {
            if (!"DISPONIBLE".equalsIgnoreCase(mascota.getEstado())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "La mascota ya no está disponible");
            }

            if (adopcionRepository.existsBySolicitud_IdSolicitud(idSolicitud)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "La solicitud ya tiene una adopción registrada");
            }

            mascota.setEstado("ADOPTADA");
            mascotaRepository.save(mascota);

            Adopcion adopcion = new Adopcion();
            adopcion.setSolicitud(solicitud);
            adopcion.setFechaAdopcion(LocalDate.now());
            adopcion.setEstado("ACTIVA");
            adopcion.setObservaciones(datos.observacionesRevision());
            adopcionRepository.save(adopcion);

            List<SolicitudAdopcion> pendientesDeLaMascota =
                    solicitudRepository.findByMascota_IdMascotaAndEstado(
                            mascota.getIdMascota(), "PENDIENTE");

            for (SolicitudAdopcion otra : pendientesDeLaMascota) {
                if (!otra.getIdSolicitud().equals(idSolicitud)) {
                    otra.setEstado("RECHAZADA");
                    otra.setRevisor(administrador);
                    otra.setObservacionesRevision(
                            "La mascota fue asignada a otra solicitud aprobada.");
                }
            }
            solicitudRepository.saveAll(pendientesDeLaMascota);
        }

        solicitud.setEstado(nuevoEstado);
        solicitud.setRevisor(administrador);
        solicitud.setObservacionesRevision(
                datos.observacionesRevision());

        return convertirARespuesta(solicitudRepository.save(solicitud));
    }

    private Usuario buscarUsuarioConRol(Long idUsuario, String rolEsperado) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No se encontró el usuario"));

        if (!Boolean.TRUE.equals(usuario.getActivo())
                || !rolEsperado.equalsIgnoreCase(
                        usuario.getRol().getNombreRol())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "La cuenta no tiene permisos para esta operación");
        }

        return usuario;
    }

    private SolicitudRespuestaDTO convertirARespuesta(
            SolicitudAdopcion solicitud) {
        Usuario adoptante = solicitud.getAdoptante();
        Usuario revisor = solicitud.getRevisor();

        return new SolicitudRespuestaDTO(
                solicitud.getIdSolicitud(),
                solicitud.getMascota().getIdMascota(),
                solicitud.getMascota().getNombre(),
                adoptante.getIdUsuario(),
                adoptante.getNombres() + " " + adoptante.getApellidos(),
                adoptante.getCorreo(),
                revisor == null ? null : revisor.getIdUsuario(),
                revisor == null
                        ? null
                        : revisor.getNombres() + " " + revisor.getApellidos(),
                solicitud.getFechaSolicitud(),
                solicitud.getEstado(),
                solicitud.getMensaje(),
                solicitud.getObservacionesRevision());
    }
}