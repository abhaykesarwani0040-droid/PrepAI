const { GoogleGenerativeAI } = require('@google/generative-ai');

const CANDIDATE_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-3.5-flash'];

const generateWithFallback = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in backend environment variables');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch (err) {
        lastError = err;
        console.warn(`Gemini model ${modelName} (attempt ${attempt}) error: ${err.message}`);
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }

  throw lastError || new Error('All Gemini models failed to respond');
};

const cleanJsonString = (text) => {
  let cleaned = text.trim();
  // Strip code fences if present
  cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();

  // If there's surrounding text, attempt to isolate the first JSON structure
  const firstBracket = cleaned.indexOf('[');
  const firstBrace = cleaned.indexOf('{');

  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    const lastBracket = cleaned.lastIndexOf(']');
    if (lastBracket !== -1) {
      cleaned = cleaned.substring(firstBracket, lastBracket + 1);
    }
  } else if (firstBrace !== -1) {
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
  }

  return cleaned;
};

const generateQuestions = async (role, type, difficulty) => {
  try {
    const prompt = `You are an expert interviewer. Generate exactly 3 interview questions for a ${difficulty} level ${role} role. The interview type is ${type}. 
Return the response ONLY as a raw JSON array of strings. Do not include markdown formatting or backticks. Example: ["Question 1?", "Question 2?", "Question 3?"]`;

    const text = await generateWithFallback(prompt);
    const cleaned = cleanJsonString(text);

    let questions;
    try {
      questions = JSON.parse(cleaned);
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
    } catch (e) {
      console.error('Failed to parse Gemini response as JSON array:', text);
      throw new Error('Invalid response format from Gemini');
    }

    return questions;
  } catch (error) {
    console.error('Gemini Question Generation Error:', error);
    throw error;
  }
};

const evaluateAnswer = async (question, answer) => {
  try {
    const prompt = `You are an expert technical interviewer evaluating a candidate's answer.
Question: "${question}"
Candidate's Answer: "${answer}"

Evaluate the answer and return ONLY a raw JSON object with the following keys exactly:
- score: A number from 0 to 100
- correctness: A brief sentence on whether it's correct.
- strengths: What the candidate did well.
- missingPoints: What crucial information was missed.
- improvementSuggestions: How to improve the answer.
- sampleAnswer: A highly professional and complete example answer.

Do not include markdown blocks like \`\`\`json. Return just the JSON string.`;

    const text = await generateWithFallback(prompt);
    const cleaned = cleanJsonString(text);

    let evaluation;
    try {
      evaluation = JSON.parse(cleaned);
      evaluation.score = typeof evaluation.score === 'number' ? evaluation.score : 0;
      evaluation.correctness = evaluation.correctness || 'Evaluation completed.';
      evaluation.strengths = evaluation.strengths || 'Answer received.';
      evaluation.missingPoints = evaluation.missingPoints || 'None specified.';
      evaluation.improvementSuggestions = evaluation.improvementSuggestions || 'Review topic fundamentals.';
      evaluation.sampleAnswer = evaluation.sampleAnswer || 'N/A';
      return evaluation;
    } catch (e) {
      console.error('Failed to parse Gemini evaluation JSON:', text);
      throw new Error('Invalid evaluation format from Gemini');
    }
  } catch (error) {
    console.error('Gemini Answer Evaluation Error:', error);
    throw error;
  }
};

module.exports = { generateQuestions, evaluateAnswer };
