import express from "express";
import addPatientRouter from "./routes/addPatient";
import getPatientsRouter from "./routes/getPatients";

const app = express();
app.use(express.json());

// Use your routes
app.use("/addPatient", addPatientRouter);
app.use("/patients", getPatientsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
