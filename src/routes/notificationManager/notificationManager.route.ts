import express, {Request, Response, NextFunction } from 'express';
import { 
    verifyGeneralApplicationAuthenticationToken, 
    verifySuperAdminToken
} from '../../middleware/auth/auth';
import { 
    notifyAllUsers,
    registerNotificationFCMToken
} from '../../controllers/notificationManager/notificationController';
const router = express.Router();
/**
 * @swagger
 * /api/v1/notify/notify-users:
 *   post:
 *     summary: Send email notifications to all users (Admin and authenticated users)
 *     responses:
 *       201:
 *         description: Email notifications sent successfully to all users.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to send notifications.
 */
router.post('/notify-users',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    }, 
    notifyAllUsers,
);
/**
 * @swagger
 * /api/v1/notify/register-token:
 *   post:
 *     summary: Register the FCM token for notifications (Admin and authenticated users)
 *     responses:
 *       201:
 *         description: FCM token registered successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to register token.
 */
router.post('/register-token',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    }, 
    registerNotificationFCMToken,
);
export default router;
