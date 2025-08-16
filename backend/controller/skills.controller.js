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
// ... other functions ...

// Upload skills controller (requires auth middleware)
export const uploadSkills = (req, res) => {
  const { skills } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!skills || typeof skills !== 'string') {
    return res.status(400).json({ message: 'Skills string is required' });
  }

  // --- THIS IS THE FIX ---
  // Change the split from /[, ]+/ to just /,/
  // This will only split by commas and ignore spaces within skill names.
  const skillsArray = skills
    .split(/,/) // <<-- THE ONLY CHANGE IS HERE
    .map(skill => skill.trim()) // .trim() will remove leading/trailing spaces
    .filter(skill => skill.length > 0);
  // --- END OF FIX ---


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

// ... other functions ...

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
  // --- START DEBUGGING ---
  console.log("\n=============================================");
  console.log("Starting getCoursesBySkillMatch function...");

  const userId = req.user?.id;
  console.log(`Step 1: Authenticated User ID is: ${userId}`);
  
  if (!userId) {
    console.log("   [FAIL] No user ID found. Aborting.");
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const allUserSkills = readUserSkillsFromFile();
  const userSkillObject = allUserSkills.find(u => u.userId === userId);
  const userSkills = userSkillObject ? userSkillObject.skills : [];
  
  console.log(`Step 2: User's skills from userSkills.json are: [${userSkills.join(', ')}]`);
  
  if (!userSkills || userSkills.length === 0) {
    console.log("   [FAIL] User has no skills. Returning empty array.");
    return res.json({ matchingCourses: [] });
  }

  const jobsData = readJobsFromFile();
  console.log("Step 3: Data loaded from jobs.json:");
  console.log(JSON.stringify(jobsData, null, 2)); // Print the entire jobs file content

  if (Object.keys(jobsData).length === 0) {
      console.log("   [FAIL] jobs.json is empty or not a valid object. Returning empty array.");
      return res.json({ matchingCourses: [] });
  }

  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  console.log(`Step 4: User skills converted to lowercase: [${userSkillsLower.join(', ')}]`);

  console.log("Step 5: Starting to loop through each job to check for matches...");
  const matchingCourses = Object.entries(jobsData)
    .map(([jobTitle, jobData]) => {
      console.log(`\n   - Checking job: "${jobTitle}"`);
      
      const requiredSkills = jobData.requiredSkills || [];
      console.log(`     Required skills: [${requiredSkills.join(', ')}]`);
      
      const matchedSkills = requiredSkills.filter(reqSkill =>
        userSkillsLower.includes(reqSkill.toLowerCase())
      );
      console.log(`     Matched skills: [${matchedSkills.join(', ')}]`);

      if (requiredSkills.length === 0) {
        console.log("     Result: Skipping job (no required skills).");
        return null;
      }
      
      const matchPercent = (matchedSkills.length / requiredSkills.length) * 100;
      console.log(`     Match Percentage: ${matchPercent.toFixed(2)}%`);
      
      if (matchPercent >= 60) {
        console.log("     Result: MATCH FOUND! (>= 60%)");
        // ... (return object logic is fine)
        const missingSkills = requiredSkills.filter(reqSkill => !userSkillsLower.includes(reqSkill.toLowerCase()));
        return { jobTitle, courseId: jobData.courseId, requiredSkills, matchedSkills, missingSkills, matchPercent: Math.round(matchPercent) };
      } else {
        console.log("     Result: No match (< 60%).");
        return null;
      }
    })
    .filter(Boolean);

  console.log("\nStep 6: Final list of matched courses being sent to frontend:");
  console.log(JSON.stringify(matchingCourses, null, 2));
  console.log("=============================================\n");
  // --- END DEBUGGING ---

  res.json({ matchingCourses });
};