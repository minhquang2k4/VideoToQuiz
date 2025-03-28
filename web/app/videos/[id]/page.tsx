"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, ArrowLeft } from "lucide-react"

// Dữ liệu mẫu cho video
const sampleVideos = [
  {
    videoID: 1,
    title: "Con Tro c++",
    url: "https://www.youtube.com/watch?v=btk79A7uopg",
    uploadDate: "2025-03-28T17:47:30.84",
  },
  {
    videoID: 2,
    title: "OOP trong java",
    url: "https://www.youtube.com/watch?v=qwPvkhemvHA",
    uploadDate: "2025-03-28T17:58:51.71",
  },
]

// Dữ liệu mẫu cho câu hỏi
const sampleQuestions = {
  "1": [
    {
      question: "Con trỏ trong C++ là gì?",
      options: [
        "Một biến lưu trữ địa chỉ của biến khác",
        "Một biến lưu trữ giá trị của biến khác",
        "Một hàm đặc biệt trong C++",
        "Một kiểu dữ liệu chỉ có trong C++",
      ],
      correctAnswer: 0,
    },
    {
      question: "Cú pháp nào dùng để khai báo con trỏ trong C++?",
      options: ["int ptr;", "int *ptr;", "int &ptr;", "pointer int ptr;"],
      correctAnswer: 1,
    },
    {
      question: "Toán tử nào được sử dụng để lấy địa chỉ của một biến?",
      options: ["*", "&", "#", "@"],
      correctAnswer: 1,
    },
    {
      question: "Toán tử nào được sử dụng để truy cập giá trị tại địa chỉ mà con trỏ trỏ tới?",
      options: ["*", "&", "->", "."],
      correctAnswer: 0,
    },
    {
      question: "Giá trị mặc định của con trỏ khi không được khởi tạo là gì?",
      options: ["0", "NULL", "Giá trị rác (garbage value)", "Không có giá trị mặc định"],
      correctAnswer: 2,
    },
  ],
  "2": [
    {
      question: "OOP là viết tắt của?",
      options: [
        "Object Oriented Programming",
        "Object Oriented Protocol",
        "Object Oriented Process",
        "Object Oriented Procedure",
      ],
      correctAnswer: 0,
    },
    {
      question: "Đâu là một trong những đặc điểm của OOP?",
      options: ["Procedural programming", "Functional programming", "Encapsulation", "Linear programming"],
      correctAnswer: 2,
    },
    {
      question: "Trong Java, từ khóa nào được sử dụng để tạo một đối tượng mới?",
      options: ["create", "new", "this", "instance"],
      correctAnswer: 1,
    },
    {
      question: "Tính kế thừa trong OOP cho phép làm gì?",
      options: [
        "Tạo nhiều đối tượng cùng lúc",
        "Một lớp có thể sử dụng lại thuộc tính và phương thức của lớp khác",
        "Ẩn dữ liệu khỏi người dùng",
        "Tạo nhiều phiên bản của cùng một phương thức",
      ],
      correctAnswer: 1,
    },
    {
      question: "Trong Java, một lớp có thể kế thừa từ bao nhiêu lớp?",
      options: ["Không giới hạn", "Chỉ một lớp", "Tối đa hai lớp", "Tối đa năm lớp"],
      correctAnswer: 1,
    },
  ],
}

// Hàm để lấy ID video từ URL YouTube
const getYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

// Hàm để định dạng ngày tháng
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })
}

export default function VideoDetailPage() {
  const params = useParams()
  const videoId = params.id as string

  // Tìm video theo ID
  const video = sampleVideos.find((v) => v.videoID.toString() === videoId)

  // Lấy câu hỏi cho video này
  const questions = sampleQuestions[videoId as keyof typeof sampleQuestions] || []

  const [userAnswers, setUserAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[questionIndex] = optionIndex
    setUserAnswers(newAnswers)
  }

  const handleQuizSubmit = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return answer === questions[index].correctAnswer ? score + 1 : score
    }, 0)
  }

  const resetQuiz = () => {
    setUserAnswers(Array(questions.length).fill(-1))
    setShowResults(false)
  }

  if (!video) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Video không tồn tại</h1>
        <p className="text-muted-foreground mb-8">Video bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button asChild>
          <Link href="/videos">Quay lại danh sách video</Link>
        </Button>
      </div>
    )
  }

  // Lấy YouTube video ID từ URL
  const youtubeVideoId = getYouTubeVideoId(video.url)

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
            <CardDescription>Ngày tạo: {formatDate(video.uploadDate)}</CardDescription>
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
                  Trả lời {questions.length} câu hỏi dưới đây để kiểm tra kiến thức của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {questions.length > 0 ? (
                  <div className="space-y-6">
                    {questions.map((quiz, quizIndex) => (
                      <div key={quizIndex} className="space-y-3">
                        <h3 className="font-medium">{quiz.question}</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {quiz.options.map((option, optionIndex) => (
                            <Button
                              key={optionIndex}
                              variant={userAnswers[quizIndex] === optionIndex ? "default" : "outline"}
                              className={`justify-start text-left ${
                                showResults &&
                                (optionIndex === quiz.correctAnswer
                                  ? "bg-green-100 hover:bg-green-100 border-green-500"
                                  : userAnswers[quizIndex] === optionIndex
                                    ? "bg-red-100 hover:bg-red-100 border-red-500"
                                    : "")
                              }`}
                              onClick={() => !showResults && handleAnswerSelect(quizIndex, optionIndex)}
                              disabled={showResults}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                        {showResults && userAnswers[quizIndex] !== quiz.correctAnswer && (
                          <p className="text-sm text-red-500">Đáp án đúng: {quiz.options[quiz.correctAnswer]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Chưa có câu hỏi nào cho video này. Vui lòng thêm câu hỏi để bắt đầu.
                    </p>
                  </div>
                )}
              </CardContent>
              {questions.length > 0 && (
                <CardFooter className="flex justify-between">
                  {!showResults ? (
                    <Button onClick={handleQuizSubmit} disabled={userAnswers.includes(-1)}>
                      Nộp bài
                    </Button>
                  ) : (
                    <>
                      <Alert className="w-full">
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle>Kết quả</AlertTitle>
                        <AlertDescription>
                          Bạn đã trả lời đúng {calculateScore()}/{questions.length} câu hỏi
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
                <CardDescription>Ghi chú cá nhân của bạn về video này</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full min-h-[200px] p-4 border rounded-md"
                  placeholder="Nhập ghi chú của bạn ở đây..."
                />
              </CardContent>
              <CardFooter>
                <Button>Lưu ghi chú</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

