import express from 'express';
import { 
    createProfile, 
    fetchProfiles, 
    fetchProfile, 
    updateProfile, 
    removeProfile
} from '../../controllers/aboutMe/aboutMeController';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AboutMe
 *   description: Endpoints for managing user profiles.
 */

/**
 * @swagger
 * /api/v1/contact/create-profile:
 *   post:
 *     summary: Create a new user profile
 *     tags: [AboutMe]
 *     description: Creates a new profile for the user using the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               title:
 *                 type: string
 *                 example: "Software Engineer"
 *               summary:
 *                 type: string
 *                 example: "Passionate software engineer with 5 years of experience..."
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: ["JavaScript", "Node.js", "React"]
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     company:
 *                       type: string
 *                       example: "TechCorp"
 *                     position:
 *                       type: string
 *                       example: "Senior Developer"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2020-01-01"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                     description:
 *                       type: string
 *                       example: "Developed and maintained web applications."
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     institution:
 *                       type: string
 *                       example: "University of Technology"
 *                     degree:
 *                       type: string
 *                       example: "Bachelor of Science"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2016-09-01"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: "2020-06-01"
 *               projects:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Personal Website"
 *                     description:
 *                       type: string
 *                       example: "A portfolio website to showcase projects."
 *                     link:
 *                       type: string
 *                       format: uri
 *                       example: "https://johndoe.com"
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   phone:
 *                     type: string
 *                     nullable: true
 *                     example: "+1234567890"
 *                   linkedin:
 *                     type: string
 *                     nullable: true
 *                     example: "https://linkedin.com/in/johndoe"
 *     responses:
 *       201:
 *         description: Profile created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile has been created successfully."
 *                 newProfile:
 *                   type: object
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */
router.post('/create-profile',
    schemaValidator('/contact/create-profile'),
    verifyGeneralApplicationAuthenticationToken,
    createProfile
);

/**
 * @swagger
 * /api/v1/contact/fetch-profiles:
 *   get:
 *     summary: Fetch all user profiles
 *     tags: [AboutMe]
 *     description: Retrieves a list of all user profiles.
 *     responses:
 *       200:
 *         description: A list of user profiles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
router.get('/fetch-profiles',
    verifyGeneralApplicationAuthenticationToken,
    fetchProfiles,
);

/**
 * @swagger
 * /api/v1/contact/fetch-profile/{id}:
 *   get:
 *     summary: Fetch a user profile by ID
 *     tags: [AboutMe]
 *     description: Retrieves a specific user profile using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user profile to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user profile.
 *       404:
 *         description: Profile not found.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
router.get('/fetch-profile/:id',
    verifyGeneralApplicationAuthenticationToken,
    fetchProfile,
);

/**
 * @swagger
 * /api/v1/contact/update-profile/{id}:
 *   put:
 *     summary: Update a user profile by ID
 *     tags: [AboutMe]
 *     description: Updates a specific user profile using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user profile to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *               projects:
 *                 type: array
 *                 items:
 *                   type: object
 *               contactInfo:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Profile not found.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
router.put('/update-profile/:id',
    verifyGeneralApplicationAuthenticationToken,
    updateProfile,
);

/**
 * @swagger
 * /api/v1/contact/remove-profile/{id}:
 *   delete:
 *     summary: Remove a user profile by ID
 *     tags: [AboutMe]
 *     description: Deletes a specific user profile using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user profile to remove.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Profile deleted successfully.
 *       404:
 *         description: Profile not found.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
router.delete('/remove-profile/:id',
    verifyGeneralApplicationAuthenticationToken,
    removeProfile
);

export default router;
