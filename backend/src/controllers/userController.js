import User from '../models/User.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found', code: 'NOT_FOUND' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, education, degree, branch, graduationYear, skills, targetRole, experienceLevel } = req.body;

    let skillsArray = skills;
    if (typeof skills === 'string') {
      skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        education,
        degree,
        branch,
        graduationYear,
        skills: skillsArray,
        targetRole,
        experienceLevel
      },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};
