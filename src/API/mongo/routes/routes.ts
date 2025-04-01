import { Router } from 'express';
import userController from '../controllers/user.controller';
import associationController from '../controllers/association.controller';
import unitController from '../controllers/unit.controller';
import amenityController from '../controllers/amenity.controller';
import bookingController from '../controllers/booking.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users MongoDB API
 *     description: User management endpoints
 * 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - names
 *         - lastNames
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: The user ID (MongoDB ObjectId)
 *         names:
 *           type: string
 *           description: User's first names
 *         lastNames:
 *           type: string
 *           description: User's last names
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (not returned in responses)
 *         associations:
 *           type: array
 *           items:
 *             type: string
 *             description: Association IDs (MongoDB ObjectIds)
 *         units:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               unitId:
 *                 type: string
 *                 description: Unit ID (MongoDB ObjectId)
 *               role:
 *                 type: string
 *                 enum: [owner, resident]
 *                 description: The role of the user in relation to the unit
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 *
 *     CreateUser:
 *       type: object
 *       required:
 *         - names
 *         - lastNames
 *         - email
 *         - password
 *       properties:
 *         names:
 *           type: string
 *           description: User's first names
 *         lastNames:
 *           type: string
 *           description: User's last names
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         associations:
 *           type: array
 *           items:
 *             type: string
 *             description: Association IDs (MongoDB ObjectIds)
 *         units:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               unitId:
 *                 type: string
 *                 description: Unit ID (MongoDB ObjectId)
 *               role:
 *                 type: string
 *                 enum: [owner, resident]
 *                 description: The role of the user in relation to the unit
 *
 * paths:
 *   /api/mongo/users:
 *     get:
 *       tags:
 *         - Users MongoDB API
 *       summary: Get all users
 *       description: Retrieve a paginated list of all users
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Number of records per page
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *     
 *     post:
 *       tags:
 *         - Users MongoDB API
 *       summary: Create a new user
 *       description: Create a new user with the provided data
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUser'
 *       responses:
 *         201:
 *           description: User created successfully
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *
 *   /api/mongo/users/{id}:
 *     get:
 *       tags:
 *         - Users MongoDB API
 *       summary: Get user by ID
 *       description: Retrieve a user by their ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID (MongoDB ObjectId)
 *       responses:
 *         200:
 *           description: Successful operation
 *         404:
 *           description: User not found
 *         500:
 *           description: Server error
 *     
 *     put:
 *       tags:
 *         - Users MongoDB API
 *       summary: Update user
 *       description: Update an existing user by their ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID (MongoDB ObjectId)
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       responses:
 *         200:
 *           description: User updated successfully
 *         400:
 *           description: Bad request
 *         404:
 *           description: User not found
 *         500:
 *           description: Server error
 *     
 *     delete:
 *       tags:
 *         - Users MongoDB API
 *       summary: Delete user
 *       description: Delete a user by their ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID (MongoDB ObjectId)
 *       responses:
 *         200:
 *           description: User deleted successfully
 *         404:
 *           description: User not found
 *         500:
 *           description: Server error
 *
 *   /api/mongo/users/association/{associationId}:
 *     get:
 *       tags:
 *         - Users MongoDB API
 *       summary: Get users by association
 *       description: Retrieve users belonging to a specific association
 *       parameters:
 *         - in: path
 *           name: associationId
 *           required: true
 *           schema:
 *             type: string
 *           description: Association ID (MongoDB ObjectId)
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Number of records per page
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *   /api/mongo/users/unit/{unitId}:
 *     get:
 *       tags:
 *         - Users MongoDB API
 *       summary: Get users by unit
 *       description: Retrieve users belonging to a specific unit
 *       parameters:
 *         - in: path
 *           name: unitId
 *           required: true
 *           schema:
 *             type: string
 *           description: unit ID (MongoDB ObjectId)
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Number of records per page
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 */
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.get('/users/association/:associationId', userController.getUsersByAssociation);
router.get('/users/unit/:unitId', userController.getUsersByUnit);

