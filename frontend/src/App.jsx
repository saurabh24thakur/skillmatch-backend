import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// --- API Client Setup ---
// This connects to your backend. Ensure the URL and port are correct.
const api = axios.create({
  baseURL: 'https://skillmatch-backend-bked.onrender.com', 
});

// Automatically attaches the user's login token to every API request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- Components ---

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Toggle dark mode"
        >
            {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
        </button>
    );
};

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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Description</h4>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">{job.description}</p>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Required Skills</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {job.requiredSkills.map(skill => (
                                <span key={skill} className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    {skill}
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

const CompleteProfileModal = ({ user, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-full overflow-y-auto">
                <div className="p-6">
                    <h3 className="text-2xl font-bold">Complete Your Profile (Coming Soon)</h3>
                    <p>This feature is not yet connected to the backend.</p>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded-md">Close</button>
                </div>
            </div>
        </div>
    );
};

const Navbar = ({ page, setPage, user, handleLogout, darkMode, setDarkMode, openProfileModal }) => {
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
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer" onClick={() => setPage('home')}>SkillMatch</span>
                    </div>
                    <div className="hidden md:flex items-center">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className={`px-3 py-2 rounded-md text-sm font-medium ${page === 'home' ? 'text-indigo-600 bg-indigo-50 dark:bg-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Home</a>
                            {user && <a href="#" onClick={(e) => { e.preventDefault(); setPage('skills'); }} className={`px-3 py-2 rounded-md text-sm font-medium ${page === 'skills' ? 'text-indigo-600 bg-indigo-50 dark:bg-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>My Skills</a>}
                        </div>
                        <div className="ml-auto flex items-center">
                            {user ? (
                                <div className="ml-4 relative" ref={profileMenuRef}>
                                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex text-sm bg-gray-200 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500">
                                        <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">{user.username.charAt(0).toUpperCase()}</div>
                                    </button>
                                    {isProfileOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                                            <div className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Signed in as <br/><strong className="text-gray-700 dark:text-gray-200">{user.username}</strong></div>
                                            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <button onClick={() => setPage('login')} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Login</button>
                                    <button onClick={() => setPage('signup')} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Sign Up</button>
                                </div>
                            )}
                            <div className="ml-4"><DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const HomePage = ({ setPage }) => {
    const timelineSteps = [
        { title: "Add Your Skills", description: "List your skills, from programming languages to design software." },
        { title: "Get Matched", description: "Our algorithm matches your profile with relevant job opportunities." },
        { title: "Apply & Grow", description: "Apply to your matched roles and start your career journey." }
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
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
                                        <a href="#" onClick={(e) => { e.preventDefault(); setPage('signup'); }} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                                            Get Started
                                        </a>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <a href="#how-it-works" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            <div id="how-it-works" className="py-20 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">How It Works</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">Your Journey in Three Simple Steps</p>
                    </div>
                    <div className="mt-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
                            {timelineSteps.map((step, index) => (
                                <div key={index} className="text-center">
                                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-100 dark:bg-gray-700 rounded-full shadow-lg">
                                        <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{index + 1}</span>
                                    </div>
                                    <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h3>
                                    <p className="mt-2 text-base text-gray-600 dark:text-gray-300">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Footer = ({ setPage }) => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <p className="text-base text-gray-500 dark:text-gray-400">&copy; 2024 SkillMatch, Inc. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Privacy</a>
                        <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const AuthPage = ({ setPage, setUser, authMode }) => {
    const [isLogin, setIsLogin] = useState(authMode === 'login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { setIsLogin(authMode === 'login'); setError(''); }, [authMode]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                const response = await api.post('/user/login', { username: email, password });
                localStorage.setItem('token', response.data.token);
                const userResponse = await api.get('/user/me');
                setUser(userResponse.data.user);
                setPage('skills');
            } else {
                await api.post('/user/signup', { username: email, password, type: userType });
                const response = await api.post('/user/login', { username: email, password });
                localStorage.setItem('token', response.data.token);
                const userResponse = await api.get('/user/me');
                setUser(userResponse.data.user);
                setPage('skills');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">{isLogin ? 'Sign in to your account' : 'Create a new account'}</h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">Or <a href="#" onClick={() => setPage(isLogin ? 'signup' : 'login')} className="font-medium text-indigo-600 hover:text-indigo-500">{isLogin ? 'create an account' : 'sign in instead'}</a></p>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleAuth}>
                        {!isLogin && (
                             <div>
                                <label className="block text-sm font-medium">I am a:</label>
                                <div className="mt-2 flex justify-around"><label className="flex items-center space-x-2"><input type="radio" value="student" checked={userType === 'student'} onChange={(e) => setUserType(e.target.value)} className="h-4 w-4 text-indigo-600"/><span className="text-gray-700 dark:text-gray-300">Student</span></label><label className="flex items-center space-x-2"><input type="radio" value="recruiter" checked={userType === 'recruiter'} onChange={(e) => setUserType(e.target.value)} className="h-4 w-4 text-indigo-600"/><span className="text-gray-700 dark:text-gray-300">Recruiter</span></label></div>
                            </div>
                        )}
                        <div><label htmlFor="email">Email (Username)</label><input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" /></div>
                        <div><label htmlFor="password">Password</label><input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" /></div>
                        {!isLogin && (<div><label htmlFor="confirmPassword">Confirm Password</label><input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" /></div>)}
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <div><button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}</button></div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const SkillsPage = ({ user, setSelectedJob }) => {
    const [mySkills, setMySkills] = useState([]);
    const [newSkills, setNewSkills] = useState('');
    const [matchedJobs, setMatchedJobs] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(true);
    const [loadingJobs, setLoadingJobs] = useState(false);

    const fetchMySkills = async () => {
        setLoadingSkills(true);
        try {
            const response = await api.get('/skills/my');
            setMySkills(response.data.skills);
        } catch (error) {
            console.error("Failed to fetch skills:", error);
            setMySkills([]);
        } finally {
            setLoadingSkills(false);
        }
    };
    
    useEffect(() => { fetchMySkills(); }, []);

    const handleAddSkills = async (e) => {
        e.preventDefault();
        if (!newSkills.trim()) return;
        try {
            await api.post('/skills/upload', { skills: newSkills });
            setNewSkills('');
            fetchMySkills();
        } catch (error) {
            console.error("Failed to upload skills:", error);
            alert("There was an error uploading your skills. Please try again.");
        }
    };
    
    const findMatchingJobs = async () => {
        if (mySkills.length === 0) {
            alert("Please add some skills before searching for matches.");
            return;
        }
        setLoadingJobs(true);
        try {
            const response = await api.get('/skills/find-courses-by-match');
            const adaptedJobs = response.data.matchingCourses.map(course => ({
                id: course.courseId || course.jobTitle,
                title: course.jobTitle,
                company: `Match: ${course.matchPercent}%`,
                description: `You are missing: ${course.missingSkills.join(', ') || 'None'}.`,
                requiredSkills: course.requiredSkills,
                type: 'Remote'
            }));
            setMatchedJobs(adaptedJobs);
        } catch (error) {
            console.error("Failed to fetch matching jobs:", error);
            alert("Could not find matching jobs. Please try again later.");
        } finally {
            setLoadingJobs(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Add Your Skills</h2>
                        <form onSubmit={handleAddSkills} className="space-y-4">
                            <div><label htmlFor="skills">Enter skills (comma/space-separated)</label><textarea id="skills" rows="3" value={newSkills} onChange={(e) => setNewSkills(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="e.g., React Python"/></div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md">Add Skills</button>
                        </form>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold">Your Skills</h3>
                        {loadingSkills ? (<p className="mt-4 text-gray-500">Loading your skills...</p>) : (mySkills.length > 0 ? (<ul className="mt-4 flex flex-wrap gap-2">{mySkills.map(skill => (<li key={skill} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">{skill}</li>))}</ul>) : (<p className="mt-4 text-gray-500">No skills added yet.</p>))}
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold">Matched Opportunities</h2><button onClick={findMatchingJobs} disabled={loadingJobs} className="bg-green-500 text-white py-2 px-4 rounded-md disabled:opacity-50">{loadingJobs ? 'Finding...' : 'Find Matches'}</button></div>
                        {matchedJobs.length > 0 ? (<div className="space-y-4">{matchedJobs.map(job => (<div key={job.id} className="border p-4 rounded-lg hover:shadow-lg cursor-pointer" onClick={() => setSelectedJob(job)}><h3 className="text-xl font-semibold text-indigo-700">{job.title}</h3><p>{job.company}</p><p className="mt-2 text-sm text-gray-500">{job.description}</p></div>))}</div>) : (<div className="text-center py-10 rounded-lg bg-gray-50 dark:bg-gray-700"><h3 className="text-lg font-medium">Your job matches will appear here.</h3><p className="mt-1 text-sm text-gray-500">Add skills and click "Find Matches".</p></div>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoginPage = ({ setPage, setUser }) => <AuthPage setPage={setPage} setUser={setUser} authMode="login" />;
const SignupPage = ({ setPage, setUser }) => <AuthPage setPage={setPage} setUser={setUser} authMode="signup" />;

export default function App() {
    const [page, setPage] = useState('home');
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [loadingApp, setLoadingApp] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/user/me');
                    setUser(response.data.user);
                } catch (error) { localStorage.removeItem('token'); }
            }
            setLoadingApp(false);
        };
        checkLoggedIn();
    }, []);

    useEffect(() => {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDarkMode);
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        setPage('home');
    };

    const renderPage = () => {
        if (loadingApp) { return <div className="flex justify-center items-center h-screen">Loading...</div>; }
        if (user) {
            switch (page) {
                case 'skills': return <SkillsPage user={user} setSelectedJob={setSelectedJob} />;
                case 'home': default: return <HomePage setPage={setPage} />;
            }
        }
        switch (page) {
            case 'login': return <LoginPage setPage={setPage} setUser={setUser} />;
            case 'signup': return <SignupPage setPage={setPage} setUser={setUser} />;
            case 'home': default: return <HomePage setPage={setPage} />;
        }
    };

    return (
        <div className="App bg-white dark:bg-gray-900 flex flex-col min-h-screen">
            <Navbar page={page} setPage={setPage} user={user} handleLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} openProfileModal={() => setIsProfileModalOpen(true)} />
            <main className="flex-grow">{renderPage()}</main>
            <Footer setPage={setPage} />
            <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            {isProfileModalOpen && <CompleteProfileModal user={user} onClose={() => setIsProfileModalOpen(false)} />}
        </div>
    );
}
