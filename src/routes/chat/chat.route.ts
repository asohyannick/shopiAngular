import express, {Request, Response, NextFunction} from 'express';
import { 
    verifyGeneralApplicationAuthenticationToken,
    verifySuperAdminToken
} from '../../middleware/auth/auth';
import { 
    createChat,
    fetchChats,
    fetchChat,
    updateChat,
    removeChat,
    replyToMessage,
    likeMessage,
    unLikeMessage
 } from '../../controllers/chat/chatController';
const router = express.Router();
/**
 * @swagger
 * /api/v1/chat/create-chat:
 *   post:
 *     summary: Create a new chat (Admin and users must be authenticated)
 *     responses:
 *       201:
 *         description: Chat created successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to create chat.
 */
router.post('/create-chat',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    createChat
);

/**
 * @swagger
 * /api/v1/chat/fetch-chats:
 *   get:
 *     summary: Fetch all chats (Admin and users must be authenticated)
 *     responses:
 *       200:
 *         description: Chats fetched successfully.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch chats.
 */
router.get('/fetch-chats',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    fetchChats
);

/**
 * @swagger
 * /api/v1/chat/fetch-chat:
 *   get:
 *     summary: Fetch a specific chat (Admin and users must be authenticated)
 *     responses:
 *       200:
 *         description: Chat fetched successfully.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch chat.
 */
router.get('/fetch-chat',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    fetchChat
);

/**
 * @swagger
 * /api/v1/chat/update-chat:
 *   put:
 *     summary: Update a chat (Admin and users must be authenticated)
 *     responses:
 *       200:
 *         description: Chat updated successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to update chat.
 */
router.put('/update-chat',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    updateChat
);

/**
 * @swagger
 * /api/v1/chat/remove-chat:
 *   delete:
 *     summary: Delete a chat (Admin and users must be authenticated)
 *     responses:
 *       200:
 *         description: Chat deleted successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to delete chat.
 */
router.delete('/remove-chat',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    removeChat
);

/**
 * @swagger
 * /api/v1/chat/message/reply:
 *   post:
 *     summary: Reply to a message (Admin and users must be authenticated)
 *     responses:
 *       201:
 *         description: Message replied successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to reply to message.
 */
router.post('/message/reply',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    replyToMessage
);

/**
 * @swagger
 * /api/v1/chat/message/like:
 *   post:
 *     summary: Like a message (Admin and users must be authenticated)
 *     responses:
 *       201:
 *         description: Message liked successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to like message.
 */
router.post('/message/like',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    likeMessage
);

/**
 * @swagger
 * /api/v1/chat/message/unlike:
 *   post:
 *     summary: Unlike a message (Admin and users must be authenticated)
 *     responses:
 *       200:
 *         description: Message unliked successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to unlike message.
 */
router.post('/message/unlike',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    unLikeMessage
);
export default router;
