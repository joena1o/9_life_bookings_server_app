import { Router } from "express";
import authenticateToken from "../middleware/authenticate_token";
import * as BankController from '../controllers/banking.controller';

const router = Router();

router.post("/", authenticateToken, BankController.addBankDetails);
router.get("/", authenticateToken, BankController.getBankDetails);
router.patch("/", authenticateToken, BankController.updateAccountDetails);
router.post("/initiate-payment", authenticateToken, BankController.initiatePayment);
router.get("/get-banks", authenticateToken, BankController.getBankList);

export default router;