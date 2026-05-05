const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../config/authMiddleware');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all students
// @route   GET /api/students
router.get('/', protect, async (req, res) => {
    const students = await Student.find({});
    res.json(students);
});

// @desc    Create new student
// @route   POST /api/students
router.post('/', protect, async (req, res) => {
    try {
        let { name, rollNo, universityRollNo, class: studentClass } = req.body;
        const email = req.body.email?.toLowerCase();

        // Trim inputs to prevent whitespace issues
        rollNo = rollNo?.trim();
        universityRollNo = universityRollNo?.trim();
        studentClass = studentClass?.trim();

        const studentExists = await Student.findOne({ rollNo, class: studentClass });
        if (studentExists) {
            res.status(400).json({ message: `Roll No ${rollNo} already exists in class ${studentClass} (Assigned to: ${studentExists.name})` });
            return;
        }

        const uniRollExists = await Student.findOne({ universityRollNo });
        if (uniRollExists) {
            res.status(400).json({ message: `University Roll No ${universityRollNo} is already assigned to ${uniRollExists.name} in class ${uniRollExists.class}` });
            return;
        }

        const student = await Student.create({ 
            name, 
            email, 
            rollNo, 
            universityRollNo, 
            class: studentClass 
        });

        // Send Welcome Email to student
        try {
            await sendEmail({
                email: student.email,
                subject: 'Welcome to e-हाज़री - Section Assignment',
                message: `Hello ${student.name},\n\nYou have been successfully registered in the Smart Attendance Portal (e-हाज़री).\n\nYou have been added to Section: ${studentClass}.\n\nYour Roll No: ${rollNo}\nUniversity Roll No: ${universityRollNo}\n\nRegards,\nSmart Attendance Team`
            });
        } catch (mailError) {
            console.error('Notification email failed:', mailError);
            // We don't block the student creation if email fails
        }

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update student
// @route   PUT /api/students/:id
router.put('/:id', protect, async (req, res) => {
    try {
        let { name, rollNo, universityRollNo, class: studentClass } = req.body;
        const email = req.body.email?.toLowerCase();
        const student = await Student.findById(req.params.id);

        if (student) {
            // Trim inputs if provided
            rollNo = rollNo?.trim() || student.rollNo;
            universityRollNo = universityRollNo?.trim() || student.universityRollNo;
            studentClass = studentClass?.trim() || student.class;

            // Check if new rollNo already exists for ANOTHER student in the same class
            if (rollNo !== student.rollNo || studentClass !== student.class) {
                const rollExists = await Student.findOne({ rollNo, class: studentClass, _id: { $ne: student._id } });
                if (rollExists) {
                    return res.status(400).json({ message: `Roll No ${rollNo} is already assigned to ${rollExists.name} in class ${studentClass}` });
                }
            }

            // Check if new universityRollNo already exists for ANOTHER student
            if (universityRollNo !== student.universityRollNo) {
                const uniExists = await Student.findOne({ universityRollNo, _id: { $ne: student._id } });
                if (uniExists) {
                    return res.status(400).json({ message: `University Roll No ${universityRollNo} is already assigned to ${uniExists.name}` });
                }
            }

            student.name = name || student.name;
            student.email = email || student.email;
            student.rollNo = rollNo;
            student.universityRollNo = universityRollNo;
            student.class = studentClass;

            const updatedStudent = await student.save();
            res.json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete student
// @route   DELETE /api/students/:id
router.delete('/:id', protect, async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (student) {
        // Cascade delete associated attendance records
        const Attendance = require('../models/Attendance');
        await Attendance.deleteMany({ student: student._id });

        await student.deleteOne();
        res.json({ message: 'Student removed' });
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

module.exports = router;
