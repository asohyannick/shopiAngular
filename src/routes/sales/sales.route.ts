import express from 'express';
import { 
    createSale,
    fetchSales,
    fetchSale,
    updateSale,
    deleteSale,
    totalSales,
    salesByProduct,
    filterSales,
    averageSales,
    topSellingProduct,
} from '../../controllers/sales/salesController';

import { 
    verifySuperAdminToken,
        verifyAdminExist
} from '../../middleware/auth/auth';
const router = express.Router();

router.post('/create-sale',
    verifySuperAdminToken,
    verifyAdminExist,
    createSale
);

router.get('/reports/fetch-sales',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchSales
);

router.get('/report/fetch-sale/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchSale
);

router.put('/reports/update-sale/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    updateSale,
);
router.delete('/reports/sales/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    deleteSale
)

router.get('/reports/total-sales/pdf', 
    verifySuperAdminToken,
    verifyAdminExist,
    totalSales,
);

router.get('/reports/sales-by-product/pdf',
    verifySuperAdminToken,
    verifyAdminExist,
    salesByProduct
);
router.get('/reports/sales/pdf',
    verifySuperAdminToken,
    verifyAdminExist,
    filterSales
);
router.get('/reports/average-sales/pdf',
    verifySuperAdminToken,
    verifyAdminExist,
    averageSales
);
router.get('/reports/top-selling-product/pdf',
    verifySuperAdminToken,
    verifyAdminExist,
    topSellingProduct
);
export default router;
