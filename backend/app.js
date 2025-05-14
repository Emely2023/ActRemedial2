import express from "express";
import cookieParser from "cookie-parser";

import Doctor from "./src/routes/Doctor.js"
import RecoveryPassword from "./src/routes/RecoveryPassword.js"




const app = express();

app.use(cookieParser())                                                   

app.use(express.json());
app.use("/api/Doctors", Doctor);
app.use("/api/recoveryPassword", RecoveryPassword);






export default app; 