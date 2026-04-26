import Contact from "../models/contact.js";

export async function createContact(req, res) {
    try {


        const contact = new Contact(req.body);
        await contact.save();



        res.status(201).json({
            message: "created contact successfully",
            contact
        });
    } catch (error) {


        res.status(500).json({
            message: "error creating contact",
            error: error.message
        });
    }
}

export async function getAllContact(req, res) {

    try {
        const contact = await Contact.find();
        res.status(200).json(
            contact
        )
    } catch (error) {
        res.status(500).json({
            message: "cannot get all contacts."
        })
    }
}

export async function deleteContact(req, res) {
    try {

        const { id } = req.params;
        const result = await Contact.deleteOne({ _id: id })
        res.status(200).json({
            message: "delete contact successfully.",

        })
    } catch (error) {
        res.status(500).json({
            message: "cannot delete contact.",
            error: error.message
        })
    }
}