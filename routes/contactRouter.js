import express from "express";
import { createContact, deleteContact, getAllContact } from "../controllers/contactController.js";

const contactRouter=express.Router();

contactRouter.get("/", getAllContact);
contactRouter.post("/",createContact);
contactRouter.delete("/:id",deleteContact);

export default contactRouter;