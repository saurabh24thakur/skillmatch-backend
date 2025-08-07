import React, { useState, useEffect, useRef } from 'react';

// --- MOCK DATA ---
// Added 'type' for job location preference
const sampleJobs = [
  { id: 1, title: 'Frontend Developer Intern', company: 'Innovate Inc.', description: 'Work with our team to build amazing user interfaces. You will be responsible for developing and implementing user interface components using React.js concepts and workflows such as Redux, Flux, and Webpack.', requiredSkills: ['React', 'JavaScript', 'CSS'], confidenceNeeded: 60, type: 'Remote' },
  { id: 2, title: 'UI/UX Design Intern', company: 'Creative Solutions', description: 'Help design intuitive and beautiful user experiences. This role involves creating wireframes, storyboards, user flows, process flows and site maps to effectively communicate interaction and design ideas.', requiredSkills: ['Canva', 'Figma'], confidenceNeeded: 80, type: 'On-site' },
  { id: 3, title: 'Data Analyst Intern', company: 'DataDriven Co.', description: 'Analyze datasets to provide valuable insights. You will work on collecting data from primary and secondary sources, maintaining databases, and generating reports.', requiredSkills: ['Excel', 'SQL', 'Python'], confidenceNeeded: 60, type: 'Hybrid' },
  { id: 4, title: 'Social Media Manager', company: 'Connectify', description: 'Manage and grow our social media presence. Responsibilities include creating original text and video content, managing posts and responding to followers.', requiredSkills: ['Canva', 'Marketing'], confidenceNeeded: 40, type: 'Remote' },
  { id: 5, title: 'React Native Developer', company: 'MobileFirst', description: 'Develop cross-platform mobile applications. You will be building mobile applications on iOS and Android platforms from scratch.', requiredSkills: ['React', 'JavaScript', 'React Native'], confidenceNeeded: 80, type: 'On-site' },
];


// --- Components ---

// Dark Mode Toggle Component
const DarkModeToggle = ({ darkMode, setDarkMode }) => {
    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Toggle dark mode"
        >
            {darkMode ? (
                // Moon Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ) : (
                // Sun Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )}
        </button>
    );
};

// Job Detail Modal Component
const JobDetailModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{job.title}</h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300">{job.company}</p>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <span className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${job.type === 'Remote' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : job.type === 'On-site' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>{job.type}</span>
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Description</h4>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">{job.description}</p>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Required Skills</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {job.requiredSkills.map(skill => (
                                <span key={skill} className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    {skill} (Confidence: {job.confidenceNeeded}%)
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Close</button>
                    <a href="#" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Apply Now</a>
                </div>
            </div>
        </div>
    );
};

