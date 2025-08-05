import fs from 'fs';
import path from 'path';

// Path to userSkills.json
const userSkillsFile = path.resolve('userSkills.json');
// Path to jobs.json
const jobsFile = path.resolve('jobs.json');

// Helper to read user skills from file
function readUserSkillsFromFile() {
  try {
    if (fs.existsSync(userSkillsFile)) {
      const data = fs.readFileSync(userSkillsFile, 'utf-8');
      return data ? JSON.parse(data) : [];
    }
    return [];
  } catch (err) {
    return [];
  }
}

// Helper to write user skills to file
function writeUserSkillsToFile(userSkills) {
  fs.writeFileSync(userSkillsFile, JSON.stringify(userSkills, null, 2));
}

// Helper to read jobs from file
function readJobsFromFile() {
  try {
    if (fs.existsSync(jobsFile)) {
      const data = fs.readFileSync(jobsFile, 'utf-8');
      return data ? JSON.parse(data) : {};
    }
    return {};
  } catch (err) {
    return {};
  }
}

// Upload skills controller (requires auth middleware)
export const uploadSkills = (req, res) => {
  const { skills } = req.body;
  const userId = req.user?.id; // req.user is set by auth middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!skills || typeof skills !== 'string') {
    return res.status(400).json({ message: 'Skills string is required' });
  }

  // Split by comma or space, trim, and filter out empty strings
  const skillsArray = skills
    .split(/[, ]+/)
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);

  // Read existing user skills
  const userSkills = readUserSkillsFromFile();
  const userIndex = userSkills.findIndex(u => u.userId === userId);

  if (userIndex !== -1) {
    // Update existing user's skills (merge and remove duplicates)
    const mergedSkills = Array.from(new Set([...userSkills[userIndex].skills, ...skillsArray]));
    userSkills[userIndex].skills = mergedSkills;
  } else {
    // Add new user with skills
    userSkills.push({ userId, skills: skillsArray });
  }

  writeUserSkillsToFile(userSkills);

  res.status(201).json({ message: 'Skills uploaded', skills: skillsArray });
};

// Get skills for the logged-in user
export const getMySkills = (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const userSkills = readUserSkillsFromFile();
  const user = userSkills.find(u => u.userId === userId);
  res.json({ skills: user ? user.skills : [] });
};

// (Optional) Get all users' skills (admin use)
export const getAllUserSkills = (req, res) => {
  const userSkills = readUserSkillsFromFile();
  res.json({ userSkills });
};

// Find courses by 60-100% skill match for the logged-in user
export const getCoursesBySkillMatch = (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Get the user's skills
  const userSkills = readUserSkillsFromFile();
  const user = userSkills.find(u => u.userId === userId);
  const skills = user ? user.skills : [];

  if (!skills || skills.length === 0) {
    return res.status(400).json({ message: 'No skills found for user' });
  }

  const jobs = readJobsFromFile();
  const userSkillsLower = skills.map(s => s.toLowerCase());

  const matchingCourses = Object.entries(jobs)
    .map(([jobTitle, jobData]) => {
      const requiredSkills = jobData.requiredSkills;
      const matchedSkills = requiredSkills.filter(skill =>
        userSkillsLower.includes(skill.toLowerCase())
      );
      const missingSkills = requiredSkills.filter(skill =>
        !userSkillsLower.includes(skill.toLowerCase())
      );
      const matchPercent = (matchedSkills.length / requiredSkills.length) * 100;

      // Only include if match is between 60% and 100% (inclusive)
      if (matchPercent >= 60 && matchPercent <= 100) {
        return {
          jobTitle,
          courseId: jobData.courseId,
          requiredSkills,
          matchedSkills,
          missingSkills,
          matchPercent: Math.round(matchPercent)
        };
      }
      return null;
    })
    .filter(Boolean); // Remove nulls

  res.json({ matchingCourses });
};