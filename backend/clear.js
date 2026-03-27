const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Attendance = require('./models/Attendance');
const Class = require('./models/Class');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
        console.log('MongoDB Connected for Clearing Data...');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const clearData = async () => {
    await connectDB();

    try {
        // Deleting all Attendance records
        await Attendance.deleteMany({});
        console.log('Attendance records cleared!');

        // Deleting all Students
        await Student.deleteMany({});
        console.log('Students cleared!');

        // Deleting all Classes
        await Class.deleteMany({});
        console.log('Classes cleared!');

        // Deleting all Users EXCEPT for Teacher Admin (admin@school.com)
        const result = await User.deleteMany({ email: { $ne: 'admin@school.com' } });
        console.log(`Users cleared (Except admin@school.com). Removed ${result.deletedCount} dummy users.`);

        console.log('------------------------------------------------');
        console.log('Dummy data removal complete! Admin account preserved.');
        console.log('------------------------------------------------');
        
        process.exit();
    } catch (error) {
        console.error(`Error while clearing: ${error.message}`);
        process.exit(1);
    }
};

clearData();
