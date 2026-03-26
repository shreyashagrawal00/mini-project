const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../config/authMiddleware');

// @desc    Mark attendance
// @route   POST /api/attendance
router.post('/', protect, async (req, res) => {
    const { attendanceRecords, date } = req.body; // array of { studentId, status }

    if (!attendanceRecords || attendanceRecords.length === 0) {
        return res.status(400).json({ message: 'No attendance records provided' });
    }

    const attendanceDate = date ? new Date(date).setHours(0,0,0,0) : new Date().setHours(0,0,0,0);

    try {
        const promises = attendanceRecords.map(async (record) => {
            return await Attendance.findOneAndUpdate(
                { student: record.studentId, date: attendanceDate },
                { status: record.status, markedBy: req.user._id },
                { upsert: true, new: true }
            );
        });

        await Promise.all(promises);
        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get attendance for a date or class
// @route   GET /api/attendance
router.get('/', protect, async (req, res) => {
    const { date, class: studentClass } = req.query;
    let query = {};

    if (date) {
        const attendanceDate = new Date(date).setHours(0,0,0,0);
        query.date = attendanceDate;
    }

    let attendance = await Attendance.find(query).populate('student');

    if (studentClass) {
        attendance = attendance.filter(a => a.student.class === studentClass);
    }

    res.json(attendance);
});

// @desc    Get attendance analytics
// @route   GET /api/attendance/analytics
router.get('/analytics', protect, async (req, res) => {
    // Basic stats: Total students, classes, attendance %
    const totalStudents = await require('../models/Student').countDocuments();
    const attendanceRecords = await Attendance.find({});
    
    const presentCount = attendanceRecords.filter(a => a.status === 'Present').length;
    const totalRecords = attendanceRecords.length;
    const attendancePercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

    res.json({
        totalStudents,
        attendancePercentage,
        totalRecords,
        presentCount
    });
});

module.exports = router;
