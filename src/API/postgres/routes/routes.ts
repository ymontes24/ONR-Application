import { Router } from 'express';
import userController from '../controllers/user.controller';
import associationController from '../controllers/association.controller';
import unitController from '../controllers/unit.controller';
import { authMiddleware } from '../../common/middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users Postgres API
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
 *         id:
 *           type: integer
 *           description: The user ID
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
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 *       example:
 *         names: John
 *         lastNames: Doe
 *         email: john.doe@example.com
 * 
 *     CreateUser:
 *       type: object
 *       required:
 *         - names
 *         - lastNames
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID
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
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 *       example:
 *         names: John
 *         lastNames: Doe
 *         email: john.doe@example.com
 *         password: password123
 *
 *     UnitAssignment:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 *           enum: [owner, resident]
 *           description: The role of the user in relation to the unit
 *
 * paths:
 *   /api/pg/users:
 *     get:
 *       tags:
 *         - Users Postgres API
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
 *         - Users Postgres API
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
 *   /api/pg/users/{id}:
 *     get:
 *       tags:
 *         - Users Postgres API
 *       summary: Get user by ID
 *       description: Retrieve a user by their ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: User ID
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
 *         - Users Postgres API
 *       summary: Update user
 *       description: Update an existing user by their ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: User ID
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
 *         - Users Postgres API
 *       summary: Delete user
 *       description: Delete a user by their ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: User ID
 *       responses:
 *         200:
 *           description: User deleted successfully
 *         404:
 *           description: User not found
 *         500:
 *           description: Server error
 *
 *   /api/pg/users/association/{associationId}:
 *     get:
 *       tags:
 *         - Users Postgres API
 *       summary: Get users by association
 *       description: Retrieve users belonging to a specific association
 *       parameters:
 *         - in: path
 *           name: associationId
 *           required: true
 *           schema:
 *             type: integer
 *           description: Association ID
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
 *   /api/pg/users/email/{email}:
 *     get:
 *       tags:
 *         - Users Postgres API
 *       summary: Get user by email
 *       description: Retrieve a user by their email address
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
 *   /api/pg/users/units/{userId}/{unitId}:
 *     post:
 *       tags:
 *         - Users Postgres API
 *       summary: Assign unit to user
 *       description: Assign a unit to a user with a specific role
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: integer
 *           description: User ID
 *         - in: path
 *           name: unitId
 *           required: true
 *           schema:
 *             type: integer
 *           description: Unit ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitAssignment'
 *       responses:
 *         200:
 *           description: Unit assigned successfully
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 *     
 *     delete:
 *       tags:
 *         - Users Postgres API
 *       summary: Remove unit from user
 *       description: Remove a unit assignment from a user
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: integer
 *           description: User ID
 *         - in: path
 *           name: unitId
 *           required: true
 *           schema:
 *             type: integer
 *           description: Unit ID
 *       responses:
 *         200:
 *           description: Unit removed successfully
 *         400:
 *           description: Bad request
 *         500:
 *           description: Server error
 */
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', authMiddleware, userController.updateUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);
router.get('/users/association/:associationId', userController.getUsersByAssociation);
router.get('/users/email/:email', userController.getUserByEmail);
router.post('/users/units/:userId/:unitId', authMiddleware, userController.assignUnitToUser);
router.delete('/users/units/:userId/:unitId', authMiddleware, userController.removeUnitFromUser);

