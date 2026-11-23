package com.huellitas.backend.repository;

import com.huellitas.backend.model.SolicitudAdopcion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudAdopcionRepository
        extends JpaRepository<SolicitudAdopcion, Long> {

    List<SolicitudAdopcion>
            findByAdoptante_IdUsuarioOrderByFechaSolicitudDesc(
                    Long idAdoptante);

    List<SolicitudAdopcion>
            findByEstadoOrderByFechaSolicitudAsc(String estado);

    List<SolicitudAdopcion> findByMascota_IdMascotaAndEstado(
            Long idMascota,
            String estado);

    boolean existsByMascota_IdMascotaAndAdoptante_IdUsuarioAndEstado(
            Long idMascota,
            Long idAdoptante,
            String estado);
}