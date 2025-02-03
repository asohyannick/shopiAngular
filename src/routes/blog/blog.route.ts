import express, { Request, Response, NextFunction} from 'express';
import { 
    verifyAdminExist, 
    verifyGeneralApplicationAuthenticationToken, 
    verifySuperAdminToken 
} from '../../middleware/auth/auth';
import { 
    createBlog, 
    uploadImages, 
    fetchBlogs, 
    fetchBlog, 
    updateBlog, 
    removeBlog,
    subscribe,
    createComment,
    fetchComments,
    fetchComment,
    updateComment,
    removeComment
 } from '../../controllers/blog/blogController';
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';

const router = express.Router();

/**
 * @swagger
 * /api/v1/my-blog/create-post:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My First Blog Post"
 *               content:
 *                 type: string
 *                 example: "This is the content of my first blog post."
 *               author:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["blog", "first post"]
 *               imageURLs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["http://example.com/image1.jpg"]
 *               excerpt:
 *                 type: string
 *                 example: "A brief overview of my first post."
 *               published:
 *                 type: string
 *                 enum: [true, false]
 *                 example: "true"
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/create-post',
    schemaValidator('/my-blog/create-post'),
    verifySuperAdminToken,
    verifyAdminExist,
    uploadImages,
    createBlog
);

/**
 * @swagger
 * /api/v1/my-blog/subscribe:
 *   post:
 *     summary: Subscribe a user to the newsletter
 *     tags: [Newsletter]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       201:
 *         description: Subscription successful
 *       400:
 *         description: Invalid email or already subscribed
 *       500:
 *         description: Internal server error
 */
router.post('/subscribe',
    verifyGeneralApplicationAuthenticationToken,
    subscribe
);


/**
 * @swagger
 * /api/v1/my-blog/fetch-blogs:
 *   get:
 *     summary: Retrieve all blog posts
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   author:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/fetch-blogs',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchBlogs
);

/**
 * @swagger
 * /api/v1/my-blog/fetch-blog/{id}:
 *   get:
 *     summary: Retrieve a single blog post by ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the blog post to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post retrieved successfully
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
router.get('/fetch-blog/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchBlog
);

/**
 * @swagger
 * /api/v1/my-blog/update-blog/{id}:
 *   put:
 *     summary: Update a blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the blog post to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Blog Post Title"
 *               content:
 *                 type: string
 *                 example: "Updated content of the blog post."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
router.put('/update-blog/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    updateBlog
);

/**
 * @swagger
 * /api/v1/my-blog/remove-blog/{id}:
 *   delete:
 *     summary: Remove a blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the blog post to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post removed successfully
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
router.delete('/remove-blog/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    removeBlog
);

/**
 * @swagger
 * /api/v1/my-blog/create-comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *               content:
 *                 type: string
 *                 example: "This is a comment on the blog post."
 *     responses:
 *       201:
 *         description: Comment has been created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/create-comment',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    verifyAdminExist,
    createComment
);

/**
 * @swagger
 * /api/v1/my-blog/fetch-comments:
 *   get:
 *     summary: Fetch all comments
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all comments
 *       500:
 *         description: Internal server error
 */
router.get('/fetch-comments',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    verifyAdminExist,
    fetchComments
);

/**
 * @swagger
 * /api/v1/my-blog/fetch-comment/{id}:
 *   get:
 *     summary: Fetch a single comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched the comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.get('/fetch-comment/:id',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    verifyAdminExist,
    fetchComment
);

/**
 * @swagger
 * /api/v1/my-blog/update-comment/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is the updated comment."
 *     responses:
 *       200:
 *         description: Comment has been updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.put('/update-comment/:id',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    verifyAdminExist,
    updateComment
);

/**
 * @swagger
 * /api/v1/my-blog/remove-comment/{id}:
 *   delete:
 *     summary: Remove a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment has been removed successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/remove-comment/:id',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    },
    verifyAdminExist,
    removeComment
);
export default router;
