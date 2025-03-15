import express from 'express';
import { YoutubeTranscript } from 'youtube-transcript';



const app = express();


app.get('/', (req, res) => {
  res.send('Hello World');
});


app.get('/transcript', async (req, res) => {
  const videoId = 'https://www.youtube.com/watch?v=btk79A7uopg&t=52s';

  YoutubeTranscript.fetchTranscript(videoId).then(transcript => {
    const text = transcript.map(t => t.text).join(' ');
    console.log(text);
  });
});







app.listen(3000, () => {
  console.log('API is running at http://localhost:3000');
});