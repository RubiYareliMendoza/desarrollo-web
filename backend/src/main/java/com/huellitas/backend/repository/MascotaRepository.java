package com.huellitas.backend.repository;

import com.huellitas.backend.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

// Repositorio encargado de consultar y guardar mascotas en MySQL
@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {

    // Busca mascotas por su estado de adopción
    List<Mascota> findByEstadoIgnoreCase(String estado);

    // Busca mascotas por especie, sin distinguir mayúsculas
    List<Mascota> findByEspecieIgnoreCase(String especie);

    // Busca mascotas cuyo nombre contenga el texto indicado
    List<Mascota> findByNombreContainingIgnoreCase(String nombre);

    // Busca mascotas combinando estado, especie y nombre
    @Query("""
        SELECT m FROM Mascota m
        WHERE (:estado IS NULL OR LOWER(m.estado) = LOWER(:estado))
          AND (:especie IS NULL OR LOWER(m.especie) = LOWER(:especie))
          AND (:nombre IS NULL OR LOWER(m.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')))
        """)
    List<Mascota> buscarConFiltros(
        @Param("estado") String estado,
        @Param("especie") String especie,
        @Param("nombre") String nombre
    );


}

