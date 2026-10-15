const express = require('express');
const { createInterview, getInterviews, getInterviewById, submitAnswer, completeInterview } = require('../controllers/interviewController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protect, createInterview);
router.get('/', protect, getInterviews);
router.get('/:id', protect, getInterviewById);
router.post('/:id/answer', protect, submitAnswer);
router.post('/:id/complete', protect, completeInterview);

module.exports = router;
