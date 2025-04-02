db = db.getSiblingDB('residential_communities');

// Crear colecciones
db.createCollection('users');
db.createCollection('associations');
db.createCollection('units');
db.createCollection('amenities');
db.createCollection('bookings');

// Insertar asociaciones de ejemplo
const associations = [
  {
    _id: ObjectId("60d21b4667d0d8992e610c31"),
    name: "Residencial Los Pinos",
    address: "Av. Principal 123"
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c32"),
    name: "Condominio Las Palmas",
    address: "Calle Central 456"
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c33"),
    name: "Urbanización El Bosque",
    address: "Av. Norte 789"
  }
];

db.associations.insertMany(associations);

// Insertar unidades de ejemplo
const units = [
  {
    _id: ObjectId("60d21b4667d0d8992e610c41"),
    name: "Apartamento 101",
    associationId: ObjectId("60d21b4667d0d8992e610c31")
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c42"),
    name: "Apartamento 102",
    associationId: ObjectId("60d21b4667d0d8992e610c31")
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c43"),
    name: "Casa 201",
    associationId: ObjectId("60d21b4667d0d8992e610c32")
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c44"),
    name: "Casa 202",
    associationId: ObjectId("60d21b4667d0d8992e610c32")
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c45"),
    name: "Villa 301",
    associationId: ObjectId("60d21b4667d0d8992e610c33")
  }
];

db.units.insertMany(units);

// Insertar usuarios de ejemplo
const users = [
  {
    _id: ObjectId("60d21b4667d0d8992e610c51"),
    names: "Juan",
    lastNames: "Pérez",
    email: "juan.perez@example.com",
    password: "$2a$10$XQpz9EsnpBeJVJ9LhdZhee4AQzRo1zDU8uLO/B2j3NAhwNT.ByBn2", // password123
    associations: [ObjectId("60d21b4667d0d8992e610c31")],
    units: [
      {
        unitId: ObjectId("60d21b4667d0d8992e610c41"),
        role: "owner"
      }
    ]
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c52"),
    names: "María",
    lastNames: "González",
    email: "maria.gonzalez@example.com",
    password: "$2a$10$XQpz9EsnpBeJVJ9LhdZhee4AQzRo1zDU8uLO/B2j3NAhwNT.ByBn2", // password123
    associations: [ObjectId("60d21b4667d0d8992e610c31"), ObjectId("60d21b4667d0d8992e610c32")],
    units: [
      {
        unitId: ObjectId("60d21b4667d0d8992e610c42"),
        role: "owner"
      },
      {
        unitId: ObjectId("60d21b4667d0d8992e610c43"),
        role: "resident"
      }
    ]
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c53"),
    names: "Carlos",
    lastNames: "Rodríguez",
    email: "carlos.rodriguez@example.com",
    password: "$2a$10$XQpz9EsnpBeJVJ9LhdZhee4AQzRo1zDU8uLO/B2j3NAhwNT.ByBn2", // password123
    associations: [ObjectId("60d21b4667d0d8992e610c32")],
    units: [
      {
        unitId: ObjectId("60d21b4667d0d8992e610c44"),
        role: "owner"
      }
    ]
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c54"),
    names: "Ana",
    lastNames: "Martínez",
    email: "ana.martinez@example.com",
    password: "$2a$10$XQpz9EsnpBeJVJ9LhdZhee4AQzRo1zDU8uLO/B2j3NAhwNT.ByBn2", // password123
    associations: [ObjectId("60d21b4667d0d8992e610c33")],
    units: [
      {
        unitId: ObjectId("60d21b4667d0d8992e610c45"),
        role: "owner"
      }
    ]
  }
];

db.users.insertMany(users);

// Insertar amenities de ejemplo
const amenities = [
  {
    _id: ObjectId("60d21b4667d0d8992e610c61"),
    name: "Salón de eventos",
    description: "Salón para eventos sociales y reuniones",
    bookable: true,
    openingTime: "09:00",
    closingTime: "22:00",
    associationId: ObjectId("60d21b4667d0d8992e610c31")
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c62"),
    name: "Gimnasio",
    description: "Área con equipos de ejercicio",
    bookable: true,
    openingTime: "06:00",
    closingTime: "23:00",
    associationId: ObjectId("60d21b4667d0d8992e610c31")
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c63"),
    name: "Piscina",
    description: "Piscina para adultos y niños",
    bookable: true,
    openingTime: "08:00",
    closingTime: "20:00",
    associationId: ObjectId("60d21b4667d0d8992e610c32")
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c64"),
    name: "Cancha de tenis",
    description: "Cancha de tenis profesional",
    bookable: true,
    openingTime: "07:00",
    closingTime: "21:00",
    associationId: ObjectId("60d21b4667d0d8992e610c32")
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c65"),
    name: "Área de BBQ",
    description: "Zona de parrillas y mesas",
    bookable: true,
    openingTime: "10:00",
    closingTime: "22:00",
    associationId: ObjectId("60d21b4667d0d8992e610c33")
  }
];

db.amenities.insertMany(amenities);

// Insertar bookings de ejemplo
const bookings = [
  {
    _id: ObjectId("60d21b4667d0d8992e610c71"),
    date: new Date("2025-04-15"),
    timeStart: "16:00",
    timeEnd: "20:00",
    userId: ObjectId("60d21b4667d0d8992e610c51"),
    amenityId: ObjectId("60d21b4667d0d8992e610c61"),
    groupingId: ObjectId("60d21b4667d0d8992e610c31") // La asociación
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c72"),
    date: new Date("2025-04-16"),
    timeStart: "07:00",
    timeEnd: "09:00",
    userId: ObjectId("60d21b4667d0d8992e610c52"),
    amenityId: ObjectId("60d21b4667d0d8992e610c62"),
    groupingId: ObjectId("60d21b4667d0d8992e610c31") // La asociación
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c73"),
    date: new Date("2025-04-17"),
    timeStart: "15:00",
    timeEnd: "17:00",
    userId: ObjectId("60d21b4667d0d8992e610c53"),
    amenityId: ObjectId("60d21b4667d0d8992e610c64"),
    groupingId: ObjectId("60d21b4667d0d8992e610c32") // La asociación
  },
  {
    _id: ObjectId("60d21b4667d0d8992e610c74"),
    date: new Date("2025-04-18"),
    timeStart: "17:00",
    timeEnd: "19:00",
    userId: ObjectId("60d21b4667d0d8992e610c54"),
    amenityId: ObjectId("60d21b4667d0d8992e610c65"),
    groupingId: ObjectId("60d21b4667d0d8992e610c33") // La asociación
  }
];

db.bookings.insertMany(bookings);

// Crear índices
db.users.createIndex({ email: 1 }, { unique: true });
db.units.createIndex({ associationId: 1 });
db.amenities.createIndex({ associationId: 1 });
db.bookings.createIndex({ userId: 1 });
db.bookings.createIndex({ amenityId: 1 });
db.bookings.createIndex({ date: 1, amenityId: 1 });