package com.huellitas.backend.repository;

import com.huellitas.backend.model.Adopcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdopcionRepository extends JpaRepository<Adopcion, Long> {

    boolean existsBySolicitud_IdSolicitud(Long idSolicitud);
}