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
const router = express.Router();
import { verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
router.post('/create-wishlist', 
    verifyGeneralApplicationAuthenticationToken,
    createWishList
);
router.get('/fetch-wishlists', 
   verifyGeneralApplicationAuthenticationToken,
   fetchUserWishLists
);

router.get('/fetch-wishlist/:wishlistId', 
    verifyGeneralApplicationAuthenticationToken,
    fetchUserWishList
);

router.put('/update-wishlist/:wishlistId', 
    verifyGeneralApplicationAuthenticationToken,
    updateWishList
);

router.delete('/delete-wishlist/:wishlistId',
    verifyGeneralApplicationAuthenticationToken,
    deleteWishList
);

router.post('/share-wishlist',
    verifyGeneralApplicationAuthenticationToken,
    shareWishlist
);

router.get('/search-wishlist',
   verifyGeneralApplicationAuthenticationToken,
   searchWishlists
)

export default router;
