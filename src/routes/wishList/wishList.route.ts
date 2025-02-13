import express from 'express';
import { 
    createWishList, 
    fetchUserWishLists, 
    fetchUserWishList, 
    updateWishList, 
    deleteWishList,
    shareWishlist,
    searchWishlists
} from '../../controllers/wishList/wishListController';
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';

const router = express.Router();
/**
 * @swagger
 * /api/v1/wishlist/create-wishlist:
 *   post:
 *     summary: Create a new wishlist (User must be authenticated)
 *     responses:
 *       201:
 *         description: Wishlist created successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to create wishlist.
 */
router.post('/create-wishlist', 
    verifyGeneralApplicationAuthenticationToken,
    createWishList
);

/**
 * @swagger
 * /api/v1/wishlist/fetch-wishlists:
 *   get:
 *     summary: Fetch all wishlists for the authenticated user
 *     responses:
 *       200:
 *         description: Wishlists fetched successfully.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch wishlists.
 */
router.get('/fetch-wishlists', 
    verifyGeneralApplicationAuthenticationToken,
    fetchUserWishLists
);

/**
 * @swagger
 * /api/v1/wishlist/fetch-wishlist/{wishlistId}:
 *   get:
 *     summary: Fetch a specific wishlist by ID (User must be authenticated)
 *     parameters:
 *       - name: wishlistId
 *         in: path
 *         required: true
 *         description: ID of the wishlist to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist fetched successfully.
 *       404:
 *         description: Wishlist not found. Please check the ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to fetch wishlist.
 */
router.get('/fetch-wishlist/:wishlistId', 
    verifyGeneralApplicationAuthenticationToken,
    fetchUserWishList
);

/**
 * @swagger
 * /api/v1/wishlist/update-wishlist/{id}:
 *   put:
 *     summary: Update a specific wishlist by ID (User must be authenticated)
 *     parameters:
 *       - name: wishlistId
 *         in: path
 *         required: true
 *         description: ID of the wishlist to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist updated successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       404:
 *         description: Wishlist not found. Please check the ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to update wishlist.
 */
router.put('/update-wishlist/:id', 
    verifyGeneralApplicationAuthenticationToken,
    updateWishList
);

/**
 * @swagger
 * /api/v1/wishlist/delete-wishlist/{id}:
 *   delete:
 *     summary: Delete a specific wishlist by ID (User must be authenticated)
 *     parameters:
 *       - name: wishlistId
 *         in: path
 *         required: true
 *         description: ID of the wishlist to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist deleted successfully.
 *       404:
 *         description: Wishlist not found. Please check the ID.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to delete wishlist.
 */
router.delete('/delete-wishlist/:id',
    verifyGeneralApplicationAuthenticationToken,
    deleteWishList
);

/**
 * @swagger
 * /api/v1/wishlist/share-wishlist/{id}:
 *   post:
 *     summary: Share a wishlist (User must be authenticated)
 *     responses:
 *       201:
 *         description: Wishlist shared successfully.
 *       400:
 *         description: Bad request. Please check the input data.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to share wishlist.
 */
router.post('/share-wishlist/:id',
    verifyGeneralApplicationAuthenticationToken,
    shareWishlist
);

/**
 * @swagger
 * /api/v1/wishlist/search-wishlist:
 *   get:
 *     summary: Search for wishlists (User must be authenticated)
 *     responses:
 *       200:
 *         description: Wishlists searched successfully.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error. Unable to search wishlists.
 */
router.get('/search-wishlist',
    verifyGeneralApplicationAuthenticationToken,
    searchWishlists
);
export default router;
