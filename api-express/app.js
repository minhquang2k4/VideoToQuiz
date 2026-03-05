import express from 'express';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
const genAI = new GoogleGenerativeAI('('YOUR_API_KEY_HERE');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


app.use(express.json());
 
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use(cors());

app.post('/transcript', async (req, res) => {
  const { videoUrl } = req.body;

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    const text = transcript.map(t => t.text).join(' ');

    const summaryPrompt = `Tóm tắt nội dung chính của văn bản sau: ${text}`;
    const result = await model.generateContent(summaryPrompt);
    const summary = result.response.text();

    const template = `
    {
      "question": "nội dung câu hỏi",
      "options": ["nội dung đáp án A", "nội dung đáp án B", "nội dung đáp án C", "nội dung đáp án D"],
      "correctAnswer": "0"
    }`;
    const quizPrompt = `Chỉ xuất dữ liệu định dạng theo kiểu Json theo mẫu chính xác sau ${template}. Tạo 5 câu hỏi trắc nghiệm về nội dung ${text}`;
    const quizResult = await model.generateContent(quizPrompt);
    // console.log("🚀 ~ app.post ~ quizPrompt:", quizPrompt)
    let quizText = quizResult.response.text();

    const startIndex = quizText.indexOf('[');
    const endIndex = quizText.lastIndexOf(']') + 1;
    quizText = quizText.substring(startIndex, endIndex);

    const quizs = JSON.parse(quizText);

    res.status(200).json({
      summary: summary,
      quizs: quizs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transcript or generate summary' });
  }
});

app.listen(8000, () => {
  console.log('API is running at http://localhost:8000');
});
