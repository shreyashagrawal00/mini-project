const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Attendance = require('./models/Attendance');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
        console.log('MongoDB Connected for Seeding...');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await User.deleteMany();
        await Student.deleteMany();
        await Attendance.deleteMany();

        console.log('Data Cleared!');

        // Create Admin
        const admin = await User.create({
            name: 'Teacher Admin',
            email: 'admin@school.com',
            password: 'password123',
            isAdmin: true
        });

        console.log('Admin User Created (email: admin@school.com, password: password123)');

        // Create Students
        const students = await Student.insertMany([
            { name: 'John Doe', rollNo: '101', class: '10-A', email: 'john@example.com' },
            { name: 'Jane Smith', rollNo: '102', class: '10-A', email: 'jane@example.com' },
            { name: 'Alice Brown', rollNo: '103', class: '10-B', email: 'alice@example.com' },
            { name: 'Bob Wilson', rollNo: '104', class: '10-C', email: 'bob@example.com' },
            { name: 'Charlie Davis', rollNo: '105', class: '10-B', email: 'charlie@example.com' }
        ]);

        console.log(`${students.length} Students Created!`);

        // Create some attendance records for yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0,0,0,0);

        await Attendance.insertMany([
            { student: students[0]._id, date: yesterday, status: 'Present', markedBy: admin._id },
            { student: students[1]._id, date: yesterday, status: 'Absent', markedBy: admin._id },
            { student: students[2]._id, date: yesterday, status: 'Present', markedBy: admin._id }
        ]);

        console.log('Sample Attendance Records Created!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        process.exit(1);
    }
};

seedData();
