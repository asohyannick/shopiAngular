import express from 'express';
import { 
    verifyAdminExist, 
    verifySuperAdminToken,
} from '../../middleware/auth/auth';
import { 
    fetchAllUsers,
    fetchAUser,
    updateAUser,
    deleteAUser,
    activateUserAccount,
    searchUser,
    updateUsersInBulk,
    createUserLogActivity,
    fetchAllUserLogActivities,
    fetchAllUserLogActivity,
    updateUserLogActivity,
    deleteUserLogActivity,
    adminRequestToResetAUserPassword,
    adminResetNewUserPassword
} from "../../controllers/user/userController";

const router = express.Router();

/**
 * @swagger
 * /api/v1/user/all-users:
 *   get:
 *     summary: Admin should be able to fetch all users in our database if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to fetch all users in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/all-users',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchAllUsers
);

/**
 * @swagger
 * /api/v1/user/users/{id}:
 *   get:
 *     summary: Admin should be able to fetch a user in our database if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to fetch a user in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/users/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchAUser
);

/**
 * @swagger
 * /api/v1/user/update-users/{id}:
 *   put:
 *     summary: Admin should be able to update a user in our database if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to update a user in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.put('/update-users/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    updateAUser
);

/**
 * @swagger
 * /api/v1/user/delete-users/{id}:
 *   delete:
 *     summary: Admin should be able to delete a user in our database if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to delete a user in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.delete('/delete-users/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    deleteAUser
);

/**
 * @swagger
 * /api/v1/user/activate-account/{userId}/status:
 *   put:
 *     summary: Admin should be able to activate a user's account in our database if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to activate a user's account in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.put('/activate-account/:userId/status',
    verifySuperAdminToken,
    verifyAdminExist,
    activateUserAccount
);

/**
 * @swagger
 * /api/v1/user/search-user:
 *   get:
 *     summary: Admin should be able to search for users in our database if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to search for users in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/search-user',
    verifySuperAdminToken,
    verifyAdminExist,
    searchUser
);

/**
 * @swagger
 * /api/v1/user/create-activity/logs:
 *   post:
 *     summary: Admin should be able to monitor a user's activity in our database if authenticated
 *     responses:
 *       201:
 *         description: Admin should be able to monitor a user's activity in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.post('/create-activity/logs',
    verifySuperAdminToken,
    verifyAdminExist,
    createUserLogActivity
);

/**
 * @swagger
 * /api/v1/user/fetch-users/logs:
 *   get:
 *     summary: Admin should be able to fetch all user's monitored activities in our database if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to fetch all user's monitored activities in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/fetch-users/logs',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchAllUserLogActivities
);

/**
 * @swagger
 * /api/v1/user/fetch-users/log/{id}:
 *   get:
 *     summary: Admin should be able to fetch a single monitored user activity in our database if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to fetch a single monitored user activity in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/fetch-users/log/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchAllUserLogActivity
);

/**
 * @swagger
 * /api/v1/user/update-user/log/{id}:
 *   put:
 *     summary: Admin should be able to update a single monitored activity in our database if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to update a single monitored activity in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.put('/update-user/log/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    updateUserLogActivity
);

/**
 * @swagger
 * /api/v1/user/delete-user/log/{id}:
 *   delete:
 *     summary: Admin should be able to delete a single monitored activity in our database if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to delete a single monitored activity in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.delete('/delete-user/log/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    deleteUserLogActivity
);

/**
 * @swagger
 * /api/v1/user/bulk-update/users:
 *   put:
 *     summary: Admin should be able to update multiple users at once in our database if authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to update multiple users at once in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.put('/bulk-update/users',
    verifySuperAdminToken,
    verifyAdminExist,
    updateUsersInBulk
);

/**
 * @swagger
 * /api/v1/user/request-password-reset:
 *   post:
 *     summary: Admin should be able to request a user's reset password in our database if authenticated
 *     responses:
 *       201:
 *         description: Admin should be able to request a user's reset password in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.post('/request-password-reset',
    verifySuperAdminToken,
    verifyAdminExist,
    adminRequestToResetAUserPassword
);

/**
 * @swagger
 * /api/v1/user/reset-password:
 *   post:
 *     summary: Admin should be able to create a new password for a user in our database if authenticated
 *     responses:
 *       201:
 *         description: Admin should be able to create a new password for a user in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.post('/reset-password',
    verifySuperAdminToken,
    verifyAdminExist,
    adminResetNewUserPassword
);

export default router;
