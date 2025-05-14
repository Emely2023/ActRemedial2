import express from "express";
import doctorController from "../controllers/doctorController.js";


const router = express.Router();

router.route("/").post(doctorController.createDoctor)


export default router;