import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Upload, FileText, Image as ImageIcon, Code, File, Download, Mail, Send, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';
import useAuthStore from '../store/authStore';
import ThemeToggle from './ThemeToggle';
import '../styles/portfolio.css';

const PortfolioPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Portfolio state
  const [portfolioData, setPortfolioData] = useState({
    name: user?.name || '',
    title: user?.title || '',
    qualification: user?.qualification || '',
    about: user?.about || '',
    skills: user?.skills || [],
    projects: user?.projects || [],
    experiences: user?.experiences || [],
  });

  // Modal states
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);

  // Form states
  const [aboutText, setAboutText] = useState(portfolioData.about);
  const [newSkill, setNewSkill] = useState('');

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    link: '',
    files: []
  });

  const [experienceForm, setExperienceForm] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const [basicInfoForm, setBasicInfoForm] = useState({
    name: portfolioData.name,
    title: portfolioData.title,
    qualification: portfolioData.qualification
  });

  const [editingBasicInfo, setEditingBasicInfo] = useState(false);

  // Resume state
  const [resumeFile, setResumeFile] = useState(user?.resumeFile || null);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', contactNo: '' });
  const [contactErrors, setContactErrors] = useState({});
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Handle About Me
  const handleSaveAbout = () => {
    const updated = { ...portfolioData, about: aboutText };
    setPortfolioData(updated);
    updateUser({ about: aboutText });
    setShowAboutModal(false);
  };

  // Handle Skills
  const handleAddSkill = () => {
    if (newSkill.trim() && !portfolioData.skills.includes(newSkill.trim())) {
      const updatedSkills = [...portfolioData.skills, newSkill.trim()];
      setPortfolioData({ ...portfolioData, skills: updatedSkills });
      updateUser({ skills: updatedSkills });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = portfolioData.skills.filter(skill => skill !== skillToRemove);
    setPortfolioData({ ...portfolioData, skills: updatedSkills });
    updateUser({ skills: updatedSkills });
  };

  // Handle Projects
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));
    setProjectForm({ ...projectForm, files: [...projectForm.files, ...fileData] });
  };

  const handleRemoveFile = (fileId) => {
    const fileToRemove = projectForm.files.find(f => f.id === fileId);
    if (fileToRemove?.url) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    const updatedFiles = projectForm.files.filter(f => f.id !== fileId);
    setProjectForm({ ...projectForm, files: updatedFiles });
  };

  const handleSaveProject = () => {
    const newProject = {
      id: Date.now(),
      ...projectForm,
      createdAt: new Date().toISOString()
    };
    const updatedProjects = [...portfolioData.projects, newProject];
    setPortfolioData({ ...portfolioData, projects: updatedProjects });
    updateUser({ projects: updatedProjects });
    setShowProjectModal(false);
    setProjectForm({ title: '', description: '', technologies: '', link: '', files: [] });
  };

  const handleDeleteProject = (id) => {
    const projectToDelete = portfolioData.projects.find(p => p.id === id);
    projectToDelete?.files?.forEach(file => {
      if (file.url) URL.revokeObjectURL(file.url);
    });
    const updatedProjects = portfolioData.projects.filter(p => p.id !== id);
    setPortfolioData({ ...portfolioData, projects: updatedProjects });
    updateUser({ projects: updatedProjects });
  };

  // Handle Experience
  const handleSaveExperience = () => {
    const newExperience = {
      id: Date.now(),
      ...experienceForm
    };
    const updatedExperiences = [...portfolioData.experiences, newExperience];
    setPortfolioData({ ...portfolioData, experiences: updatedExperiences });
    updateUser({ experiences: updatedExperiences });
    setShowExperienceModal(false);
    setExperienceForm({ title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' });
  };

  const handleDeleteExperience = (id) => {
    const updatedExperiences = portfolioData.experiences.filter(e => e.id !== id);
    setPortfolioData({ ...portfolioData, experiences: updatedExperiences });
    updateUser({ experiences: updatedExperiences });
  };

  // Handle Basic Info
  const handleSaveBasicInfo = () => {
    setPortfolioData({ ...portfolioData, ...basicInfoForm });
    updateUser(basicInfoForm);
    setEditingBasicInfo(false);
  };

  // Handle Resume
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      lastModified: new Date().toISOString()
    };
    setResumeFile(fileData);
    updateUser({ resumeFile: fileData });
  };

  const handleResumeRemove = () => {
    if (resumeFile?.url) URL.revokeObjectURL(resumeFile.url);
    setResumeFile(null);
    updateUser({ resumeFile: null });
  };

  const handleResumeDownload = () => {
    if (!resumeFile?.url) return;
    const a = document.createElement('a');
    a.href = resumeFile.url;
    a.download = resumeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle Contact Form
  const validateContactForm = () => {
    const errors = {};
    if (!contactForm.name.trim()) errors.name = 'Name is required';
    if (!contactForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!contactForm.contactNo.trim()) {
      errors.contactNo = 'Contact number is required';
    }
    return errors;
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const errors = validateContactForm();
    setContactErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setContactSubmitting(true);
    // Simulate saving (no backend endpoint)
    setTimeout(() => {
      setContactSubmitting(false);
      setContactSubmitted(true);
      setContactForm({ name: '', email: '', contactNo: '' });
    }, 1200);
  };

  const handleContactReset = () => {
    setContactSubmitted(false);
    setContactErrors({});
  };

  const getFileIcon = (type) => {
    if (type.includes('image')) return <ImageIcon size={16} />;
    if (type.includes('pdf')) return <FileText size={16} />;
    if (type.includes('text') || type.includes('code')) return <Code size={16} />;
    return <File size={16} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const sortedExperiences = useMemo(() => {
    return [...portfolioData.experiences].sort((a, b) =>
      new Date(b.startDate) - new Date(a.startDate)
    );
  }, [portfolioData.experiences]);

  return (
    <div className="portfolio-page">
      {/* Header */}
      <div className="portfolio-header">
        <div className="portfolio-container">
          <div className="portfolio-header-bar">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="back-button"
              onClick={() => navigate('/home')}
            >
              <ArrowLeft size={16} />
              Back
            </motion.button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="portfolio-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Hero Section */}
          <div className="portfolio-hero">
            <div className="portfolio-hero-content">
              <div className="hero-avatar">
                {user?.avatar || user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hero-info">
                {editingBasicInfo ? (
                  <div className="edit-form-inline">
                    <input
                      type="text"
                      value={basicInfoForm.name}
                      onChange={(e) => setBasicInfoForm({ ...basicInfoForm, name: e.target.value })}
                      placeholder="Your Name"
                      className="hero-input"
                    />
                    <input
                      type="text"
                      value={basicInfoForm.title}
                      onChange={(e) => setBasicInfoForm({ ...basicInfoForm, title: e.target.value })}
                      placeholder="Your Title (e.g., Full Stack Developer)"
                      className="hero-input-small"
                    />
                    <input
                      type="text"
                      value={basicInfoForm.qualification}
                      onChange={(e) => setBasicInfoForm({ ...basicInfoForm, qualification: e.target.value })}
                      placeholder="Qualification (e.g., B.Tech Computer Science)"
                      className="hero-input-small"
                    />
                    <div className="inline-actions">
                      <button onClick={handleSaveBasicInfo} className="save-inline-btn">
                        <Save size={14} /> Save
                      </button>
                      <button onClick={() => setEditingBasicInfo(false)} className="cancel-inline-btn">
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="hero-name">{portfolioData.name || 'Your Name'}</h1>
                    <p className="hero-title">{portfolioData.title || 'Add your title'}</p>
                    <p className="hero-qualification">
                      <GraduationCap size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
                      {portfolioData.qualification || 'Add your qualification'}
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="edit-hero-btn"
                      onClick={() => setEditingBasicInfo(true)}
                    >
                      <Edit2 size={14} />
                      Edit Info
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="portfolio-tabs">
            {['overview', 'skills', 'projects', 'experience', 'resume', 'contact'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="tab-content"
              >
                <div className="overview-grid">
                  <div className="overview-card">
                    <div className="card-header-flex">
                      <h3>About Me</h3>
                      <button onClick={() => setShowAboutModal(true)} className="icon-btn">
                        <Edit2 size={14} />
                      </button>
                    </div>
                    <p>{portfolioData.about || 'Click edit to add your bio...'}</p>
                  </div>
                  <div className="overview-card">
                    <h3>Quick Stats</h3>
                    <div className="quick-stats">
                      <div className="stat-item">
                        <span className="stat-number">{portfolioData.skills.length}</span>
                        <span className="stat-label">Skills</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{portfolioData.projects.length}</span>
                        <span className="stat-label">Projects</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{portfolioData.experiences.length}</span>
                        <span className="stat-label">Experiences</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="tab-content"
              >
                <div className="section-header">
                  <div>
                    <h2>My Skills</h2>
                    <p>Add your technical and soft skills</p>
                  </div>
                </div>

                <div className="add-skill-section">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Enter a skill (e.g., React, Python)"
                    className="skill-input"
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddSkill}
                    className="add-skill-btn"
                  >
                    <Plus size={16} />
                    Add
                  </motion.button>
                </div>

                <div className="skills-grid">
                  {portfolioData.skills.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">◇</div>
                      <p>No skills added yet. Start by adding your first skill!</p>
                    </div>
                  ) : (
                    portfolioData.skills.map((skill) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="skill-chip"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="remove-skill-btn"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="tab-content"
              >
                <div className="section-header">
                  <div>
                    <h2>My Projects</h2>
                    <p>Showcase your best work</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="add-item-btn"
                    onClick={() => setShowProjectModal(true)}
                  >
                    <Plus size={16} />
                    Add Project
                  </motion.button>
                </div>

                {portfolioData.projects.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">◇</div>
                    <p>No projects added yet. Showcase your work!</p>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="add-item-btn"
                      onClick={() => setShowProjectModal(true)}
                    >
                      <Plus size={16} />
                      Add Your First Project
                    </motion.button>
                  </div>
                ) : (
                  <div className="projects-list">
                    {portfolioData.projects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="project-card"
                      >
                        <div className="project-header">
                          <h3>{project.title}</h3>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="delete-btn"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="project-description">{project.description}</p>
                        {project.technologies && (
                          <div className="project-tech">
                            <strong>Technologies:</strong> {project.technologies}
                          </div>
                        )}
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                            → View Project
                          </a>
                        )}
                        {project.files && project.files.length > 0 && (
                          <div className="project-files">
                            <strong>Attachments:</strong>
                            <div className="files-grid">
                              {project.files.map((file) => (
                                <div key={file.id || file.name} className="file-item">
                                  {getFileIcon(file.type)}
                                  <span>{file.name}</span>
                                  <span className="file-size">{formatFileSize(file.size)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="tab-content"
              >
                <div className="section-header">
                  <div>
                    <h2>Work Experience</h2>
                    <p>Your professional journey</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="add-item-btn"
                    onClick={() => setShowExperienceModal(true)}
                  >
                    <Plus size={16} />
                    Add Experience
                  </motion.button>
                </div>

                {portfolioData.experiences.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">◇</div>
                    <p>No experience added yet. Add your professional journey!</p>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="add-item-btn"
                      onClick={() => setShowExperienceModal(true)}
                    >
                      <Plus size={16} />
                      Add Your First Experience
                    </motion.button>
                  </div>
                ) : (
                  <div className="timeline">
                    {sortedExperiences.map((exp, index) => (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="timeline-item"
                      >
                        <div className="timeline-marker" />
                        <div className="timeline-content">
                          <div className="experience-header">
                            <div>
                              <h3>{exp.title}</h3>
                              <p className="company">{exp.company} • {exp.location}</p>
                              <p className="duration">
                                {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                {' — '}
                                {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="delete-btn"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="experience-description">{exp.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* RESUME TAB */}
            {activeTab === 'resume' && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="tab-content"
              >
                <div className="section-header">
                  <div>
                    <h2>My Resume</h2>
                    <p>Upload and share your resume</p>
                  </div>
                </div>

                {!resumeFile ? (
                  <div className="resume-upload-zone">
                    <input
                      type="file"
                      id="resumeUpload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="resumeUpload" className="resume-dropzone">
                      <div className="dropzone-icon">
                        <Upload size={32} />
                      </div>
                      <h3>Upload Your Resume</h3>
                      <p>Drag & drop or click to browse</p>
                      <span className="dropzone-hint">Supports PDF, DOC, DOCX</span>
                    </label>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="resume-file-card"
                  >
                    <div className="resume-file-accent" />
                    <div className="resume-file-body">
                      <div className="resume-file-info">
                        <div className="resume-file-icon">
                          <FileText size={28} />
                        </div>
                        <div>
                          <h3 className="resume-file-name">{resumeFile.name}</h3>
                          <p className="resume-file-meta">
                            {formatFileSize(resumeFile.size)} • Uploaded {new Date(resumeFile.lastModified).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="resume-actions">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          className="download-btn"
                          onClick={handleResumeDownload}
                        >
                          <Download size={16} />
                          Download
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          className="resume-remove-btn"
                          onClick={handleResumeRemove}
                        >
                          <Trash2 size={16} />
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* CONTACT TAB */}
            {activeTab === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="tab-content"
              >
                <div className="section-header">
                  <div>
                    <h2>Contact Details</h2>
                    <p>Update your contact information</p>
                  </div>
                </div>

                {contactSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="contact-success"
                  >
                    <div className="success-icon">
                      <CheckCircle size={48} />
                    </div>
                    <h3>Details Saved!</h3>
                    <p>Your contact details have been successfully saved.</p>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="add-item-btn"
                      onClick={handleContactReset}
                      style={{ marginTop: '1.5rem' }}
                    >
                      Edit Details
                    </motion.button>
                  </motion.div>
                ) : (
                  <form className="contact-form" onSubmit={handleContactSubmit} noValidate>
                    <div className="contact-form-grid">
                      <div className="contact-input-group">
                        <label htmlFor="contact-name">Name *</label>
                        <div className={`contact-input-wrapper ${contactErrors.name ? 'has-error' : ''}`}>
                          <input
                            id="contact-name"
                            type="text"
                            value={contactForm.name}
                            onChange={(e) => {
                              setContactForm({ ...contactForm, name: e.target.value });
                              if (contactErrors.name) setContactErrors({ ...contactErrors, name: '' });
                            }}
                            placeholder="Your full name"
                          />
                        </div>
                        {contactErrors.name && (
                          <motion.span
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="contact-error"
                          >
                            <AlertCircle size={12} /> {contactErrors.name}
                          </motion.span>
                        )}
                      </div>

                      <div className="contact-input-group">
                        <label htmlFor="contact-email">Email *</label>
                        <div className={`contact-input-wrapper ${contactErrors.email ? 'has-error' : ''}`}>
                          <input
                            id="contact-email"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => {
                              setContactForm({ ...contactForm, email: e.target.value });
                              if (contactErrors.email) setContactErrors({ ...contactErrors, email: '' });
                            }}
                            placeholder="you@example.com"
                          />
                        </div>
                        {contactErrors.email && (
                          <motion.span
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="contact-error"
                          >
                            <AlertCircle size={12} /> {contactErrors.email}
                          </motion.span>
                        )}
                      </div>
                    </div>

                    <div className="contact-input-group">
                      <label htmlFor="contact-no">Contact No *</label>
                      <div className={`contact-input-wrapper ${contactErrors.contactNo ? 'has-error' : ''}`}>
                        <input
                          id="contact-no"
                          type="tel"
                          value={contactForm.contactNo}
                          onChange={(e) => {
                            setContactForm({ ...contactForm, contactNo: e.target.value });
                            if (contactErrors.contactNo) setContactErrors({ ...contactErrors, contactNo: '' });
                          }}
                          placeholder="Your contact number"
                        />
                      </div>
                      {contactErrors.contactNo && (
                        <motion.span
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="contact-error"
                        >
                          <AlertCircle size={12} /> {contactErrors.contactNo}
                        </motion.span>
                      )}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="contact-submit-btn"
                      disabled={contactSubmitting}
                    >
                      {contactSubmitting ? (
                        <><div className="btn-spinner" /> Saving...</>
                      ) : (
                        <><Save size={16} /> Save</>
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* MODALS */}

      {/* About Me Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowAboutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Edit About Me</h2>
                <button onClick={() => setShowAboutModal(false)} className="close-btn">
                  <X size={18} />
                </button>
              </div>
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                placeholder="Tell us about yourself, your interests, goals, and what makes you unique..."
                className="modal-textarea"
                rows="8"
              />
              <div className="modal-actions">
                <button onClick={() => setShowAboutModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleSaveAbout} className="save-btn">
                  <Save size={14} /> Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowProjectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="modal-content large"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Add New Project</h2>
                <button onClick={() => setShowProjectModal(false)} className="close-btn">
                  <X size={18} />
                </button>
              </div>

              <div className="modal-form">
                <div className="form-group">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="E.g., E-commerce Website"
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Describe your project..."
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Technologies Used</label>
                  <input
                    type="text"
                    value={projectForm.technologies}
                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    placeholder="E.g., React, Node.js, MongoDB"
                  />
                </div>

                <div className="form-group">
                  <label>Project Link</label>
                  <input
                    type="url"
                    value={projectForm.link}
                    onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Upload Files</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="projectFiles"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="projectFiles" className="file-upload-btn">
                      <Upload size={16} />
                      Choose Files
                    </label>
                  </div>

                  {projectForm.files.length > 0 && (
                    <div className="uploaded-files">
                      {projectForm.files.map((file) => (
                        <div key={file.id} className="uploaded-file-item">
                          {getFileIcon(file.type)}
                          <div className="file-info">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{formatFileSize(file.size)}</span>
                          </div>
                          <button onClick={() => handleRemoveFile(file.id)} className="remove-file-btn">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowProjectModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button
                  onClick={handleSaveProject}
                  className="save-btn"
                  disabled={!projectForm.title || !projectForm.description}
                >
                  <Save size={14} /> Save Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Experience Modal */}
      <AnimatePresence>
        {showExperienceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowExperienceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="modal-content large"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Add Work Experience</h2>
                <button onClick={() => setShowExperienceModal(false)} className="close-btn">
                  <X size={18} />
                </button>
              </div>

              <div className="modal-form">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    value={experienceForm.title}
                    onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                    placeholder="E.g., Software Engineer"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Company *</label>
                    <input
                      type="text"
                      value={experienceForm.company}
                      onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                      placeholder="E.g., Google"
                    />
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={experienceForm.location}
                      onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                      placeholder="E.g., San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="month"
                      value={experienceForm.startDate}
                      onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="month"
                      value={experienceForm.endDate}
                      onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                      disabled={experienceForm.current}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={experienceForm.current}
                      onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked })}
                    />
                    <span>I currently work here</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={experienceForm.description}
                    onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                    placeholder="Describe your role, responsibilities, and achievements..."
                    rows="5"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowExperienceModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button
                  onClick={handleSaveExperience}
                  className="save-btn"
                  disabled={!experienceForm.title || !experienceForm.company || !experienceForm.startDate}
                >
                  <Save size={14} /> Save Experience
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioPage;