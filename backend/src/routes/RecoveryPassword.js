import express from "express";
import RecoveryPasswordController from "../controllers/recoveryPasswordController.js";

const router = express.Router();

router.route("/requestCode").post(RecoveryPasswordController.requestCode);
router.route("/verifyCode").post(RecoveryPasswordController.verifyCode);
router.route("/newPassword").post(RecoveryPasswordController.verifyCode);


export default router;