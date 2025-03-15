import express, { json } from 'express';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const genAI = new GoogleGenerativeAI('AIzaSyB3vuKdE8o5acHk5RXXNLCs4FvwGGcBZJ0');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/transcript', async (req, res) => {
  const { videoId } = req.body;

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const text = transcript.map(t => t.text).join(' ');

    const summaryPrompt = `Tóm tắt nội dung chính của văn bản sau: ${text}`;
    const result = await model.generateContent(summaryPrompt);
    const summary = result.response.text();

    const template = `
    {
      "question": "nội dung câu hỏi",
      "answerA": "nội dung đáp án A",
      "answerB": "nội dung đáp án B",
      "answerC": "nội dung đáp án C",
      "answerD": "nội dung đáp án D",
      "correctAnswer": "answerB"
    }`;
    const quizPrompt = `Chỉ xuất dữ liệu định dạng theo kiểu Json theo mẫu chính xác sau ${template}. Tạo 5 câu hỏi trắc nghiệm về nội dung ${text}`;
    const quizResult = await model.generateContent(quizPrompt);
    // console.log("🚀 ~ app.post ~ quizPrompt:", quizPrompt)
    let quizText = quizResult.response.text();

    const startIndex = quizText.indexOf('[');
    const endIndex = quizText.lastIndexOf(']') + 1;
    quizText = quizText.substring(startIndex, endIndex);

    const quizs = JSON.parse(quizText);

    res.json({
      summary: summary,
      quizs: quizs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transcript or generate summary' });
  }
});

app.listen(3000, () => {
  console.log('API is running at http://localhost:3000');
});