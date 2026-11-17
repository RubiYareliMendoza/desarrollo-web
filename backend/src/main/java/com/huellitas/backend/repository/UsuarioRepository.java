package com.huellitas.backend.repository;

import com.huellitas.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCorreo(String correo);

    boolean existsByCorreo(String correo);

    List<Usuario> findByActivo(Boolean activo);

    List<Usuario> findByRol_NombreRol(String nombreRol);

    List<Usuario> findByActivoAndRol_NombreRol(
            Boolean activo,
            String nombreRol
        );
}
