package com.huellitas.backend.repository;

import com.huellitas.backend.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repositorio encargado de consultar y guardar mascotas en MySQL
@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {

}

