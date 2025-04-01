import { Router } from 'express';
import combinedController from '../controller/common.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Combined Database API
 *     description: Endpoints that interact with both MongoDB and PostgreSQL databases
 * 
 * components:
 *   schemas:
 *     CombinedUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID (MongoDB ObjectId or PostgreSQL ID)
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
 *         source:
 *           type: string
 *           enum: [mongodb, postgresql]
 *           description: Source database where the user data comes from
 *         units:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Unit ID
 *               name:
 *                 type: string
 *                 description: Unit name (only present in PostgreSQL data)
 *               role:
 *                 type: string
 *                 description: User's role in the unit
 *
 *     DualSourceUser:
 *       type: object
 *       properties:
 *         mongodb:
 *           $ref: '#/components/schemas/CombinedUser'
 *         postgresql:
 *           $ref: '#/components/schemas/CombinedUser'
 *
 *     BookingRequest:
 *       type: object
 *       required:
 *         - date
 *         - timeStart
 *         - timeEnd
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
 *
 * paths:
 *   /api/combined/users:
 *     get:
 *       tags:
 *         - Combined Database API
 *       summary: Get all users from both databases
 *       description: Retrieves a combined list of users from both MongoDB and PostgreSQL databases with their associated units
 *       responses:
 *         200:
 *           description: Successful operation
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *
 *   /api/combined/users/id/{id}:
 *     get:
 *       tags:
 *         - Combined Database API
 *       summary: Get user by ID from either database
 *       description: Retrieves a user by ID from either MongoDB or PostgreSQL database with their associated units
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID (either MongoDB ObjectId or PostgreSQL numeric ID)
 *       responses:
 *         200:
 *           description: Successful operation
 *         404:
 *           description: User not found
 *         500:
 *           description: Server error
 *
 *   /api/combined/users/email/{email}:
 *     get:
 *       tags:
 *         - Combined Database API
 *       summary: Get user by email from both databases
 *       description: Retrieves a user by email from both MongoDB and PostgreSQL databases with their associated units
 *       parameters:
 *         - in: path
 *           name: email
 *           required: true
 *           schema:
 *             type: string
 *             format: email
 *           description: User email
 *       responses:
 *         200:
 *           description: Successful operation
 *         404:
 *           description: User not found
 *         500:
 *           description: Server error
 *
 *   /api/combined/booking/{pgUserId}/{amenityId}:
 *     post:
 *       tags:
 *         - Combined Database API
 *       summary: Book an amenity for a PostgreSQL user
 *       description: Creates a booking in MongoDB for a user that exists in PostgreSQL
 *       parameters:
 *         - in: path
 *           name: pgUserId
 *           required: true
 *           schema:
 *             type: integer
 *           description: User ID from PostgreSQL database
 *         - in: path
 *           name: amenityId
 *           required: true
 *           schema:
 *             type: string
 *           description: Amenity ID from MongoDB (ObjectId)
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingRequest'
 *       responses:
 *         201:
 *           description: Booking created successfully
 *         400:
 *           description: Bad request or validation error
 *         500:
 *           description: Server error
 */
router.get('/users', combinedController.getUsersWithUnits);
router.get('/users/id/:id', combinedController.getUserWithUnitsById);
router.get('/users/email/:email', combinedController.getUserWithUnitsByEmail);
router.post('/booking/:pgUserId/:amenityId', combinedController.bookAmenityForPostgresUser);

export default router;