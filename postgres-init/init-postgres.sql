-- Crear tablas para el modelo de PostgreSQL

-- Tabla de asociaciones
CREATE TABLE associations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de unidades
CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    association_id INTEGER NOT NULL,
    FOREIGN KEY (association_id) REFERENCES associations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    names VARCHAR(255) NOT NULL,
    last_names VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para relación muchos a muchos entre usuarios y unidades
CREATE TABLE user_units (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    unit_id INTEGER NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'owner' o 'resident'
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (unit_id) REFERENCES units(id),
    UNIQUE (user_id, unit_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para relación muchos a muchos entre usuarios y asociaciones
CREATE TABLE user_associations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    association_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (association_id) REFERENCES associations(id),
    UNIQUE (user_id, association_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de prueba

-- Asociaciones
INSERT INTO associations (id, name, address) VALUES
(1, 'Residencial Los Pinos', 'Av. Principal 123'),
(2, 'Condominio Las Palmas', 'Calle Central 456'),
(3, 'Urbanización El Bosque', 'Av. Norte 789');

-- Unidades
INSERT INTO units (id, name, association_id) VALUES
(1, 'Apartamento 101', 1),
(2, 'Apartamento 102', 1),
(3, 'Casa 201', 2),
(4, 'Casa 202', 2),
(5, 'Villa 301', 3);

-- Usuarios
INSERT INTO users (id, names, last_names, email, password) VALUES
(1, 'Juan', 'Pérez', 'juan.perez@example.com', '$2a$10$XQpz9EsnpBeJVJ9LhdZhee4AQzRo1zDU8uLO/B2j3NAhwNT.ByBn2'),
(2, 'María', 'González', 'maria.gonzalez@example.com', '$2a$10$XQpz9EsnpBeJVJ9LhdZhee4AQzRo1zDU8uLO/B2j3NAhwNT.ByBn2'),
(3, 'Carlos', 'Rodríguez', 'carlos.rodriguez@example.com', '$2a$10$XQpz9EsnpBeJVJ9LhdZhee4AQzRo1zDU8uLO/B2j3NAhwNT.ByBn2'),
(4, 'Ana', 'Martínez', 'ana.martinez@example.com', '$2a$10$XQpz9EsnpBeJVJ9LhdZhee4AQzRo1zDU8uLO/B2j3NAhwNT.ByBn2');

-- Relaciones usuario-unidad
INSERT INTO user_units (user_id, unit_id, role) VALUES
(1, 1, 'owner'),
(2, 2, 'owner'),
(2, 3, 'resident'),
(3, 4, 'owner'),
(4, 5, 'owner');

-- Relaciones usuario-asociación
INSERT INTO user_associations (user_id, association_id) VALUES
(1, 1),
(2, 1),
(2, 2),
(3, 2),
(4, 3);

-- Secuencias reiniciadas para evitar conflictos
SELECT setval('associations_id_seq', (SELECT MAX(id) FROM associations));
SELECT setval('units_id_seq', (SELECT MAX(id) FROM units));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('user_units_id_seq', (SELECT MAX(id) FROM user_units));
SELECT setval('user_associations_id_seq', (SELECT MAX(id) FROM user_associations));