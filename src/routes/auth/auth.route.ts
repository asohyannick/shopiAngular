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
    googleAuth,
    refreshAccessToken,
    adminRefreshToken
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
import { redirectClient, AuthenticateInstagramUser } from '../../controllers/auth/instagramAuth/instagramAuth';
import { twitterAuth, twitterAuthentication } from '../../controllers/auth/twitterAuth/twitterAuth';
import { linkedinAuth, linkedinCallback } from '../../controllers/auth/linkedInAuth/linkedInAuth';
const router = express.Router();
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: 
 *       - Authentication API endpoints  
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
 *         description: User registered successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       500:
 *         description: Internal server error. Unable to register user.
 */
router.post(
    "/register",
    schemaValidator("/auth/register"),
    registerAccount
);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token using a refresh token
 *     tags: 
 *       - Authentication API endpoints  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to obtain a new access token.
 *     responses:
 *       200:
 *         description: New access token retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       403:
 *         description: Forbidden - Invalid refresh token or token does not match
 *       500:
 *         description: Internal server error
 */
router.post(
    '/refresh-token', 
    refreshAccessToken
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login an authenticated user
 *     tags: 
 *       - Authentication API endpoints  
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
 *       200:
 *         description: User logged in successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. Invalid email or password.
 *       500:
 *         description: Internal server error. Unable to log in.
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
 *     tags: 
 *       - Authentication API endpoints  
 *     responses:
 *       200:
 *         description: Users fetched successfully.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch users.
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
 *     summary: Fetch a single user by ID
 *     tags:
 *       - Authentication API endpoints  
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fetched successfully.
 *       404:
 *         description: User not found. Please check the ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch user.
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
 *     summary: Update a single user by ID
 *     tags:
 *       - Authentication API endpoints  
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       404:
 *         description: User not found. Please check the ID.
 *       500:
 *         description: Internal server error. Unable to update user.
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
 *     summary: Delete a single user by ID
 *     tags:
 *       - Authentication API endpoints 
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found. Please check the ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to delete user.
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
 *     summary: Request a password reset
 *     tags:
 *       - Authentication API endpoints
 *     responses:
 *       200:
 *         description: Password reset request handled successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       500:
 *         description: Internal server error. Unable to process request.
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
 *     summary: Set a new password using a reset token
 *     tags:
 *       - Authentication API endpoints 
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Token for password reset
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: New password set successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       404:
 *         description: Invalid or expired token.
 *       500:
 *         description: Internal server error. Unable to set new password.
 */
router.post("/set-new-password/:token",
    verifyGeneralApplicationAuthenticationToken,
    setNewAccountPassword
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout the authenticated user
 *     tags:
 *       - Authentication API endpoints 
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to log out.
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
 *     summary: Admin signup for an account
 *     tags:
 *       - Authentication API endpoints 
 *     responses:
 *       201:
 *         description: Admin signed up successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       500:
 *         description: Internal server error. Unable to sign up.
 */
router.post(
    "/admin/signup",
    schemaValidator("/auth/admin/signup"),
    signUpAdmin
);

/**
 * @swagger
 * /api/v1/auth/admin/refresh-token:
 *   post:
 *     summary: Refresh Admin Access Token
 *     description: This endpoint allows an admin to refresh their access token using a
 *     tags: 
 *       - Authentication API endpoints  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token provided by the admin for token renewal.
 *     responses:
 *       200:
 *         description: Access token successfully refreshed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Newly generated access token.
 *                 refreshToken:
 *                   type: string
 *                   description: Newly generated refresh token.
 *       400:
 *         description: Bad request, invalid refresh token or missing parameters.
 *       401:
 *         description: Unauthorized, invalid or expired tokens.
 *       500:
 *         description: Internal server error, something went wrong.
 */
router.post(
    '/admin/refresh-token', 
    adminRefreshToken
);

/**
 * @swagger
 * /api/v1/auth/admin/signin:
 *   post:
 *     summary: Admin login
 *     tags:
 *       - Authentication API endpoints 
 *     responses:
 *       200:
 *         description: Admin signed in successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. Invalid email or password.
 *       500:
 *         description: Internal server error. Unable to sign in.
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
 *     summary: Admin logout
 *     tags:
 *       - Authentication API endpoints  
 *     responses:
 *       200:
 *         description: Admin logged out successfully.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to log out.
 */
router.post(
    "/admin/logout",
    adminLogout 
);

/**
 * @swagger
 * /api/v1/auth/admin/update-account:
 *   put:
 *     summary: Admin update their account
 *     tags:
 *       - Authentication API endpoints  
 *     responses:
 *       200:
 *         description: Admin account updated successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       404:
 *         description: Admin not found. Please check the ID.
 *       500:
 *         description: Internal server error. Unable to update account.
 */
router.put('/admin/update-account/:id',
    adminUpdateAccount // Test this API endpoint before marking it as DONE.
);

// Third-party Auth routes
// Google auth with Firebase APIs
/**
 * @swagger
 * /api/v1/auth/google/auth:
 *   post:
 *     summary: Login using Google account
 *     tags:
 *       - Authentication API endpoints 
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       500:
 *         description: Internal server error. Unable to log in.
 */
router.post('/google/auth',
    googleAuth
);

// GitHub authentication route
/**
 * @swagger
 * /api/v1/auth/redirect/github:
 *   get:
 *     summary: Authenticate using GitHub account
 *     tags:
 *       - Authentication API endpoints  
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       500:
 *         description: Internal server error. Unable to authenticate.
 */
router.get('/redirect/github',
    gitHubRedirect
);

/**
 * @swagger
 * /api/v1/auth/github/auth/callback:
 *   get:
 *     summary: Redirect after GitHub authentication
 *     tags:
 *       - Authentication API endpoints 
 *     responses:
 *       200:
 *         description: User redirected successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       500:
 *         description: Internal server error. Unable to redirect.
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
 *     summary: Authenticate using Facebook account
 *     tags:
 *       - Authentication API endpoints  
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       500:
 *         description: Internal server error. Unable to authenticate.
 */
router.get('/redirect/facebook',
    faceBookRedirect
);

/**
 * @swagger
 * /api/v1/auth/facebook/auth/callback:
 *   get:
 *     summary: Redirect after Facebook authentication
 *     tags:
 *       - Authentication API endpoints 
 *     responses:
 *       200:
 *         description: User redirected successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       500:
 *         description: Internal server error. Unable to redirect.
 */
router.get('/facebook/auth/callback',
    verifyThirdPartyAuthToken,
    faceBookAuthentication
);

/**
 * @swagger
 * /api/v1/auth/auth/instagram:
 *   get:
 *     summary: Redirect to Instagram for authentication
 *     description: Redirects the user to the Instagram login page for authentication.
 *     tags:
 *       - Authentication API endpoints  
 *     responses:
 *       302:
 *         description: Redirects to Instagram login
 *       403:
 *         description: Unauthorized access
 */
router.get('/auth/instagram',
    verifyThirdPartyAuthToken,
    (req, res) => {
        // Your redirect logic here
        redirectClient(req, res);
    }
);

/**
 * @swagger
 * /api/v1/auth/instagram/auth/callback:
 *   get:
 *     summary: Handle Instagram authentication callback
 *     description: Exchange the authorization code for an access token and authenticate the user.
 *     tags:
 *       - Authentication API endpoints 
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         description: The authorization code received from Instagram.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Authentication successful
 *             token:
 *               type: string
 *               example: jwt.token.here
 *       400:
 *         description: Invalid Credentials
 *       500:
 *         description: Authentication failed
 */
router.get('/instagram/auth/callback',
    verifyThirdPartyAuthToken,
    AuthenticateInstagramUser
);


/**
 * @swagger
 * /api/v1/auth/twitter/auth/register:
 *   get:
 *     summary: Initiate Twitter authentication
 *     tags: 
 *       - Authentication API endpoints 
 *     description: Redirects the user to Twitter for authentication.
 *     responses:
 *       302:
 *         description: Redirected to Twitter for authentication.
 *       500:
 *         description: Internal server error.
 */
router.get('/twitter/auth/register',
    verifyThirdPartyAuthToken,
    twitterAuth
);

/**
 * @swagger
 * /api/v1/auth/twitter/auth/callback:
 *   get:
 *     summary: Handle Twitter authentication callback
 *     tags: 
 *       - Authentication API endpoints  
 *     description: Handles the callback from Twitter after the user has authenticated.
 *     responses:
 *       200:
 *         description: Authentication successful, returns JWT.
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *       500:
 *         description: Internal server error.
 */
router.get('/twitter/auth/callback',
    verifyThirdPartyAuthToken,
    twitterAuthentication
);


/**
 * @swagger
 * /api/v1/auth/linkedin/auth:
 *   get:
 *     summary: Initiate LinkedIn authentication
 *     tags: 
 *       - Authentication API endpoints 
 *     description: Redirects the user to LinkedIn for authentication.
 *     responses:
 *       302:
 *         description: Redirected to LinkedIn for authentication.
 *       500:
 *         description: Internal server error due to missing environment variables.
 */
router.get('/linkedin/auth',
    verifyThirdPartyAuthToken,
    linkedinAuth
);

/**
 * @swagger
 * /api/v1/auth/linkedin/auth/callback:
 *   get:
 *     summary: Handle LinkedIn authentication callback
 *     tags: 
 *       - Authentication API endpoints
 *     description: Handles the callback from LinkedIn after the user has authenticated.
 *     responses:
 *       200:
 *         description: Authentication successful, returns JWT.
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *       500:
 *         description: Internal server error during authentication process.
 */
router.get('/linkedin/auth/callback',
    verifyThirdPartyAuthToken,
    linkedinCallback
);

export default router;
