import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, UserPlus, Edit, Trash2, Filter } from 'lucide-react';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({ name: '', rollNo: '', class: '', email: '', phone: '' });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingStudent) {
                await api.put(`/students/${editingStudent._id}`, formData);
            } else {
                await api.post('/students', formData);
            }
            fetchStudents();
            closeModal();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving student');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/students/${id}`);
                fetchStudents();
            } catch (err) {
                alert('Error deleting student');
            }
        }
    };

    const openModal = (student = null) => {
        if (student) {
            setEditingStudent(student);
            setFormData({ 
                name: student.name, 
                rollNo: student.rollNo, 
                class: student.class, 
                email: student.email || '', 
                phone: student.phone || '' 
            });
        } else {
            setEditingStudent(null);
            setFormData({ name: '', rollNo: '', class: '', email: '', phone: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
    };

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.rollNo.includes(searchTerm) ||
        s.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="student-management">
            <header className="page-header">
                <div>
                    <h1>Student Management</h1>
                    <p>Add, update, or remove students from the records.</p>
                </div>
                <button className="add-btn" onClick={() => openModal()}>
                    <Plus size={20} />
                    <span>Add Student</span>
                </button>
            </header>

            <div className="tbl-actions glass">
                <div className="search-box">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search name, roll no, or class..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="filter-btn">
                    <Filter size={18} />
                    <span>Filter</span>
                </button>
            </div>

            <div className="table-container glass custom-scrollbar">
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="loading">Loading students...</td></tr>
                        ) : filteredStudents.length === 0 ? (
                            <tr><td colSpan="5" className="empty">No students found.</td></tr>
                        ) : (
                            filteredStudents.map(student => (
                                <tr key={student._id}>
                                    <td><span className="roll-badge">{student.rollNo}</span></td>
                                    <td className="st-name">{student.name}</td>
                                    <td>{student.class}</td>
                                    <td className="st-email">{student.email || '-'}</td>
                                    <td>
                                        <div className="actions">
                                            <button className="edit-btn" onClick={() => openModal(student)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="delete-btn" onClick={() => handleDelete(student._id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass">
                        <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Roll Number</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.rollNo}
                                        onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Class/Section</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.class}
                                        onChange={(e) => setFormData({...formData, class: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="save-btn">Save Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .student-management {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .add-btn {
                    background: var(--primary);
                    color: white;
                    padding: 0.75rem 1.25rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .add-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }
                .tbl-actions {
                    padding: 1rem;
                    border-radius: 16px;
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .search-box {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #f1f5f9;
                    padding: 0.6rem 1rem;
                    border-radius: 10px;
                }
                .search-box input {
                    background: transparent;
                    border: none;
                    outline: none;
                    width: 100%;
                }
                .filter-btn {
                    padding: 0.6rem 1rem;
                    border-radius: 10px;
                    background: #f1f5f9;
                    color: var(--secondary);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 500;
                }
                .table-container {
                    border-radius: 20px;
                    overflow: hidden;
                    overflow-x: auto;
                }
                .student-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .student-table th {
                    background: #f8fafc;
                    padding: 1rem 1.5rem;
                    font-weight: 600;
                    color: var(--secondary);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .student-table td {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid var(--border);
                }
                .roll-badge {
                    background: #eef2ff;
                    color: var(--primary);
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.85rem;
                }
                .st-name {
                    font-weight: 600;
                }
                .st-email {
                    color: var(--secondary);
                    font-size: 0.9rem;
                }
                .actions {
                    display: flex;
                    gap: 8px;
                }
                .actions button {
                    width: 34px;
                    height: 34px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .edit-btn { background: #ecfdf5; color: var(--success); }
                .edit-btn:hover { background: var(--success); color: white; }
                .delete-btn { background: #fef2f2; color: var(--danger); }
                .delete-btn:hover { background: var(--danger); color: white; }
                
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    padding: 2rem;
                    border-radius: 24px;
                }
                .modal-content h2 { margin-bottom: 1.5rem; }
                .form-group { margin-bottom: 1.25rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; }
                .form-group input { 
                    width: 100%; 
                    padding: 0.75rem; 
                    border-radius: 10px; 
                    border: 1.5px solid var(--border); 
                    outline: none;
                }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 2rem; }
                .cancel-btn { padding: 0.75rem 1.5rem; border-radius: 10px; background: #f1f5f9; font-weight: 600; }
                .save-btn { padding: 0.75rem 1.5rem; border-radius: 10px; background: var(--primary); color: white; font-weight: 600; }
            `}</style>
        </div>
    );
};

export default StudentManagement;
