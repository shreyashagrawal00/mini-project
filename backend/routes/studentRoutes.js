const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../config/authMiddleware');

// @desc    Get all students
// @route   GET /api/students
router.get('/', protect, async (req, res) => {
    const students = await Student.find({});
    res.json(students);
});

// @desc    Create new student
// @route   POST /api/students
router.post('/', protect, async (req, res) => {
    const { name, rollNo, class: studentClass, email, phone } = req.body;
    const studentExists = await Student.findOne({ rollNo });

    if (studentExists) {
        res.status(400).json({ message: 'Student already exists' });
    }

    const student = new Student({ name, rollNo, class: studentClass, email, phone });
    const createdStudent = await student.save();
    res.status(201).json(createdStudent);
});

// @desc    Update student
// @route   PUT /api/students/:id
router.put('/:id', protect, async (req, res) => {
    const { name, rollNo, class: studentClass, email, phone } = req.body;
    const student = await Student.findById(req.params.id);

    if (student) {
        student.name = name || student.name;
        student.rollNo = rollNo || student.rollNo;
        student.class = studentClass || student.class;
        student.email = email || student.email;
        student.phone = phone || student.phone;

        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

// @desc    Delete student
// @route   DELETE /api/students/:id
router.delete('/:id', protect, async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (student) {
        await student.deleteOne();
        res.json({ message: 'Student removed' });
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

module.exports = router;