/**
 * @swagger
 * tags:
 *   - name: Associations MongoDB API
 *     description: Association management endpoints
 * 
 * components:
 *   schemas:
 *     Association:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The association ID (MongoDB ObjectId)
 *         name:
 *           type: string
 *           description: Association name
 *         address:
 *           type: string
 *           description: Association address
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the association was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the association was last updated
 *
 *     CreateAssociation:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Association name
 *         address:
 *           type: string
 *           description: Association address
 *
 * paths:
 *   /api/mongo/associations:
 *     get:
 *       tags:
 *         - Associations MongoDB API
 *       summary: Get all associations
 *       description: Retrieve a paginated list of all associations
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Number of records per page
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *     
 *     post:
 *       tags:
 *         - Associations MongoDB API
 *       summary: Create a new association
 *       description: Create a new association with the provided data
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateAssociation'
 *       responses:
 *         201:
 *           description: Association created successfully
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *
 *   /api/mongo/associations/{id}:
 *     get:
 *       tags:
 *         - Associations MongoDB API
 *       summary: Get association by ID
 *       description: Retrieve an association by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Association ID (MongoDB ObjectId)
 *       responses:
 *         200:
 *           description: Successful operation
 *         404:
 *           description: Association not found
 *         500:
 *           description: Server error
 *     
 *     put:
 *       tags:
 *         - Associations MongoDB API
 *       summary: Update association
 *       description: Update an existing association by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Association ID (MongoDB ObjectId)
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Association'
 *       responses:
 *         200:
 *           description: Association updated successfully
 *         400:
 *           description: Bad request
 *         404:
 *           description: Association not found
 *         500:
 *           description: Server error
 *     
 *     delete:
 *       tags:
 *         - Associations MongoDB API
 *       summary: Delete association
 *       description: Delete an association by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Association ID (MongoDB ObjectId)
 *       responses:
 *         200:
 *           description: Association deleted successfully
 *         404:
 *           description: Association not found
 *         500:
 *           description: Server error
 */
router.get('/associations', associationController.getAllAssociations);
router.get('/associations/:id', associationController.getAssociationById);
router.post('/associations', associationController.createAssociation);
router.put('/associations/:id', associationController.updateAssociation);
router.delete('/associations/:id', associationController.deleteAssociation);

/**
 * @swagger
 * tags:
 *   - name: Units MongoDB API
 *     description: Unit management endpoints
 * 
 * components:
 *   schemas:
 *     Unit:
 *       type: object
 *       required:
 *         - name
 *         - associationId
 *       properties:
 *         _id:
 *           type: string
 *           description: The unit ID (MongoDB ObjectId)
 *         name:
 *           type: string
 *           description: Unit name or identifier
 *         associationId:
 *           type: string
 *           description: ID of the association this unit belongs to (MongoDB ObjectId)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the unit was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the unit was last updated
 *
 *     CreateUnit:
 *       type: object
 *       required:
 *         - name
 *         - associationId
 *       properties:
 *         name:
 *           type: string
 *           description: Unit name or identifier
 *         associationId:
 *           type: string
 *           description: ID of the association this unit belongs to (MongoDB ObjectId)
 *
 * paths:
 *   /api/mongo/units:
 *     get:
 *       tags:
 *         - Units MongoDB API
 *       summary: Get all units
 *       description: Retrieve a paginated list of all units
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Number of records per page
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *     
 *     post:
 *       tags:
 *         - Units MongoDB API
 *       summary: Create a new unit
 *       description: Create a new unit with the provided data
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUnit'
 *       responses:
 *         201:
 *           description: Unit created successfully
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *
 *   /api/mongo/units/{id}:
 *     get:
 *       tags:
 *         - Units MongoDB API
 *       summary: Get unit by ID
 *       description: Retrieve a unit by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Unit ID (MongoDB ObjectId)
 *       responses:
 *         200:
 *           description: Successful operation
 *         404:
 *           description: Unit not found
 *         500:
 *           description: Server error
 *     
 *     put:
 *       tags:
 *         - Units MongoDB API
 *       summary: Update unit
 *       description: Update an existing unit by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Unit ID (MongoDB ObjectId)
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unit'
 *       responses:
 *         200:
 *           description: Unit updated successfully
 *         400:
 *           description: Bad request
 *         404:
 *           description: Unit not found
 *         500:
 *           description: Server error
 *     
 *     delete:
 *       tags:
 *         - Units MongoDB API
 *       summary: Delete unit
 *       description: Delete a unit by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Unit ID (MongoDB ObjectId)
 *       responses:
 *         200:
 *           description: Unit deleted successfully
 *         404:
 *           description: Unit not found
 *         500:
 *           description: Server error
 *
 *   /api/mongo/units/association/{associationId}:
 *     get:
 *       tags:
 *         - Units MongoDB API
 *       summary: Get units by association
 *       description: Retrieve units belonging to a specific association
 *       parameters:
 *         - in: path
 *           name: associationId
 *           required: true
 *           schema:
 *             type: string
 *           description: Association ID (MongoDB ObjectId)
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Number of records per page
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 */
router.get('/units', unitController.getAllUnits);
router.get('/units/:id', unitController.getUnitById);
router.post('/units', unitController.createUnit);
router.put('/units/:id', unitController.updateUnit);
router.delete('/units/:id', unitController.deleteUnit);
router.get('/units/association/:associationId', unitController.getUnitsByAssociation);

