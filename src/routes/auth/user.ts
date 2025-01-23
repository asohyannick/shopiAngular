import express from 'express';
import { 
    registerAccount, 
    loginAccount, 
    fetchAllAccounts,
    fetchAnAccount, 
    updateAccount, 
    logOutUserFromHisOrHerAccount,
    deleteAccount, 
    requestPasswordReset, 
    setNewAccountPassword,
} from '../../controllers/auth/user';
import schemaValidator from '../../middleware/schemaValidator/schemaValidator';
const router = express.Router();
router.post("/register", schemaValidator("/auth/register"), registerAccount);
router.post("/login", schemaValidator("/auth/login"), loginAccount);
router.get("/users", fetchAllAccounts);
router.get("/single-account/:id", fetchAnAccount);
router.put("/update-account/:id", updateAccount);
router.delete("/delete-account/:id", deleteAccount);
router.post("/password-reset", requestPasswordReset);
router.post("/set-new-password/:token", setNewAccountPassword);
router.post("/logout", logOutUserFromHisOrHerAccount)
export default router;
