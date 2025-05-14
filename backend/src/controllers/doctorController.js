// Array de métodos ( C R U D)
const doctorController = {};
import doctorModel from "../models/Doctor.js";

// SELECT O GET
doctorController.getDoctors = async (req, res) => {
  const doctors = await doctorModel.find();
  res.json(doctors);
};

//INSERT / POST
doctorController.createDoctor = async (req, res) => {
  const { name, specialty, email, password } = req.body;
  const newDoctor = new doctorModel({ name, specialty, email, password });
  await newDoctor.save();
  res.json({ message: "Doctor guardadisimo" });
};

// DELETE 
doctorController.deleteDoctor = async (req, res) => {
    const deletedoctor = await doctorModel.findByIdAndDelete(req.params.id);
    if (!deletedoctor) {
        return res.status(404).json({ message: "Doctor dont find" });
    }
    res.json({ message: "Doctor deleted" });
  };

// PUT update doctor
doctorController.updateDoctor = async (req, res) => {
    //solicito todos los valores
  const { name, specialty, email, password } = req.body;
  //Actualizo
  await doctorModel.findByIdAndUpdate(
    req.params.id, 
    { 
      name,
      specialty,
      email,
      password 
    }, 
    { new: true }
);
// muestro un mensaje que todo se actualizó
  res.json({ message: "Doctor updated" });
};

export default doctorController;