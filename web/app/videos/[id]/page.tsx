"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ArrowLeft, Loader2 } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho video
interface Quiz {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Note {
  noteID: number;
  content: string;
  createdAt: string;
}
interface VideoData {
  videoID: number;
  title: string;
  url: string;
  uploadDate: string;
  summary?: string;
  quizs?: Quiz[];
  notes?: Note[];
}

// Hàm để lấy ID video từ URL YouTube
const getYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Hàm để định dạng ngày tháng
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

// API URL - trong ứng dụng thực tế, bạn nên đặt URL này trong biến môi trường
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function VideoDetailPage() {
  const params = useParams();
  const videoId = params.id as string;

  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [textNote, setTextNote] = useState<string>("");

  // Fetch dữ liệu video từ API
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Kiểm tra token
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem video.");
          setLoading(false);
          return;
        }

        // Gọi API để lấy dữ liệu video
        const response = await axios.get(`${apiUrl}/Video/${videoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Lưu dữ liệu video vào state
        console.log("🚀 ~ fetchVideoData ~ response.data:", response.data);
        setVideo(response.data);

        // Reset user answers
        if (response.data.quizs) {
          setUserAnswers(Array(response.data.quizs.length).fill(-1));
        }

        setShowResults(false);
      } catch (err) {
        console.error("Error fetching video data:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu video. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleQuizSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!video || !video.quizs) return 0;

    return userAnswers.reduce((score, answer, index) => {
      return answer === Number.parseInt(video.quizs[index].correctAnswer)
        ? score + 1
        : score;
    }, 0);
  };

  const resetQuiz = () => {
    if (video && video.quizs) {
      setUserAnswers(Array(video.quizs.length).fill(-1));
      setShowResults(false);
    }
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-semibold">Đang tải video...</h2>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive" className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/videos">Quay lại danh sách video</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo khi không tìm thấy video
  if (!video) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Video không tồn tại</h1>
        <p className="text-muted-foreground mb-8">
          Video bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild>
          <Link href="/videos">Quay lại danh sách video</Link>
        </Button>
      </div>
    );
  }

  const handleAddNote = async () => {
    if (textNote.trim() === "") {
      alert("Vui lòng nhập ghi chú trước khi lưu.");
      return;
    }

    // Gọi API để thêm ghi chú
    const response = await axios.post(
      `${apiUrl}/Video/note`,
      {
        videoID: video.videoID,
        content: textNote,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      setVideo((prevVideo) => {
        if (prevVideo) {
          return {
            ...prevVideo,
            notes: [...(prevVideo.notes || []), response.data],
          };
        }
        return prevVideo;
      });
      setTextNote(""); // Reset ghi chú sau khi lưu
    } else {
      alert("Có lỗi xảy ra khi lưu ghi chú. Vui lòng thử lại.");
    }
  };

  // Lấy YouTube video ID từ URL
  const youtubeVideoId = getYouTubeVideoId(video.url);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/videos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{video.title}</CardTitle>
            <CardDescription>
              Ngày tạo: {formatDate(video.uploadDate)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full">
              {youtubeVideoId && (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            {video.summary && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Tóm tắt nội dung</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {video.summary}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="quiz" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quiz">Câu hỏi trắc nghiệm</TabsTrigger>
            <TabsTrigger value="notes">Ghi chú</TabsTrigger>
          </TabsList>
          <TabsContent value="quiz" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trắc nghiệm kiểm tra kiến thức</CardTitle>
                <CardDescription>
                  {video.quizs && video.quizs.length > 0
                    ? `Trả lời ${video.quizs.length} câu hỏi dưới đây để kiểm tra kiến thức của bạn`
                    : "Chưa có câu hỏi nào cho video này"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {video.quizs && video.quizs.length > 0 ? (
                  <div className="space-y-6">
                    {video.quizs.map((quiz, quizIndex) => (
                      <div key={quizIndex} className="space-y-3">
                        <h3 className="font-medium">{quiz.question}</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {quiz.options.map((option, optionIndex) => (
                            <Button
                              key={optionIndex}
                              variant={
                                userAnswers[quizIndex] === optionIndex
                                  ? "default"
                                  : "outline"
                              }
                              className={`justify-start text-left ${
                                showResults &&
                                (optionIndex ===
                                Number.parseInt(quiz.correctAnswer)
                                  ? "bg-green-100 hover:bg-green-100 border-green-500"
                                  : userAnswers[quizIndex] === optionIndex
                                  ? "bg-red-100 hover:bg-red-100 border-red-500"
                                  : "")
                              }`}
                              onClick={() =>
                                !showResults &&
                                handleAnswerSelect(quizIndex, optionIndex)
                              }
                              disabled={showResults}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                        {showResults &&
                          userAnswers[quizIndex] !==
                            Number.parseInt(quiz.correctAnswer) && (
                            <p className="text-sm text-red-500">
                              Đáp án đúng:{" "}
                              {
                                quiz.options[
                                  Number.parseInt(quiz.correctAnswer)
                                ]
                              }
                            </p>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Chưa có câu hỏi nào cho video này. Vui lòng thêm câu hỏi
                      để bắt đầu.
                    </p>
                  </div>
                )}
              </CardContent>
              {video.quizs && video.quizs.length > 0 && (
                <CardFooter className="flex justify-between">
                  {!showResults ? (
                    <Button
                      onClick={handleQuizSubmit}
                      disabled={userAnswers.includes(-1)}
                    >
                      Nộp bài
                    </Button>
                  ) : (
                    <>
                      <Alert className="w-full">
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle>Kết quả</AlertTitle>
                        <AlertDescription>
                          Bạn đã trả lời đúng {calculateScore()}/
                          {video.quizs.length} câu hỏi
                        </AlertDescription>
                      </Alert>
                      <Button onClick={resetQuiz} className="ml-4">
                        Làm lại
                      </Button>
                    </>
                  )}
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
                <CardDescription>
                  Ghi chú cá nhân của bạn về video này
                </CardDescription>
              </CardHeader>
              <CardContent>
                {video.notes && video.notes.length > 0 && (
                  <div className="space-y-4">
                    {video.notes.map((note) => (
                      <div key={note.noteID} className="p-4 border rounded-md">
                        <p className="text-sm text-muted-foreground mb-2">
                          Ngày tạo: {formatDate(note.createdAt)}
                        </p>
                        <p className="whitespace-pre-line">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <textarea
                  className="w-full min-h-[200px] p-4 border rounded-md"
                  placeholder="Nhập ghi chú của bạn ở đây..."
                  value={textNote}
                  onChange={(e) => setTextNote(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddNote}>Lưu ghi chú</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
