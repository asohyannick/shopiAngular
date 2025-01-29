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
 *     summary: A user should be able to create a wishlist in our database if authenticated
 *     responses:
 *       201:
 *         description: A user should be able to create a wishlist in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.post('/create-wishlist', 
    verifyGeneralApplicationAuthenticationToken,
    createWishList
);

/**
 * @swagger
 * /api/v1/wishlist/fetch-wishlists:
 *   get:
 *     summary: A user should be able to fetch all wishlists in our database if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to fetch all wishlists in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/fetch-wishlists', 
    verifyGeneralApplicationAuthenticationToken,
    fetchUserWishLists
);

/**
 * @swagger
 * /api/v1/wishlist/fetch-wishlist/{wishlistId}:
 *   get:
 *     summary: A user should be able to fetch a wishlist in our database if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to fetch a wishlist in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/fetch-wishlist/:wishlistId', 
    verifyGeneralApplicationAuthenticationToken,
    fetchUserWishList
);

/**
 * @swagger
 * /api/v1/wishlist/update-wishlist/{wishlistId}:
 *   put:
 *     summary: A user should be able to update a wishlist in our database if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to update a wishlist in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.put('/update-wishlist/:wishlistId', 
    verifyGeneralApplicationAuthenticationToken,
    updateWishList
);

/**
 * @swagger
 * /api/v1/wishlist/delete-wishlist/{wishlistId}:
 *   delete:
 *     summary: A user should be able to delete a wishlist in our database if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to delete a wishlist in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.delete('/delete-wishlist/:wishlistId',
    verifyGeneralApplicationAuthenticationToken,
    deleteWishList
);

/**
 * @swagger
 * /api/v1/wishlist/share-wishlist:
 *   post:
 *     summary: A user should be able to share a wishlist in our database if authenticated
 *     responses:
 *       201:
 *         description: A user should be able to share a wishlist in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.post('/share-wishlist',
    verifyGeneralApplicationAuthenticationToken,
    shareWishlist
);

/**
 * @swagger
 * /api/v1/wishlist/search-wishlist:
 *   get:
 *     summary: A user should be able to search for a wishlist in our database if authenticated
 *     responses:
 *       200:
 *         description: A user should be able to search for a wishlist in our database if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/search-wishlist',
    verifyGeneralApplicationAuthenticationToken,
    searchWishlists
);

export default router;
