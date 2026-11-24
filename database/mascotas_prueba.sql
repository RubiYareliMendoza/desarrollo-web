USE huellitas;

INSERT INTO mascotas
    (nombre, especie, raza, sexo, fecha_nacimiento_estimada, tamano, descripcion, imagen_principal_url, estado)
SELECT datos.nombre, datos.especie, datos.raza, datos.sexo,
       datos.fecha_nacimiento_estimada, datos.tamano, datos.descripcion,
       NULL, 'DISPONIBLE'
FROM (
    SELECT 'Nala' AS nombre, 'Perro' AS especie, 'Mestiza' AS raza, 'Hembra' AS sexo,
           DATE('2024-04-12') AS fecha_nacimiento_estimada, 'Mediano' AS tamano,
           'Perrita sociable y juguetona. Disfruta los paseos y convivir con personas.' AS descripcion
    UNION ALL SELECT 'Milo', 'Gato', 'Europeo común', 'Macho', DATE('2025-02-15'), 'Pequeño',
           'Gatito curioso y cariñoso. Le gustan los juguetes y los espacios tranquilos.'
    UNION ALL SELECT 'Bruno', 'Perro', 'Labrador', 'Macho', DATE('2023-09-08'), 'Grande',
           'Perro amistoso y activo. Necesita ejercicio diario y una familia que disfrute salir a caminar.'
    UNION ALL SELECT 'Kira', 'Gato', 'Siamés', 'Hembra', DATE('2024-11-20'), 'Pequeño',
           'Gatita observadora y afectuosa. Prefiere lugares cómodos para descansar.'
    UNION ALL SELECT 'Toby', 'Perro', 'Schnauzer', 'Macho', DATE('2025-05-04'), 'Pequeño',
           'Perrito alegre y atento. Se adapta bien a rutinas de juego y paseos cortos.'
    UNION ALL SELECT 'Canela', 'Perro', 'Mestiza', 'Hembra', DATE('2024-06-18'), 'Mediano',
           'Perrita tranquila y noble. Disfruta recibir cariño y estar acompañada.'
    UNION ALL SELECT 'Simba', 'Gato', 'Doméstico', 'Macho', DATE('2025-01-10'), 'Mediano',
           'Gato juguetón e independiente. Le encantan los rascadores y las siestas.'
    UNION ALL SELECT 'Coco', 'Perro', 'Chihuahua', 'Macho', DATE('2024-08-27'), 'Pequeño',
           'Perrito vivaz y curioso. Necesita una adaptación paciente a nuevos espacios.'
    UNION ALL SELECT 'Mía', 'Gato', 'Persa', 'Hembra', DATE('2023-12-03'), 'Mediano',
           'Gatita de carácter sereno. Requiere cepillado frecuente y un hogar tranquilo.'
    UNION ALL SELECT 'Balú', 'Perro', 'Golden Retriever', 'Macho', DATE('2023-03-22'), 'Grande',
           'Perro muy sociable y juguetón. Disfruta la actividad física y la convivencia familiar.'
) AS datos
WHERE NOT EXISTS (
    SELECT 1
    FROM mascotas AS existente
    WHERE existente.nombre = datos.nombre
      AND existente.especie = datos.especie
);

-- Revisión de los registros incluidos en el catálogo.
SELECT id_mascota, nombre, especie, raza, sexo, tamano, estado
FROM mascotas
ORDER BY id_mascota;

INSERT INTO mascotas
    (nombre, especie, raza, sexo, tamano, estado, imagen_principal_url)
SELECT datos.nombre, datos.especie, datos.raza, datos.sexo,
       datos.tamano, datos.estado, NULL
FROM (
    SELECT 'Rocky' AS nombre, 'Perro' AS especie, 'Mestizo' AS raza,
           'Macho' AS sexo, 'Pequeño' AS tamano, 'INACTIVA' AS estado
    UNION ALL SELECT 'Max', 'Perro', 'Husky Siberiano', 'Macho', 'Grande', 'INACTIVA'
    UNION ALL SELECT 'Condor', 'Perro', 'Perro salchicha', 'Macho', 'Grande', 'DISPONIBLE'
    UNION ALL SELECT 'Dan', 'Perro', 'Pit Bull Terrier', 'Macho', 'Grande', 'DISPONIBLE'
    UNION ALL SELECT 'Loba', 'Perro', 'Husky Siberiano blanco', 'Hembra', 'Pequeño', 'DISPONIBLE'
) AS datos
WHERE NOT EXISTS (
    SELECT 1
    FROM mascotas AS existente
    WHERE existente.nombre = datos.nombre
      AND existente.especie = datos.especie
);

SELECT id_mascota, nombre, especie, raza, sexo, tamano, estado
FROM mascotas
ORDER BY id_mascota;

USE huellitas;

-- Permitir actualizaciones por nombre durante esta sesión.
SET @safe_updates_anterior = @@SQL_SAFE_UPDATES;
SET SQL_SAFE_UPDATES = 0;

-- Asignar las fotografías estáticas a las mascotas.
UPDATE mascotas
SET imagen_principal_url = CASE nombre
    WHEN 'Nala'   THEN 'img/mascotas/Nala.jpg'
    WHEN 'Milo'   THEN 'img/mascotas/Milo.jpeg'
    WHEN 'Bruno'  THEN 'img/mascotas/Bruno.jpg'
    WHEN 'Kira'   THEN 'img/mascotas/Kira.jpg'
    WHEN 'Toby'   THEN 'img/mascotas/Toby.jpg'
    WHEN 'Canela' THEN 'img/mascotas/Canela.jpg'
    WHEN 'Simba'  THEN 'img/mascotas/Simba.jpg'
    WHEN 'Coco'   THEN 'img/mascotas/Coco.webp'
    WHEN 'Mía'    THEN 'img/mascotas/Mía.jpg'
    WHEN 'Balú'   THEN 'img/mascotas/Balú.jpg'
    WHEN 'Condor' THEN 'img/mascotas/Condor.jpg'
    WHEN 'Dan'    THEN 'img/mascotas/Dan.jpg'
    WHEN 'Loba'   THEN 'img/mascotas/Loba.webp'
    WHEN 'Max'    THEN 'img/mascotas/Max.jpeg'
    ELSE imagen_principal_url
END
WHERE nombre IN (
    'Nala', 'Milo', 'Bruno', 'Kira', 'Toby',
    'Canela', 'Simba', 'Coco', 'Mía', 'Balú',
    'Condor', 'Dan', 'Loba', 'Max'
);

-- Restaurar la configuración anterior.
SET SQL_SAFE_UPDATES = @safe_updates_anterior;
SELECT id_mascota, nombre, imagen_principal_url
FROM mascotas
ORDER BY id_mascota;