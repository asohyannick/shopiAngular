import express from "express";
import { verifySuperAdminToken, verifyAdminExist } from "../../middleware/auth/auth";
import { 
    createCustomer,
    customerLogin,
    fetchCustomers, 
    fetchCustomer, 
    updateCustomer, 
    deleteCustomer
} from "../../controllers/customer/customerController";

const router = express.Router();

/**
 * @swagger
 * /api/v1/customer/create-customer:
 *   post:
 *     summary: An admin should be able to create a customer account for his or her customer from our API if authenticated
 *     responses:
 *       201:
 *         description: An admin should be able to create a customer account from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.post('/create-customer',
    verifySuperAdminToken,
    verifyAdminExist,
    createCustomer
);

/**
 * @swagger
 * /api/v1/customer/customer-login:
 *   post:
 *     summary: An admin should be able to login a customer into his or her account from our API if authenticated
 *     responses:
 *       201:
 *         description: An admin should be able to login a customer into his or her account from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.post('/customer-login',
    verifySuperAdminToken,
    verifyAdminExist,
    customerLogin
);

/**
 * @swagger
 * /api/v1/customer/fetch-customers:
 *   get:
 *     summary: An admin should be able to fetch all customers from our API if authenticated
 *     responses:
 *       200:
 *         description: An admin should be able to fetch all customers from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/fetch-customers',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchCustomers
);

/**
 * @swagger
 * /api/v1/customer/fetch-customer/{id}:
 *   get:
 *     summary: An admin should be able to fetch a customer from our API if authenticated
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the customer to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An admin should be able to fetch a customer from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.get('/fetch-customer/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    fetchCustomer
);

/**
 * @swagger
 * /api/v1/customer/update-customer/{id}:
 *   put:
 *     summary: An admin should be able to update a customer from our API if authenticated
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the customer to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An admin should be able to update a customer from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.put('/update-customer/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    updateCustomer
);

/**
 * @swagger
 * /api/v1/customer/remove-customer/{id}:
 *   delete:
 *     summary: An admin should be able to delete a customer from our API if authenticated
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the customer to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An admin should be able to delete a customer from our API if authenticated
 *       400:
 *         description: Bad request
 */
router.delete('/remove-customer/:id',
    verifySuperAdminToken,
    verifyAdminExist,
    deleteCustomer
);

export default router;
