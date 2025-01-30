import express, { Request, Response, NextFunction } from 'express';
import { 
    verifyAdminExist, 
    verifySuperAdminToken,
    verifyGeneralApplicationAuthenticationToken,
} from '../../middleware/auth/auth';
import { 
    createProduct, 
    fetchAllProducts, 
    fetchProduct, 
    updateProduct, 
    deleteProduct, 
    searchProducts,
    createReview, 
    fetchAllReviews,
    fetchReview,
    updateReview,
    deleteReview,
} from "../../controllers/product/productController";
import { notifyAllUsers } from '../../controllers/emailNotifications/sentEmailController';

const router = express.Router();

/**
 * @swagger
 * /api/v1/product/create-product:
 *   post:
 *     summary: Admin should be able to create a product if he is authenticated
 *     responses:
 *       201:
 *         description: Admin should be able to create a product if he is authenticated
 *       400:
 *         description: Bad request
 */
router.post('/create-product',
    verifySuperAdminToken,
    verifyAdminExist,
    createProduct
);

/**
 * @swagger
 * /api/v1/product/fetch-all-products:
 *   get:
 *     summary: Admin should be able to fetch all products if he is authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to fetch all products if he is authenticated
 *       400:
 *         description: Bad request
 */
router.get('/fetch-all-products', 
    verifySuperAdminToken,
    verifyAdminExist,
    fetchAllProducts
);

/**
 * @swagger
 * /api/v1/product/fetch-product/{id}:
 *   get:
 *     summary: Admin should be able to fetch a product if he is authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to fetch a product if he is authenticated
 *       400:
 *         description: Bad request
 */
router.get('/fetch-product/:id', 
    verifySuperAdminToken,
    verifyAdminExist,
    fetchProduct
);

/**
 * @swagger
 * /api/v1/product/update-product/{id}:
 *   put:
 *     summary: Admin should be able to update a product if he is authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to update a product if he is authenticated
 *       400:
 *         description: Bad request
 */
router.put('/update-product/:id', 
    verifySuperAdminToken,
    verifyAdminExist,
    updateProduct
);

/**
 * @swagger
 * /api/v1/product/delete-product/{id}:
 *   delete:
 *     summary: Admin should be able to delete a product if he is authenticated
 *     responses:
 *       200:
 *         description: Admin should be able to delete a product if he is authenticated
 *       400:
 *         description: Bad request
 */
router.delete('/delete-product/:id', 
    verifySuperAdminToken,
    verifyAdminExist,
    deleteProduct
);

/**
 * @swagger
 * /api/v1/product/search-products:
 *   get:
 *     summary: Admin and normal users should be able to search, filter, and paginate across all products if authenticated
 *     responses:
 *       200:
 *         description: Admin and normal users should be able to search, filter, and paginate across all products if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/search-products',
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    }, 
    verifyAdminExist,
    searchProducts
);

/**
 * @swagger
 * /api/v1/product/{productId}/create-reviews:
 *   post:
 *     summary: Both admin and normal users should be able to create reviews if they are authenticated
 *     responses:
 *       201:
 *         description: Both admin and normal users should be able to create reviews if they are authenticated
 *       400:
 *         description: Bad request
 */
router.post("/:productId/create-reviews", 
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    }, 
    createReview
);

/**
 * @swagger
 * /api/v1/product/{productId}/fetch-reviews:
 *   get:
 *     summary: Both admin and normal users should be able to fetch product reviews if they are authenticated
 *     responses:
 *       200:
 *         description: Both admin and normal users should be able to fetch product reviews if they are authenticated
 *       400:
 *         description: Bad request
 */
router.get("/:productId/fetch-reviews", 
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    }, 
    fetchAllReviews
);

/**
 * @swagger
 * /api/v1/product/{productId}/fetch-review/{reviewId}:
 *   get:
 *     summary: Both admin and normal users should be able to fetch a product review if they are authenticated
 *     responses:
 *       200:
 *         description: Both admin and normal users should be able to fetch a product review if they are authenticated
 *       400:
 *         description: Bad request
 */
router.get("/:productId/fetch-review/:reviewId", 
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    }, 
    fetchReview
);

/**
 * @swagger
 * /api/v1/product/{productId}/update-review/{reviewId}:
 *   put:
 *     summary: Both admin and normal users should be able to update a product review if they are authenticated
 *     responses:
 *       200:
 *         description: Both admin and normal users should be able to update a product review if they are authenticated
 *       400:
 *         description: Bad request
 */
router.put("/:productId/update-review/:reviewId", 
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    }, 
    updateReview
);

/**
 * @swagger
 * /api/v1/product/{productId}/delete-review/{reviewId}:
 *   delete:
 *     summary: Both admin and normal users should be able to delete a product review if they are authenticated
 *     responses:
 *       200:
 *         description: Both admin and normal users should be able to delete a product review if they are authenticated
 *       400:
 *         description: Bad request
 */
router.delete("/:productId/delete-review/:reviewId", 
    verifyGeneralApplicationAuthenticationToken,
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return verifySuperAdminToken(req, res, next);
    }, 
    deleteReview
);

/**
 * @swagger
 * /api/v1/product/notify:
 *   post:
 *     summary: Both admin and normal users should be able to sent email notification to all user if they are authenticated
 *     responses:
 *       201:
 *         description: Both admin and normal users email notification to all users if they are authenticated
 *       400:
 *         description: Bad request
 */

router.post('/notify',
  verifyGeneralApplicationAuthenticationToken,
 (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return verifySuperAdminToken(req, res, next);
 }, 
 notifyAllUsers,
)

export default router;