/**
 * @swagger
 * tags:
 *   - name: Amenities MongoDB API
 *     description: Amenity management endpoints
 * 
 * components:
 *   schemas:
 *     Amenity:
 *       type: object
 *       required:
 *         - name
 *         - bookable
 *         - associationId
 *       properties:
 *         _id:
 *           type: string
 *           description: The amenity ID (MongoDB ObjectId)
 *         name:
 *           type: string
 *           description: Amenity name
 *         description:
 *           type: string
 *           description: Amenity description
 *         bookable:
 *           type: boolean
 *           description: Indicates if the amenity can be booked
 *         openingTime:
 *           type: string
 *           description: Opening time of the amenity (format HH:MM)
 *         closingTime:
 *           type: string
 *           description: Closing time of the amenity (format HH:MM)
 *         associationId:
 *           type: string
 *           description: ID of the association this amenity belongs to (MongoDB ObjectId)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the amenity was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the amenity was last updated
 *
 *     CreateAmenity:
 *       type: object
 *       required:
 *         - name
 *         - bookable
 *         - associationId
 *       properties:
 *         name:
 *           type: string
 *           description: Amenity name
 *         description:
 *           type: string
 *           description: Amenity description
 *         bookable:
 *           type: boolean
 *           description: Indicates if the amenity can be booked
 *         openingTime:
 *           type: string
 *           description: Opening time of the amenity (format HH:MM)
 *         closingTime:
 *           type: string
 *           description: Closing time of the amenity (format HH:MM)
 *         associationId:
 *           type: string
 *           description: ID of the association this amenity belongs to (MongoDB ObjectId)
 *
 * paths:
 *   /api/mongo/amenities:
 *     get:
 *       tags:
 *         - Amenities MongoDB API
 *       summary: Get all amenities
 *       description: Retrieve a paginated list of all amenities
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Number of records per page
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *     
 *     post:
 *       tags:
 *         - Amenities MongoDB API
 *       summary: Create a new amenity
 *       description: Create a new amenity with the provided data
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateAmenity'
 *       responses:
 *         201:
 *           description: Amenity created successfully
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *
 *   /api/mongo/amenities/{id}:
 *     get:
 *       tags:
 *         - Amenities MongoDB API
 *       summary: Get amenity by ID
 *       description: Retrieve an amenity by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Amenity ID (MongoDB ObjectId)
 *       responses:
 *         200:
 *           description: Successful operation
 *         404:
 *           description: Amenity not found
 *         500:
 *           description: Server error
 *     
 *     put:
 *       tags:
 *         - Amenities MongoDB API
 *       summary: Update amenity
 *       description: Update an existing amenity by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Amenity ID (MongoDB ObjectId)
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateAmenity'
 *       responses:
 *         200:
 *           description: Amenity updated successfully
 *         400:
 *           description: Bad request
 *         404:
 *           description: Amenity not found
 *         500:
 *           description: Server error
 *     
 *     delete:
 *       tags:
 *         - Amenities MongoDB API
 *       summary: Delete amenity
 *       description: Delete an amenity by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Amenity ID (MongoDB ObjectId)
 *       responses:
 *         200:
 *           description: Amenity deleted successfully
 *         404:
 *           description: Amenity not found
 *         500:
 *           description: Server error
 *
 *   /api/mongo/amenities/association/{associationId}:
 *     get:
 *       tags:
 *         - Amenities MongoDB API
 *       summary: Get amenities by association
 *       description: Retrieve amenities belonging to a specific association
 *       parameters:
 *         - in: path
 *           name: associationId
 *           required: true
 *           schema:
 *             type: string
 *           description: Association ID (MongoDB ObjectId)
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Number of records per page
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 */
router.get('/amenities', amenityController.getAllAmenities);
router.get('/amenities/:id', amenityController.getAmenityById);
router.post('/amenities', amenityController.createAmenity);
router.put('/amenities/:id', amenityController.updateAmenity);
router.delete('/amenities/:id', amenityController.deleteAmenity);
router.get('/amenities/association/:associationId', amenityController.getAmenitiesByAssociation);

