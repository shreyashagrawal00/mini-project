import React from 'react';
import { Award, Globe, BookOpen, GraduationCap } from 'lucide-react';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-overlay"></div>
            <div className="about-content">
                <header className="about-header glass">
                    <GraduationCap size={48} className="about-icon" />
                    <h1>GLA University, Mathura</h1>
                    <p className="subtitle">Accredited with NAAC A+ Grade</p>
                </header>

                <div className="about-grid">
                    <section className="about-section glass">
                        <h2><BookOpen size={24} /> Our History</h2>
                        <p>
                            GLA University's roots trace back to 1998 with the establishment of the GLA Institute of Technology and Management (GLAITM). 
                            Founded by Shri Narayan Das Agrawal, the institution was upgraded to a full-fledged University in 2010. 
                            Named in honor of his father, Late Shri Ganeshi Lal Agrawal, the university has since grown into a premier hub for higher education in India.
                        </p>
                    </section>

                    <section className="about-section glass">
                        <h2><Globe size={24} /> Mission & Vision</h2>
                        <p>
                            To be a pace-setting university committed to academic excellence, research, and development. 
                            We aim to produce highly skilled professionals and worthy citizens who can contribute meaningfully to society 
                            and the global economy through innovation and ethical leadership.
                        </p>
                    </section>
                </div>

                <div className="stats-grid">
                    <div className="stat-card glass">
                        <h3>110+</h3>
                        <p>Acre Campus</p>
                    </div>
                    <div className="stat-card glass">
                        <h3>80+</h3>
                        <p>Total Programs</p>
                    </div>
                    <div className="stat-card glass">
                        <h3>135+</h3>
                        <p>Specialized Labs</p>
                    </div>
                    <div className="stat-card glass">
                        <h3>A+</h3>
                        <p>NAAC Grade</p>
                    </div>
                </div>

                <section className="accreditation-section glass">
                    <h2><Award size={24} /> Key Accreditations</h2>
                    <ul>
                        <li>Approved by University Grants Commission (UGC) - 12B Status</li>
                        <li>All India Council for Technical Education (AICTE) Approved</li>
                        <li>Accredited with 'A+' Grade by NAAC</li>
                        <li>Member of the Association of Indian Universities (AIU)</li>
                    </ul>
                </section>
            </div>

            <style>{`
                .about-container {
                    position: relative;
                    min-height: calc(100vh - 4rem);
                    border-radius: 24px;
                    overflow: hidden;
                    background-image: url('/assets/campus_4k.png');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    padding: 2rem;
                }
                .about-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.2); /* Reduced opacity for clarity */
                    z-index: 1;
                }
                .about-content {
                    position: relative;
                    z-index: 2;
                    max-width: 1000px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .about-header {
                    text-align: center;
                    padding: 3rem;
                    color: var(--text-main);
                }
                .about-header h1 {
                    font-size: 3rem;
                    margin: 1rem 0 0.5rem;
                    color: var(--primary);
                }
                .subtitle {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--secondary);
                }
                .about-icon {
                    color: var(--primary);
                    margin: 0 auto;
                }
                .about-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
                .about-section {
                    padding: 2rem;
                    color: var(--text-main);
                }
                .about-section h2 {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 1.5rem;
                    color: var(--primary);
                    font-size: 1.5rem;
                }
                .about-section p {
                    line-height: 1.8;
                    font-size: 1.05rem;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                }
                .stat-card {
                    text-align: center;
                    padding: 1.5rem;
                }
                .stat-card h3 {
                    font-size: 2rem;
                    color: var(--primary);
                    margin-bottom: 0.5rem;
                }
                .stat-card p {
                    font-weight: 600;
                    color: var(--secondary);
                }
                .accreditation-section {
                    padding: 2.5rem;
                }
                .accreditation-section h2 {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 1.5rem;
                    color: var(--primary);
                }
                .accreditation-section ul {
                    list-style: none;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .accreditation-section li {
                    padding-left: 1.5rem;
                    position: relative;
                    font-weight: 500;
                }
                .accreditation-section li::before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: var(--success);
                    font-weight: bold;
                }
                @media (max-width: 900px) {
                    .about-grid, .accreditation-section ul {
                        grid-template-columns: 1fr;
                    }
                    .stats-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default About;
