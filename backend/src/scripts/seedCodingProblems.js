import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CodingProblem from '../models/CodingProblem.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../../.env') });

const problems = [
  {
    role: 'Software Engineer',
    skill: 'general',
    difficulty: 'easy',
    title: 'Two Sum',
    problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    starterCode: 'function twoSum(nums, target) {\n  // Write your code here\n}\n',
    testCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' }
    ]
  },
  {
    role: 'Frontend Engineer',
    skill: 'javascript',
    difficulty: 'easy',
    title: 'Valid Palindrome',
    problemStatement: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.',
    starterCode: 'function isPalindrome(s) {\n  // Write your code here\n}\n',
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
      { input: '"race a car"', expectedOutput: 'false' }
    ]
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await CodingProblem.deleteMany();
    await CodingProblem.insertMany(problems);
    console.log('Seeded coding problems successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
