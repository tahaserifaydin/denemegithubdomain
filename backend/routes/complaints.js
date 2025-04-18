const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// Get all complaints
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new complaint
router.post('/', async (req, res) => {
    const complaint = new Complaint({
        name: req.body.name,
        email: req.body.email,
        hotelName: req.body.hotelName,
        rating: req.body.rating,
        comment: req.body.comment
    });

    try {
        const newComplaint = await complaint.save();
        res.status(201).json(newComplaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a complaint
router.delete('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Şikayet bulunamadı' });
        }
        res.json({ message: 'Şikayet başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 