/**
 * @swagger
 * tags:
 *   - name: Bookings MongoDB API
 *     description: Booking management endpoints
 * 
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - date
 *         - timeStart
 *         - timeEnd
 *         - userId
 *         - amenityId
 *         - groupingId
 *       properties:
 *         _id:
 *           type: string
 *           description: The booking ID (MongoDB ObjectId)
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the booking
 *         timeStart:
 *           type: string
 *           description: Start time of the booking (format HH:MM)
 *         timeEnd:
 *           type: string
 *           description: End time of the booking (format HH:MM)
 *         userId:
 *           type: string
 *           description: ID of the user making the booking (MongoDB ObjectId)
 *         amenityId:
 *           type: string
 *           description: ID of the amenity being booked (MongoDB ObjectId)
 *         groupingId:
 *           type: string
 *           description: ID of the association (MongoDB ObjectId)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the booking was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the booking was last updated
 *
 *     CreateBooking:
 *       type: object
 *       required:
 *         - date
 *         - timeStart
 *         - timeEnd
 *         - userId
 *         - amenityId
 *         - groupingId
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the booking
 *         timeStart:
 *           type: string
 *           description: Start time of the booking (format HH:MM)
 *         timeEnd:
 *           type: string
 *           description: End time of the booking (format HH:MM)
 *         userId:
 *           type: string
 *           description: ID of the user making the booking (MongoDB ObjectId)
 *         amenityId:
 *           type: string
 *           description: ID of the amenity being booked (MongoDB ObjectId)
 *         groupingId:
 *           type: string
 *           description: ID of the association (MongoDB ObjectId)
 *
 * paths:
 *   /api/mongo/bookings:
 *     get:
 *       tags:
 *         - Bookings MongoDB API
 *       summary: Get all bookings
 *       description: Retrieve a paginated list of all bookings
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Number of records per page
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *     
 *     post:
 *       tags:
 *         - Bookings MongoDB API
 *       summary: Create a new booking
 *       description: Create a new booking with the provided data. The system validates that the amenity is bookable and that there are no time conflicts.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBooking'
 *       responses:
 *         201:
 *           description: Booking created successfully
 *         400:
 *           description: Bad request or booking conflict
 *         500:
 *           description: Server error
 *
 *   /api/mongo/bookings/{id}:
 *     get:
 *       tags:
 *         - Bookings MongoDB API
 *       summary: Get booking by ID
 *       description: Retrieve a booking by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Booking ID (MongoDB ObjectId)
 *       responses:
 *         200:
 *           description: Successful operation
 *         404:
 *           description: Booking not found
 *         500:
 *           description: Server error
 *     
 *     put:
 *       tags:
 *         - Bookings MongoDB API
 *       summary: Update booking
 *       description: Update an existing booking by its ID. The system validates that there are no time conflicts.
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Booking ID (MongoDB ObjectId)
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBooking'
 *       responses:
 *         200:
 *           description: Booking updated successfully
 *         400:
 *           description: Bad request or booking conflict
 *         404:
 *           description: Booking not found
 *         500:
 *           description: Server error
 *     
 *     delete:
 *       tags:
 *         - Bookings MongoDB API
 *       summary: Delete booking
 *       description: Delete a booking by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Booking ID (MongoDB ObjectId)
 *       responses:
 *         200:
 *           description: Booking deleted successfully
 *         404:
 *           description: Booking not found
 *         500:
 *           description: Server error
 *
 *   /api/mongo/bookings/association/{associationId}:
 *     get:
 *       tags:
 *         - Bookings MongoDB API
 *       summary: Get bookings by association
 *       description: Retrieve bookings belonging to a specific association
 *       parameters:
 *         - in: path
 *           name: associationId
 *           required: true
 *           schema:
 *             type: string
 *           description: Association ID (MongoDB ObjectId)
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Number of records per page
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *
 *   /api/mongo/bookings/user/{userId}:
 *     get:
 *       tags:
 *         - Bookings MongoDB API
 *       summary: Get bookings by user
 *       description: Retrieve bookings made by a specific user
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID (MongoDB ObjectId)
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Number of records per page
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 */
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/:id', bookingController.getBookingById);
router.post('/bookings', bookingController.createBooking);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);
router.get('/bookings/association/:associationId', bookingController.getBookingsByAssociation);
router.get('/bookings/user/:userId', bookingController.getBookingsByUser);

export default router;