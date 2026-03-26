import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, Check, X, Clock, Save, ChevronRight } from 'lucide-react';

const AttendanceMarking = () => {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // studentId: status
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
            // Initialize attendance: all Present by default
            const initialAttendance = {};
            data.forEach(s => initialAttendance[s._id] = 'Present');
            setAttendance(initialAttendance);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendance({ ...attendance, [studentId]: status });
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const attendanceRecords = Object.keys(attendance).map(id => ({
                studentId: id,
                status: attendance[id]
            }));
            await api.post('/attendance', { attendanceRecords, date });
            setMessage({ type: 'success', text: 'Attendance saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save attendance.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="attendance-marking">
            <header className="page-header">
                <div>
                    <h1>Mark Attendance</h1>
                    <p>Select students and mark their status for today.</p>
                </div>
                <div className="date-picker glass">
                    <Calendar size={18} />
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </header>

            {message && (
                <div className={`status-msg ${message.type}`}>
                    {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
                    {message.text}
                </div>
            )}

            <div className="list-container glass">
                <div className="list-header">
                    <span>Student Details</span>
                    <span>Status</span>
                </div>
                <div className="student-list custom-scrollbar">
                    {loading ? (
                        <div className="loading">Loading students...</div>
                    ) : students.length === 0 ? (
                        <div className="empty">No students found. Add students first.</div>
                    ) : (
                        students.map(student => (
                            <div key={student._id} className="student-row">
                                <div className="st-info">
                                    <div className="st-avatar">{student.name.charAt(0)}</div>
                                    <div>
                                        <div className="st-name">{student.name}</div>
                                        <div className="st-meta">Roll: {student.rollNo} | Class: {student.class}</div>
                                    </div>
                                </div>
                                <div className="st-status-actions">
                                    <button 
                                        className={`status-btn present ${attendance[student._id] === 'Present' ? 'active' : ''}`}
                                        onClick={() => handleStatusChange(student._id, 'Present')}
                                    >
                                        <Check size={16} />
                                        <span>Present</span>
                                    </button>
                                    <button 
                                        className={`status-btn absent ${attendance[student._id] === 'Absent' ? 'active' : ''}`}
                                        onClick={() => handleStatusChange(student._id, 'Absent')}
                                    >
                                        <X size={16} />
                                        <span>Absent</span>
                                    </button>
                                    <button 
                                        className={`status-btn late ${attendance[student._id] === 'Late' ? 'active' : ''}`}
                                        onClick={() => handleStatusChange(student._id, 'Late')}
                                    >
                                        <Clock size={16} />
                                        <span>Late</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="submit-section">
                <p>Ensure all records are correct before submitting.</p>
                <button 
                    className="submit-btn" 
                    onClick={handleSubmit}
                    disabled={saving || loading || students.length === 0}
                >
                    {saving ? 'Saving...' : 'Submit Attendance'}
                    <Save size={20} />
                </button>
            </div>

            <style>{`
                .attendance-marking {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .date-picker {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0.6rem 1rem;
                    border-radius: 12px;
                }
                .date-picker input {
                    background: transparent;
                    border: none;
                    outline: none;
                    font-weight: 500;
                    font-family: inherit;
                    color: var(--text-main);
                }
                .status-msg {
                    padding: 1rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: slideDown 0.3s ease;
                }
                .status-msg.success { background: #ecfdf5; color: var(--success); border: 1px solid #d1fae5; }
                .status-msg.error { background: #fef2f2; color: var(--danger); border: 1px solid #fee2e2; }
                
                .list-container {
                    border-radius: 20px;
                    overflow: hidden;
                }
                .list-header {
                    background: #f8fafc;
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    font-weight: 600;
                    color: var(--secondary);
                    font-size: 0.9rem;
                    border-bottom: 1px solid var(--border);
                }
                .student-list {
                    padding: 1rem;
                    max-height: calc(100vh - 400px);
                    overflow-y: auto;
                }
                .student-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    border-radius: 16px;
                    margin-bottom: 0.5rem;
                    transition: all 0.2s;
                }
                .student-row:hover {
                    background: #f1f5f9;
                }
                .st-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .st-avatar {
                    width: 44px;
                    height: 44px;
                    background: var(--primary);
                    color: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.2rem;
                }
                .st-name { font-weight: 600; font-size: 1.05rem; }
                .st-meta { font-size: 0.85rem; color: var(--secondary); }
                
                .st-status-actions {
                    display: flex;
                    gap: 8px;
                }
                .status-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    background: #f1f5f9;
                    color: var(--secondary);
                    transition: all 0.2s;
                }
                .status-btn.present.active { background: #d1fae5; color: var(--success); }
                .status-btn.absent.active { background: #fee2e2; color: var(--danger); }
                .status-btn.late.active { background: #fef3c7; color: var(--warning); }
                
                .submit-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    background: white;
                    border-radius: 20px;
                    border: 1px solid var(--border);
                }
                .submit-section p { color: var(--secondary); font-size: 0.9rem; }
                .submit-btn {
                    background: var(--primary);
                    color: white;
                    padding: 0.875rem 1.5rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow); }
                .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                
                @keyframes slideDown {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default AttendanceMarking;