// Complete Profile Modal
const CompleteProfileModal = ({ user, profileData, setProfileData, onClose }) => {
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        dob: user?.dob || '',
        phone: '',
        location: '',
        university: '',
        degree: '',
        fieldOfStudy: '',
        gradYear: '',
        about: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProfileData(formData);
        // Here you would typically save to a backend
        console.log("Profile Saved:", formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-full overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Complete Your Profile</h3>
                            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Personal Details */}
                        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Personal Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                    <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                                    <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                                </div>
                                <div>
                                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                                    <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                                    <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                                </div>
                            </div>
                        </div>

                        {/* Education Details */}
                        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Education</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="md:col-span-2">
                                    <label htmlFor="university" className="block text-sm font-medium text-gray-700 dark:text-gray-300">University</label>
                                    <input type="text" name="university" id="university" value={formData.university} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                                </div>
                                <div>
                                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Degree</label>
                                    <input type="text" name="degree" id="degree" value={formData.degree} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                                </div>
                                <div>
                                    <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Field of Study</label>
                                    <input type="text" name="fieldOfStudy" id="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                                </div>
                                <div>
                                    <label htmlFor="gradYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Graduation Year</label>
                                    <input type="number" name="gradYear" id="gradYear" value={formData.gradYear} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" placeholder="YYYY" />
                                </div>
                            </div>
                        </div>

                        {/* About Me */}
                        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">About Me</h4>
                            <div className="mt-4">
                                <textarea name="about" id="about" rows="4" value={formData.about} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Profile</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// Navbar Component
const Navbar = ({ page, setPage, user, handleLogout, darkMode, setDarkMode, setAuthMode, openProfileModal }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <span 
                            className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
                            onClick={() => setPage('home')}
                        >
                            SkillMatch
                        </span>
                    </div>
                    <div className="hidden md:flex items-center">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a href="#" onClick={() => setPage('home')} className={`px-3 py-2 rounded-md text-sm font-medium ${page === 'home' ? 'text-indigo-600 bg-indigo-50 dark:bg-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Home</a>
                            {user && <a href="#" onClick={() => setPage('skills')} className={`px-3 py-2 rounded-md text-sm font-medium ${page === 'skills' ? 'text-indigo-600 bg-indigo-50 dark:bg-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Find Jobs</a>}
                        </div>
                        <div className="ml-auto flex items-center">
                            {user ? (
                                <div className="ml-4 relative" ref={profileMenuRef}>
                                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex text-sm bg-gray-200 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500">
                                        <span className="sr-only">Open user menu</span>
                                        <div className="h-8 w-8 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </button>
                                    {isProfileOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => { openProfileModal(); setIsProfileOpen(false); }}>Complete Profile</a>
                                            <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <button onClick={() => { setAuthMode('login'); setPage('auth'); }} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Login</button>
                                    <button onClick={() => { setAuthMode('signup'); setPage('auth'); }} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Sign Up</button>
                                </div>
                            )}
                            <div className="ml-4">
                               <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                            </div>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                         <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                        <button onClick={() => {
                            const menu = document.getElementById('mobile-menu');
                            menu.classList.toggle('hidden');
                        }} type="button" className="bg-gray-100 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="md:hidden hidden" id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a href="#" onClick={() => setPage('home')} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">Home</a>
                    {user && <a href="#" onClick={() => setPage('skills')} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">Find Jobs</a>}
                    {user ? (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                             <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => openProfileModal()}>Complete Profile</a>
                             <a href="#" onClick={handleLogout} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Logout</a>
                        </div>
                    ) : (
                        <>
                            <button onClick={() => { setAuthMode('login'); setPage('auth'); }} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium">Login</button>
                            <button onClick={() => { setAuthMode('signup'); setPage('auth'); }} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium">Sign Up</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

// Job Match Demo Component for Homepage
const JobMatchDemo = ({ setSelectedJob }) => {
    const [demoSkills, setDemoSkills] = useState([]);
    const [skillName, setSkillName] = useState('');
    const [confidence, setConfidence] = useState(70);
    const [jobType, setJobType] = useState('All');
    const [matchedJobs, setMatchedJobs] = useState([]);
    const [demoRan, setDemoRan] = useState(false);

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (skillName.trim() && !demoSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
            setDemoSkills([...demoSkills, { name: skillName, confidence: confidence }]);
            setSkillName('');
        }
    };
    
    const handleRemoveSkill = (skillToRemove) => {
        setDemoSkills(demoSkills.filter(skill => skill.name !== skillToRemove.name));
    };

    const runDemo = () => {
        let matches = [];
        if (demoSkills.length > 0) {
            const userSkillMap = new Map(demoSkills.map(s => [s.name.toLowerCase(), s.confidence]));
            matches = sampleJobs.filter(job => 
                job.requiredSkills.some(reqSkill => {
                    const reqSkillLower = reqSkill.toLowerCase();
                    return userSkillMap.has(reqSkillLower) && userSkillMap.get(reqSkillLower) >= (job.confidenceNeeded || 0);
                })
            );
        }
        
        if (jobType !== 'All') {
            matches = matches.filter(job => job.type === jobType);
        }

        setMatchedJobs(matches);
        setDemoRan(true);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Left Column: Add Skills */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Add Your Skills</h3>
                <form onSubmit={handleAddSkill} className="space-y-4">
                    <input 
                        type="text" 
                        value={skillName} 
                        onChange={(e) => setSkillName(e.target.value)} 
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" 
                        placeholder="e.g., React, Python, Canva" 
                    />
                     <div>
                        <label htmlFor="demo_confidence" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confidence Level: {confidence}%</label>
                        <input 
                            type="range" 
                            id="demo_confidence" 
                            min="0" 
                            max="100" 
                            step="10" 
                            value={confidence} 
                            onChange={(e) => setConfidence(parseInt(e.target.value))} 
                            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Skill</button>
                </form>
                <div className="mt-4 min-h-[6rem] flex-grow">
                    {demoSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {demoSkills.map(skill => (
                                <span key={skill.name} className="flex items-center gap-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium">
                                    {skill.name} ({skill.confidence}%)
                                    <button onClick={() => handleRemoveSkill(skill)} className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-100">
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Add a skill to get started.</p>
                    )}
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">Job Type</h4>
                    <div className="flex justify-around">
                        {['All', 'Remote', 'On-site', 'Hybrid'].map(type => (
                            <label key={type} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                                <input type="radio" name="jobTypeDemo" value={type} checked={jobType === type} onChange={(e) => setJobType(e.target.value)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"/>
                                <span>{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
                 <button onClick={runDemo} className="mt-6 w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-bold text-lg">
                    Find Matching Jobs!
                </button>
            </div>

            {/* Right Column: Matched Jobs */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">See Your Matches</h3>
                <div className="space-y-4 flex-grow">
                    {demoRan ? (
                        matchedJobs.length > 0 ? (
                            matchedJobs.slice(0, 3).map(job => ( // Show max 3 jobs for demo
                                <div key={job.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-pointer hover:shadow-lg" onClick={() => setSelectedJob(job)}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">{job.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{job.company}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.type === 'Remote' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : job.type === 'On-site' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>{job.type}</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }} className="mt-4 inline-block w-full text-center bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 text-sm font-semibold">Apply Now</button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center pt-8">No matching jobs found. Try different skills or job types.</p>
                        )
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center pt-8">Your matched jobs will appear here.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


// Home Page Component
const HomePage = ({ setPage, setSelectedJob }) => {
    const timelineSteps = [
        {
            title: "Add Your Skills",
            description: "List all your skills, from programming languages to design software. Rate your confidence level for each one.",
        },
        {
            title: "Get Matched",
            description: "Our smart algorithm instantly matches your skill profile with relevant job and internship opportunities.",
        },
        {
            title: "Apply & Grow",
            description: "Apply to your matched roles with a single click and start your career journey with confidence.",
        }
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-gray-50 dark:bg-gray-900 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Unlock your potential</span>{' '}
                                    <span className="block text-indigo-600 dark:text-indigo-400 xl:inline">based on skills, not degrees.</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    SkillMatch connects you to internships and jobs that value what you can do. Showcase your skills, build your confidence, and find the perfect opportunity to grow.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <a href="#" onClick={() => setPage('auth')} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                                            Get Started
                                        </a>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <a href="#how-it-works" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-300 dark:bg-gray-700 dark:hover:bg-gray-600 md:py-4 md:text-lg md:px-10">
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            
            {/* NEW Demo Section */}
            <div id="demo" className="py-20 bg-indigo-50 dark:bg-gray-900/50">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                           See It In Action
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                           Try the SkillMatch tool right now. No sign-up required.
                        </p>
                    </div>
                    <div className="mt-12">
                        <JobMatchDemo setSelectedJob={setSelectedJob} />
                    </div>
                </div>
            </div>


            {/* How It Works Section */}
            <div id="how-it-works" className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">How It Works</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                            Your Journey in Three Simple Steps
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                            Finding your next opportunity has never been easier.
                        </p>
                    </div>

                    <div className="mt-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
                            {timelineSteps.map((step, index) => (
                                <div key={index} className="relative">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-100 dark:bg-gray-700 rounded-full shadow-lg">
                                            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{index + 1}</span>
                                        </div>
                                        <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h3>
                                        <p className="mt-2 text-base text-gray-600 dark:text-gray-300">{step.description}</p>
                                    </div>
                                    {index < timelineSteps.length - 1 && (
                                        <div className="hidden md:block absolute top-8 left-1/2 w-full -translate-x-1/2" aria-hidden="true">
                                            <svg className="w-full h-6 text-indigo-200 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" strokeDasharray="5, 5" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Auth Page Component
const AuthPage = ({ setPage, setUser, authMode }) => {
    const [isLogin, setIsLogin] = useState(authMode === 'login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');
    
    useEffect(() => {
        setIsLogin(authMode === 'login');
        setError('');
    }, [authMode, isLogin]);

    // This function simulates a login/signup.
    const handleAuth = (e) => {
        e.preventDefault();
        setError('');
        if (!isLogin) {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            setUser({
                email: email,
                firstName: firstName,
                lastName: lastName,
                dob: dob
            });
        } else {
             setUser({ email: email });
        }
        setPage('skills');
    };
    
    const handleSocialSignIn = () => {
        // Simulate Social sign-in
        setUser({ email: 'user@example.com', firstName: 'Social', lastName: 'User' });
        setPage('skills');
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                    {isLogin ? 'Sign in to your account' : 'Create a new account'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Or{' '}
                    <a href="#" onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        {isLogin ? 'create an account' : 'sign in instead'}
                    </a>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleAuth}>
                        {!isLogin && (
                            <>
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                        <input id="firstName" name="firstName" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                                    </div>
                                    <div className="w-1/2">
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                                        <input id="lastName" name="lastName" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                                    <input id="dob" name="dob" type="date" required value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                                </div>
                            </>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                            </div>
                        </div>
                        
                        {!isLogin && (
                             <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm Password
                                </label>
                                <div className="mt-1">
                                    <input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
                                </div>
                            </div>
                        )}
                        
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                {isLogin ? 'Sign in' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                             <div>
                                <button onClick={handleSocialSignIn} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <span className="sr-only">Sign in with Google</span>
                                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 48 48">
                                        <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                                    </svg>
                                </button>
                            </div>
                            <div>
                                <button onClick={handleSocialSignIn} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <span className="sr-only">Sign in with GitHub</span>
                                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0020 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Skills and Jobs Page Component
const SkillsPage = ({ user, setSelectedJob }) => {
    const [skills, setSkills] = useState([]);
    const [skillName, setSkillName] = useState('');
    const [confidence, setConfidence] = useState(50);
    const [jobType, setJobType] = useState('All');
    const [matchedJobs, setMatchedJobs] = useState([]);
    
    useEffect(() => {
        // This effect runs when the component mounts and when filters change
        // If no filters are applied, show nothing.
        if (skills.length === 0 && jobType === 'All') {
            setMatchedJobs([]);
            return;
        }

        let filteredJobs = sampleJobs;

        // Filter by job type if not 'All'
        if (jobType !== 'All') {
            filteredJobs = filteredJobs.filter(job => job.type === jobType);
        }

        // Filter by skills if any are present
        if (skills.length > 0) {
            const userSkillMap = new Map(skills.map(s => [s.name.toLowerCase(), s.confidence]));
            filteredJobs = filteredJobs.filter(job => 
                job.requiredSkills.some(reqSkill => {
                    const reqSkillLower = reqSkill.toLowerCase();
                    return userSkillMap.has(reqSkillLower) && userSkillMap.get(reqSkillLower) >= (job.confidenceNeeded || 0);
                })
            );
        }
        
        setMatchedJobs(filteredJobs);

    }, [skills, jobType]);

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (skillName.trim() === '' || skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
            setSkillName('');
            return;
        }
        const newSkill = { name: skillName, confidence: confidence };
        const updatedSkills = [...skills, newSkill];
        setSkills(updatedSkills);
        
        setSkillName('');
        setConfidence(50);
    };

    const handleRemoveSkill = (skillToRemove) => {
        const updatedSkills = skills.filter(skill => skill.name !== skillToRemove.name);
        setSkills(updatedSkills);
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Add and View Skills */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Add a Skill</h2>
                        <form onSubmit={handleAddSkill} className="space-y-4">
                            <div>
                                <label htmlFor="skill" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skill Name (e.g., React, Canva)</label>
                                <input type="text" id="skill" value={skillName} onChange={(e) => setSkillName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" placeholder="Enter a skill" required />
                            </div>
                            <div>
                                <label htmlFor="confidence" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confidence Level: {confidence}%</label>
                                <input 
                                    type="range" 
                                    id="confidence" 
                                    min="0" 
                                    max="100" 
                                    step="10" 
                                    value={confidence} 
                                    onChange={(e) => setConfidence(parseInt(e.target.value))} 
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Skill</button>
                        </form>
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Job Type Preference</h3>
                        <div className="flex justify-around bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                            {['All', 'Remote', 'On-site', 'Hybrid'].map(type => (
                                <label key={type} className={`cursor-pointer px-3 py-1 text-sm rounded-md transition-colors ${jobType === type ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                    <input type="radio" name="jobType" value={type} checked={jobType === type} onChange={(e) => setJobType(e.target.value)} className="sr-only"/>
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Your Skills</h3>
                        {skills.length > 0 ? (
                            <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                                {skills.map(skill => (
                                    <li key={skill.name} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">{skill.name}</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({skill.confidence}%)</span>
                                        </div>
                                        <button onClick={() => handleRemoveSkill(skill)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm">Remove</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">You haven't added any skills yet.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Matched Jobs */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Matched Opportunities</h2>
                        {matchedJobs.length > 0 ? (
                            <div className="space-y-4">
                                {matchedJobs.map(job => (
                                    <div key={job.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedJob(job)}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">{job.title}</h3>
                                                <p className="text-md text-gray-600 dark:text-gray-300">{job.company}</p>
                                            </div>
                                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.type === 'Remote' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : job.type === 'On-site' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>{job.type}</span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{job.description}</p>
                                        <div className="mt-3">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200">Required Skills:</h4>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {job.requiredSkills.map(skill => (
                                                    <span key={skill} className={`px-2 py-1 text-xs rounded-full ${skills.find(s => s.name.toLowerCase() === skill.toLowerCase()) ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }} className="mt-4 inline-block w-full text-center bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 text-sm font-semibold">Apply Now</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 px-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No matches found yet.</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Add skills or change your job type preference to find opportunities.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Footer Component
const Footer = ({ setPage }) => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <p className="text-base text-gray-500 dark:text-gray-400">
                        &copy; 2024 SkillMatch, Inc. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Privacy</a>
                        <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};


// Main App Component
export default function App() {
    const [page, setPage] = useState('home');
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [selectedJob, setSelectedJob] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDarkMode);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const handleLogout = () => {
        setUser(null);
        setPage('home');
    };

    const renderPage = () => {
        switch (page) {
            case 'home':
                return <HomePage setPage={setPage} setSelectedJob={setSelectedJob} />;
            case 'auth':
                return <AuthPage setPage={setPage} setUser={setUser} authMode={authMode} />;
            case 'skills':
                if (user) {
                    return <SkillsPage user={user} setSelectedJob={setSelectedJob} />;
                }
                return <AuthPage setPage={setPage} setUser={setUser} authMode={authMode} />;
            case 'completeProfile':
                 if (user) {
                    return <CompleteProfilePage user={user} profileData={profileData} setProfileData={setProfileData} setPage={setPage} />;
                }
                return <AuthPage setPage={setPage} setUser={setUser} authMode={authMode} />;
            default:
                return <HomePage setPage={setPage} setSelectedJob={setSelectedJob} />;
        }
    };

    return (
        <div className="App bg-white dark:bg-gray-900 flex flex-col min-h-screen">
            <Navbar page={page} setPage={setPage} user={user} handleLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} setAuthMode={setAuthMode} openProfileModal={() => setIsProfileModalOpen(true)} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Footer setPage={setPage} />
            <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            {isProfileModalOpen && <CompleteProfileModal user={user} profileData={profileData} setProfileData={setProfileData} onClose={() => setIsProfileModalOpen(false)} />}
        </div>
    );
}
