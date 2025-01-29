import express from 'express';
import { 
    registerAccount, 
    loginAccount, 
    fetchAllAccounts,
    fetchAnAccount, 
    updateAccount, 
    deleteAccount, 
    userLogout,
    signUpAdmin,
    signInAdmin,
    adminLogout,
    requestPasswordReset, 
    setNewAccountPassword,
    adminUpdateAccount,
    googleAuth
} from '../../controllers/auth/authController';
import { 
    gitHubRedirect, 
    githubAuthentication
} from '../../controllers/auth/githubAuth/githubAuth';
import { faceBookRedirect, faceBookAuthentication } from '../../controllers/auth/facebookAuth/facebookAuth';
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';
import { 
    verifyGeneralApplicationAuthenticationToken,
    verifyThirdPartyAuthToken
} from '../../middleware/auth/auth';

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post(
    "/register",
    schemaValidator("/auth/register"),
    registerAccount
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login an authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User has logged in successfully
 *       400:
 *         description: Bad request
 */
router.post(
    "/login", 
    schemaValidator("/auth/login"),
    verifyGeneralApplicationAuthenticationToken,
    loginAccount
);

/**
 * @swagger
 * /api/v1/auth/users:
 *   get:
 *     summary: Fetch all users
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.get(
    "/users",
    verifyGeneralApplicationAuthenticationToken,
    fetchAllAccounts
);

/**
 * @swagger
 * /api/v1/auth/single-account/{id}:
 *   get:
 *     summary: Fetch a single user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetched a single user
 *       400:
 *         description: Bad request
 */
router.get(
    "/single-account/:id",
    verifyGeneralApplicationAuthenticationToken,
    fetchAnAccount
);

/**
 * @swagger
 * /api/v1/auth/update-account/{id}:
 *   put:
 *     summary: Update a single user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated a single user in the database
 *       400:
 *         description: Bad request
 */
router.put(
    "/update-account/:id",
    verifyGeneralApplicationAuthenticationToken,
    updateAccount
);

/**
 * @swagger
 * /api/v1/auth/delete-account/{id}:
 *   delete:
 *     summary: Delete a single user in our database
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted a single user in the database
 *       400:
 *         description: Bad request
 */
router.delete(
    "/delete-account/:id",
    verifyGeneralApplicationAuthenticationToken,
    deleteAccount
);

/**
 * @swagger
 * /api/v1/auth/password-reset:
 *   post:
 *     summary: API endpoint to handle password reset request
 *     responses:
 *       201:
 *         description: Password reset request handled successfully
 *       400:
 *         description: Bad request
 */
router.post(
    "/password-reset", 
    verifyGeneralApplicationAuthenticationToken,
    requestPasswordReset
);

/**
 * @swagger
 * /api/v1/auth/set-new-password/{token}:
 *   post:
 *     summary: API endpoint to set a new password
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Token for password reset
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: New password set successfully
 *       400:
 *         description: Bad request
 */
router.post("/set-new-password/:token",
    verifyGeneralApplicationAuthenticationToken,
    setNewAccountPassword
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User request to logout from their account
 *     responses:
 *       201:
 *         description: User logged out successfully
 *       400:
 *         description: Bad request
 */
router.post(
    "/logout", 
    verifyGeneralApplicationAuthenticationToken,
    userLogout
);

// Admin routes
/**
 * @swagger
 * /api/v1/auth/admin/signup:
 *   post:
 *     summary: Admin request to signup for an account
 *     responses:
 *       201:
 *         description: Admin signed up successfully
 *       400:
 *         description: Bad request
 */
router.post(
    "/admin/signup",
    schemaValidator("/auth/admin/signup"),
    signUpAdmin
);

/**
 * @swagger
 * /api/v1/auth/admin/signin:
 *   post:
 *     summary: Admin request to signin
 *     responses:
 *       201:
 *         description: Admin signed in successfully
 *       400:
 *         description: Bad request
 */
router.post(
    "/admin/signin",
    schemaValidator("/auth/admin/signin"),
    signInAdmin
);

/**
 * @swagger
 * /api/v1/auth/admin/logout:
 *   post:
 *     summary: Admin request to logout
 *     responses:
 *       201:
 *         description: Admin logged out successfully
 *       400:
 *         description: Bad request
 */
router.post(
    "/admin/logout",
    adminLogout 
);

/**
 * @swagger
 * /api/v1/auth/admin/update-account:
 *   put:
 *     summary: Admin request to update their account
 *     responses:
 *       201:
 *         description: Admin account updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/admin/update-account',
    adminUpdateAccount // Test this API endpoint before marking it as DONE.
);

// Third-party Auth routes
// Google auth with Firebase APIs
/**
 * @swagger
 * /api/v1/auth/google/auth:
 *   post:
 *     summary: User request to login using their Google account
 *     responses:
 *       201:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 */
router.post('/google/auth',
    googleAuth
);

// GitHub authentication route
/**
 * @swagger
 * /api/v1/auth/redirect/github:
 *   get:
 *     summary: User request to be authenticated using their GitHub account
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       400:
 *         description: Bad request
 */
router.get('/redirect/github',
    gitHubRedirect
);

/**
 * @swagger
 * /api/v1/auth/github/auth/callback:
 *   get:
 *     summary: User request to be redirected after GitHub authentication
 *     responses:
 *       200:
 *         description: User redirected successfully
 *       400:
 *         description: Bad request
 */
router.get('/github/auth/callback',
    verifyThirdPartyAuthToken,
    githubAuthentication
);

// Facebook authentication route
/**
 * @swagger
 * /api/v1/auth/redirect/facebook:
 *   get:
 *     summary: User request to be authenticated using their Facebook account
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       400:
 *         description: Bad request
 */
router.get('/redirect/facebook',
    faceBookRedirect
);

/**
 * @swagger
 * /api/v1/auth/facebook/auth/callback:
 *   get:
 *     summary: User request to be redirected back after Facebook authentication
 *     responses:
 *       200:
 *         description: User redirected successfully
 *       400:
 *         description: Bad request
 */
router.get('/facebook/auth/callback',
    verifyThirdPartyAuthToken,
    faceBookAuthentication
);

export default router;
