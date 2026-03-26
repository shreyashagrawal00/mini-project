import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { Users, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        attendancePercentage: 0,
        todayPresent: 0,
        todayAbsent: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/attendance/analytics');
                // For demo, if data is empty, use some defaults
                setStats({
                    totalStudents: data.totalStudents || 0,
                    attendancePercentage: Math.round(data.attendancePercentage) || 0,
                    todayPresent: data.presentCount || 0,
                    todayAbsent: (data.totalStudents - data.presentCount) || 0
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="dashboard">
            <header className="page-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back! Here's what's happening today.</p>
                </div>
                <div className="date-display glass">
                    <Calendar size={18} />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </header>

            <div className="stats-grid">
                <StatsCard 
                    title="Total Students" 
                    value={stats.totalStudents} 
                    icon={<Users size={24} />} 
                    color="#6366f1"
                    trend={{ value: 12, positive: true }}
                />
                <StatsCard 
                    title="Avg Attendance" 
                    value={`${stats.attendancePercentage}%`} 
                    icon={<CheckCircle size={24} />} 
                    color="#10b981"
                    trend={{ value: 5, positive: true }}
                />
                <StatsCard 
                    title="Today Present" 
                    value={stats.todayPresent} 
                    icon={<CheckCircle size={24} />} 
                    color="#8b5cf6"
                />
                <StatsCard 
                    title="Today Absent" 
                    value={stats.todayAbsent} 
                    icon={<XCircle size={24} />} 
                    color="#ef4444"
                />
            </div>

            <div className="dashboard-content">
                <div className="recent-activity glass">
                    <h3>Today's Attendance Status</h3>
                    <div className="status-chart-placeholder">
                        <div className="chart-info">
                            <span className="percentage">{stats.attendancePercentage}%</span>
                            <span>Marked Today</span>
                        </div>
                    </div>
                    <div className="status-list">
                        <div className="status-item">
                            <div className="dot present"></div>
                            <span>Present</span>
                            <span className="count">{stats.todayPresent}</span>
                        </div>
                        <div className="status-item">
                            <div className="dot absent"></div>
                            <span>Absent</span>
                            <span className="count">{stats.todayAbsent}</span>
                        </div>
                    </div>
                </div>

                <div className="quick-actions glass">
                    <h3>Quick Actions</h3>
                    <div className="actions-grid">
                        <button className="action-btn">Mark Attendance</button>
                        <button className="action-btn secondary">Add New Student</button>
                        <button className="action-btn secondary">Download Report</button>
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .date-display {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0.75rem 1.25rem;
                    border-radius: 12px;
                    color: var(--secondary);
                    font-weight: 500;
                    font-size: 0.9rem;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 1.5rem;
                }
                .dashboard-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                }
                .recent-activity, .quick-actions {
                    padding: 1.5rem;
                    border-radius: 20px;
                }
                .recent-activity h3, .quick-actions h3 {
                    margin-bottom: 1.5rem;
                    font-size: 1.1rem;
                }
                .status-chart-placeholder {
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle, #eef2ff 0%, transparent 70%);
                    margin-bottom: 1.5rem;
                    border-radius: 50%;
                    width: 200px;
                    margin: 0 auto 1.5rem;
                    border: 8px solid #f1f5f9;
                }
                .chart-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .percentage {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--primary);
                }
                .status-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .status-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0.75rem;
                    border-radius: 10px;
                    background: #f8fafc;
                }
                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                }
                .dot.present { background: var(--success); }
                .dot.absent { background: var(--danger); }
                .count {
                    margin-left: auto;
                    font-weight: 600;
                }
                .actions-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .action-btn {
                    padding: 0.875rem;
                    border-radius: 12px;
                    font-weight: 600;
                    background: var(--primary);
                    color: white;
                    transition: all 0.2s;
                }
                .action-btn.secondary {
                    background: #f1f5f9;
                    color: var(--text-main);
                }
                .action-btn:hover {
                    opacity: 0.9;
                    transform: translateX(5px);
                }
                @media (max-width: 1024px) {
                    .dashboard-content {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