/**
 * @swagger
 * tags:
 *   - name: Association Postgres API
 *     description: Association management endpoints
 * 
 * components:
 *   schemas:
 *     Association:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The association ID
 *         name:
 *           type: string
 *           description: Association's name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the association was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the association was last updated
 *       example:
 *         name: Mountain View Condominiums
 * 
 *     CreateAssociation:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Association's name
 *         address:
 *           type: string
 *           description: Association's address
 *       example:
 *         name: Mountain View Condominiums
 *         address: 1234 Elm St.
 *
 * paths:
 *   /api/pg/associations:
 *     get:
 *       tags:
 *         - Association Postgres API
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
 *         - Association Postgres API
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
 *   /api/pg/associations/{id}:
 *     get:
 *       tags:
 *         - Association Postgres API
 *       summary: Get association by ID
 *       description: Retrieve an association by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: Association ID
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
 *         - Association Postgres API
 *       summary: Update association
 *       description: Update an existing association by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: Association ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateAssociation'
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
 *         - Association Postgres API
 *       summary: Delete association
 *       description: Delete an association by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: Association ID
 *       responses:
 *         200:
 *           description: Association deleted successfully
 *         404:
 *           description: Association not found
 *         500:
 *           description: Server error
 *
 *   /api/pg/associations/{associationId}/users:
 *     get:
 *       tags:
 *         - Association Postgres API
 *       summary: Get users from association
 *       description: Retrieve users belonging to a specific association
 *       parameters:
 *         - in: path
 *           name: associationId
 *           required: true
 *           schema:
 *             type: integer
 *           description: Association ID
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
 *   /api/pg/associations/{associationId}/units:
 *     get:
 *       tags:
 *         - Association Postgres API
 *       summary: Get units from association
 *       description: Retrieve units belonging to a specific association
 *       parameters:
 *         - in: path
 *           name: associationId
 *           required: true
 *           schema:
 *             type: integer
 *           description: Association ID
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
router.get('/associations', associationController.getAllAssociations);
router.get('/associations/:id', associationController.getAssociationById);
router.post('/associations', authMiddleware, associationController.createAssociation);
router.put('/associations/:id', authMiddleware, associationController.updateAssociation);
router.delete('/associations/:id', authMiddleware, associationController.deleteAssociation);
router.get('/associations/:associationId/users', associationController.getUsersFromAssociation);
router.get('/associations/:associationId/units', associationController.getUnitsFromAssociation);

/**
 * @swagger
 * tags:
 *   - name: Unit Postgres API
 *     description: Unit management endpoints
 * 
 * components:
 *   schemas:
 *     Unit:
 *       type: object
 *       required:
 *         - name
 *         - association_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The unit ID
 *         name:
 *           type: string
 *           description: Unit's name or identifier
 *         association_id:
 *           type: integer
 *           description: ID of the association this unit belongs to
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the unit was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the unit was last updated
 *       example:
 *         name: "Apartment 101"
 *         association_id: 1
 * 
 *     CreateUnit:
 *       type: object
 *       required:
 *         - name
 *         - association_id
 *       properties:
 *         name:
 *           type: string
 *           description: Unit's name or identifier
 *         association_id:
 *           type: integer
 *           description: ID of the association this unit belongs to
 *       example:
 *         name: "Apartment 101"
 *         association_id: 1
 *
 * paths:
 *   /api/pg/units:
 *     get:
 *       tags:
 *         - Unit Postgres API
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
 *         - Unit Postgres API
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
 *   /api/pg/units/{id}:
 *     get:
 *       tags:
 *         - Unit Postgres API
 *       summary: Get unit by ID
 *       description: Retrieve a unit by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: Unit ID
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
 *         - Unit Postgres API
 *       summary: Update unit
 *       description: Update an existing unit by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: Unit ID
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
 *         - Unit Postgres API
 *       summary: Delete unit
 *       description: Delete a unit by its ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: Unit ID
 *       responses:
 *         200:
 *           description: Unit deleted successfully
 *         404:
 *           description: Unit not found
 *         500:
 *           description: Server error
 *
 *   /api/pg/units/association/{associationId}:
 *     get:
 *       tags:
 *         - Unit Postgres API
 *       summary: Get units by association
 *       description: Retrieve units belonging to a specific association
 *       parameters:
 *         - in: path
 *           name: associationId
 *           required: true
 *           schema:
 *             type: integer
 *           description: Association ID
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
 *   /api/pg/units/{unitId}/users:
 *     get:
 *       tags:
 *         - Unit Postgres API
 *       summary: Get users from unit
 *       description: Retrieve users assigned to a specific unit
 *       parameters:
 *         - in: path
 *           name: unitId
 *           required: true
 *           schema:
 *             type: integer
 *           description: Unit ID
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
router.post('/units', authMiddleware, unitController.createUnit);
router.put('/units/:id', authMiddleware, unitController.updateUnit);
router.delete('/units/:id', authMiddleware, unitController.deleteUnit);
router.get('/units/association/:associationId', unitController.getUnitsByAssociation);
router.get('/units/:unitId/users', unitController.getUsersFromUnit);

export default router;