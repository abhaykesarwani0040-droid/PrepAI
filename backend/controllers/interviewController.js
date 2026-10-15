const Interview = require('../models/Interview');
const { generateQuestions, evaluateAnswer } = require('../services/geminiService');

const createInterview = async (req, res) => {
  const { role, type, difficulty } = req.body;
  try {
    const generatedQuestions = await generateQuestions(role, type, difficulty);
    const interview = await Interview.create({
      userId: req.user._id,
      role,
      type,
      difficulty,
      questions: generatedQuestions.map((q) => ({ questionText: q }))
    });
    res.status(201).json(interview);
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ message: error.message || 'Failed to generate interview questions' });
  }
};

const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitAnswer = async (req, res) => {
  const { questionIndex, answer } = req.body;
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    const question = interview.questions[questionIndex];
    if (!question) return res.status(400).json({ message: 'Invalid question index' });

    const trimmedAnswer = typeof answer === 'string' ? answer.trim() : '';

    let evaluation;
    if (!trimmedAnswer) {
      evaluation = {
        score: 0,
        correctness: 'No answer provided.',
        strengths: 'None.',
        missingPoints: 'The question was left blank without an answer.',
        improvementSuggestions: 'Attempt every question to receive partial credit.',
        sampleAnswer: 'N/A'
      };
    } else {
      evaluation = await evaluateAnswer(question.questionText, trimmedAnswer);
    }

    question.userAnswer = trimmedAnswer || 'No answer provided.';
    question.evaluation = evaluation;

    await interview.save();
    res.json(interview);
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: error.message || 'Failed to evaluate answer' });
  }
};

const completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    let totalScore = 0;

    interview.questions.forEach((q) => {
      if (!q.evaluation || typeof q.evaluation.score !== 'number') {
        q.userAnswer = q.userAnswer || 'No answer provided.';
        q.evaluation = {
          score: 0,
          correctness: 'No answer provided.',
          strengths: 'None.',
          missingPoints: 'The question was not answered during the session.',
          improvementSuggestions: 'Be sure to attempt every question to demonstrate your understanding.',
          sampleAnswer: 'Review fundamental concepts related to this topic.'
        };
      }
      totalScore += q.evaluation.score;
    });

    const questionCount = interview.questions.length;
    interview.overallScore = questionCount > 0 ? Math.round(totalScore / questionCount) : 0;
    interview.status = 'Completed';
    await interview.save();

    res.json(interview);
  } catch (error) {
    console.error('Error completing interview:', error);
    res.status(500).json({ message: error.message || 'Failed to complete interview' });
  }
};

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById,
  submitAnswer,
  completeInterview
};
