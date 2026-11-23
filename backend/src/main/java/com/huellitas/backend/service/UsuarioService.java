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
import com.huellitas.backend.dto.UsuarioActualizarDTO;
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
    public List<UsuarioRespuestaDTO> listarUsuarios(
            Boolean activo,
            String rol) {

        boolean filtrarPorRol = rol != null && !rol.isBlank();
        String rolNormalizado = filtrarPorRol
                ? rol.trim().toUpperCase()
                : null;

        List<Usuario> usuarios;

        if (activo != null && filtrarPorRol) {
            usuarios = usuarioRepository
                    .findByActivoAndRol_NombreRol(activo, rolNormalizado);
        } else if (activo != null) {
            usuarios = usuarioRepository.findByActivo(activo);
        } else if (filtrarPorRol) {
            usuarios = usuarioRepository
                    .findByRol_NombreRol(rolNormalizado);
        } else {
            usuarios = usuarioRepository.findAll();
        }

        return usuarios.stream()
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
    @Transactional
    public UsuarioRespuestaDTO actualizarUsuario(
            Long id,
            UsuarioActualizarDTO datos) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró el usuario con ID " + id));

        usuario.setNombres(datos.nombres());
        usuario.setApellidos(datos.apellidos());
        usuario.setTelefono(datos.telefono());
        usuario.setDireccion(datos.direccion());

        Usuario actualizado = usuarioRepository.save(usuario);
        return convertirARespuesta(actualizado);
    }
    @Transactional
    public void desactivarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró el usuario con ID " + id));

        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }
    @Transactional(readOnly = true)
    public UsuarioRespuestaDTO iniciarSesion(String correo, String contrasena) {
        Usuario usuario = usuarioRepository.findByCorreo(correo.trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Correo o contraseña incorrectos"));

        boolean contrasenaCorrecta = passwordEncoder.matches(
                contrasena,
                usuario.getContrasenaHash());

        if (!Boolean.TRUE.equals(usuario.getActivo()) || !contrasenaCorrecta) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Correo o contraseña incorrectos");
        }

        return convertirARespuesta(usuario);
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