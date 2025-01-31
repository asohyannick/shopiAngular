import express, { Request, Response, NextFunction } from 'express';
import { 
    verifyAdminExist, 
    verifySuperAdminToken,
    verifyGeneralApplicationAuthenticationToken,
} from '../../middleware/auth/auth';
import { 
    createProduct, 
    uploadImages,
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
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';
const router = express.Router();

/**
 * @swagger
 * /api/v1/product/create-product:
 *   post:
 *     summary: Create a new product (Admin only)
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to create product.
 */
router.post('/create-product',
    verifySuperAdminToken,
    verifyAdminExist,
    schemaValidator('/product/create-product'),
    uploadImages,
    createProduct
);

/**
 * @swagger
 * /api/v1/product/fetch-all-products:
 *   get:
 *     summary: Fetch all products (Admin only)
 *     responses:
 *       200:
 *         description: Products fetched successfully.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch products.
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
 *     summary: Fetch a single product by ID (Admin only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to fetch.
 *     responses:
 *       200:
 *         description: Product fetched successfully.
 *       404:
 *         description: Product not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch product.
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
 *     summary: Update an existing product (Admin only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to update.
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       404:
 *         description: Product not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to update product.
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
 *     summary: Delete a product (Admin only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to delete.
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found. Please check the ID.
 *       401:
 *         description: Unauthorized. Admin must be authenticated.
 *       500:
 *         description: Internal server error. Unable to delete product.
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
 *     summary: Search, filter, and paginate products (Admin and users)
 *     responses:
 *       200:
 *         description: Products fetched successfully based on search criteria.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to perform search.
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
 *     summary: Create a review for a product (Admin and users)
 *     responses:
 *       201:
 *         description: Review created successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to create review.
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
 *     summary: Fetch reviews for a product (Admin and users)
 *     responses:
 *       200:
 *         description: Reviews fetched successfully.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch reviews.
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
 *     summary: Fetch a specific review for a product (Admin and users)
 *     responses:
 *       200:
 *         description: Review fetched successfully.
 *       404:
 *         description: Review not found. Please check the IDs.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch review.
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
 *     summary: Update a review for a product (Admin and users)
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       404:
 *         description: Review not found. Please check the IDs.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to update review.
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
 *     summary: Delete a review for a product (Admin and users)
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *       404:
 *         description: Review not found. Please check the IDs.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to delete review.
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
export default router;
