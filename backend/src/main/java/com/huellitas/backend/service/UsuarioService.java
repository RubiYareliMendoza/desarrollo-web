package com.huellitas.backend.service;

import com.huellitas.backend.dto.UsuarioRegistroDTO;
import com.huellitas.backend.dto.UsuarioRespuestaDTO;
import com.huellitas.backend.model.Rol;
import com.huellitas.backend.model.Usuario;
import com.huellitas.backend.repository.RolRepository;
import com.huellitas.backend.repository.UsuarioRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Transactional(readOnly = true)
    public List<UsuarioRespuestaDTO> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::convertirARespuesta)
                .toList();
    }

    @Transactional
    public UsuarioRespuestaDTO registrarUsuario(UsuarioRegistroDTO datos) {
        if (usuarioRepository.existsByCorreo(datos.correo())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una cuenta con ese correo");
        }

        Rol rolAdoptante = rolRepository.findByNombreRol("ADOPTANTE")
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "No se encontró el rol ADOPTANTE"));

        Usuario usuario = new Usuario();
        usuario.setRol(rolAdoptante);
        usuario.setNombres(datos.nombres());
        usuario.setApellidos(datos.apellidos());
        usuario.setCorreo(datos.correo());
        usuario.setContrasenaHash(
                passwordEncoder.encode(datos.contrasena()));
        usuario.setTelefono(datos.telefono());
        usuario.setDireccion(datos.direccion());
        usuario.setActivo(true);
        usuario.setFechaRegistro(LocalDateTime.now());

        Usuario guardado = usuarioRepository.save(usuario);
        return convertirARespuesta(guardado);
    }

    private UsuarioRespuestaDTO convertirARespuesta(Usuario usuario) {
        return new UsuarioRespuestaDTO(
                usuario.getIdUsuario(),
                usuario.getRol().getIdRol(),
                usuario.getRol().getNombreRol(),
                usuario.getNombres(),
                usuario.getApellidos(),
                usuario.getCorreo(),
                usuario.getTelefono(),
                usuario.getDireccion(),
                usuario.getActivo(),
                usuario.getFechaRegistro());
    }

    @Transactional(readOnly = true)
public UsuarioRespuestaDTO buscarUsuarioPorId(Long id) {
    Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se encontró el usuario con ID " + id));

    return convertirARespuesta(usuario);
}
}