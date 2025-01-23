import express from 'express';
import { verifyAdminExist, verifyGeneralApplicationAuthenticationToken } from '../../middleware/auth/auth';
import { createProduct, fetchAllProducts, fetchProduct, updateProduct, deleteProduct } from 
"../../controllers/product/productController";
const router = express.Router();

router.post('/create-product',
    verifyGeneralApplicationAuthenticationToken,
    verifyAdminExist,
    createProduct
);


router.get('/fetch-all-products', 
    verifyGeneralApplicationAuthenticationToken, 
    verifyAdminExist,
    fetchAllProducts
);


router.get('/fetch-product/:id', 
    verifyGeneralApplicationAuthenticationToken,
    verifyAdminExist,  
    fetchProduct
)


router.put('/update-product/:id', 
    verifyGeneralApplicationAuthenticationToken,
    verifyAdminExist,  
    updateProduct
);


router.delete('/delete-product/:id', 
    verifyGeneralApplicationAuthenticationToken,
    verifyAdminExist,  
    deleteProduct
);


export default router;
