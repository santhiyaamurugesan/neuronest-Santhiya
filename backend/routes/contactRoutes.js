import express from 'express';
import asyncHandler from 'express-async-handler';
import Contact from '../models/contactModel.js';

const router = express.Router();

router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { name, email, message } = req.body;
        const contact = new Contact({ name, email, message });
        await contact.save();
        res.status(201).json(contact);
    })
);

export default router;
