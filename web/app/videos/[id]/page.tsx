"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { InfoIcon, ArrowLeft } from "lucide-react";

// Dữ liệu mẫu cho video chi tiết
const videoDetails = {
  "1": {
    id: "1",
    title: "Giới thiệu về Next.js 13",
    videoId: "_w0Ikk4JY7U",
    description:
      "Next.js 13 giới thiệu nhiều tính năng mới và cải tiến đáng kể so với các phiên bản trước. Trong video này, chúng ta sẽ tìm hiểu về App Router, Server Components, và nhiều tính năng khác giúp cải thiện hiệu suất và trải nghiệm phát triển.",
    questions: [
      {
        question: "Next.js 13 giới thiệu cấu trúc thư mục mới nào?",
        options: ["pages/", "src/pages/", "app/", "routes/"],
        correctAnswer: 2,
      },
      {
        question: "Server Components là gì?",
        options: [
          "Components chỉ chạy trên server",
          "Components có thể render trên server và không gửi JavaScript đến client",
          "Components chỉ chạy trên client",
          "Components chỉ dùng cho API routes",
        ],
        correctAnswer: 1,
      },
      {
        question: "Đâu KHÔNG phải là tính năng của Next.js 13?",
        options: [
          "Turbopack",
          "Server Actions",
          "Vue.js integration",
          "Streaming SSR",
        ],
        correctAnswer: 2,
      },
      {
        question:
          "File nào được sử dụng để định nghĩa một route trong App Router?",
        options: ["index.js", "route.js", "page.js", "layout.js"],
        correctAnswer: 2,
      },
      {
        question: "Next.js 13 được phát triển bởi công ty nào?",
        options: ["Google", "Facebook", "Vercel", "Amazon"],
        correctAnswer: 2,
      },
    ],
  },
  "2": {
    id: "2",
    title: "Học React Hooks cơ bản",
    videoId: "dpw9EHDh2bM",
    description:
      "React Hooks là một tính năng quan trọng được giới thiệu từ React 16.8, cho phép bạn sử dụng state và các tính năng khác của React mà không cần viết class. Video này sẽ hướng dẫn bạn cách sử dụng các hooks phổ biến như useState, useEffect, useContext và useReducer.",
    questions: [
      {
        question: "React Hooks được giới thiệu từ phiên bản nào?",
        options: ["16.0", "16.8", "17.0", "18.0"],
        correctAnswer: 1,
      },
      {
        question:
          "Hook nào được sử dụng để quản lý state trong functional component?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: 1,
      },
      {
        question: "useEffect hook được sử dụng để làm gì?",
        options: [
          "Quản lý state",
          "Xử lý side effects như data fetching, subscriptions, hoặc DOM mutations",
          "Tạo context mới",
          "Tối ưu hóa performance",
        ],
        correctAnswer: 1,
      },
      {
        question: "Đâu là quy tắc quan trọng khi sử dụng Hooks?",
        options: [
          "Chỉ gọi Hooks từ functional components",
          "Luôn gọi Hooks bên trong điều kiện if",
          "Gọi Hooks bên trong loops",
          "Gọi Hooks bên trong callbacks",
        ],
        correctAnswer: 0,
      },
      {
        question: "Hook nào được sử dụng để truy cập context?",
        options: ["useContext", "useState", "useReducer", "useRef"],
        correctAnswer: 0,
      },
    ],
  },
  "3": {
    id: "3",
    title: "Tailwind CSS Tutorial",
    videoId: "mr15Xzb1Ook",
    description:
      "Tailwind CSS là một framework CSS tiện ích (utility-first) giúp bạn xây dựng giao diện nhanh chóng mà không cần viết CSS tùy chỉnh. Video này sẽ hướng dẫn bạn cách cài đặt và sử dụng Tailwind CSS trong dự án của mình, cùng với các kỹ thuật responsive design và dark mode.",
    questions: [
      {
        question: "Tailwind CSS là loại framework CSS nào?",
        options: [
          "Component-based",
          "Utility-first",
          "Preprocessor",
          "CSS-in-JS",
        ],
        correctAnswer: 1,
      },
      {
        question:
          "Để tạo responsive design trong Tailwind, bạn sử dụng prefix nào?",
        options: [
          "responsive:",
          "@media",
          "sm:, md:, lg:, xl:",
          "mobile:, tablet:, desktop:",
        ],
        correctAnswer: 2,
      },
      {
        question: "Cách nào để tùy chỉnh Tailwind CSS?",
        options: [
          "Chỉnh sửa trực tiếp file CSS của Tailwind",
          "Sử dụng file tailwind.config.js",
          "Không thể tùy chỉnh Tailwind",
          "Sử dụng CSS variables",
        ],
        correctAnswer: 1,
      },
      {
        question: "Để thêm dark mode trong Tailwind, bạn sử dụng prefix nào?",
        options: ["night:", "darkmode:", "dark:", "@dark"],
        correctAnswer: 2,
      },
      {
        question: "JIT (Just-In-Time) mode trong Tailwind CSS có tác dụng gì?",
        options: [
          "Tăng tốc độ biên dịch CSS",
          "Chỉ tạo ra CSS cho các classes bạn thực sự sử dụng",
          "Tự động tạo ra các component",
          "Tối ưu hóa JavaScript",
        ],
        correctAnswer: 1,
      },
    ],
  },
  "4": {
    id: "4",
    title: "TypeScript cho người mới bắt đầu",
    videoId: "BwuLxPH8IDs",
    description:
      "TypeScript là một superset của JavaScript, thêm vào tính năng kiểu dữ liệu tĩnh và các tính năng khác. Video này sẽ giới thiệu TypeScript cho người mới bắt đầu, bao gồm cách cài đặt, cú pháp cơ bản, interfaces, types, generics và cách tích hợp TypeScript vào dự án JavaScript hiện có.",
    questions: [
      {
        question: "TypeScript là gì?",
        options: [
          "Một ngôn ngữ lập trình mới hoàn toàn",
          "Một superset của JavaScript với kiểu dữ liệu tĩnh",
          "Một framework JavaScript",
          "Một preprocessor CSS",
        ],
        correctAnswer: 1,
      },
      {
        question: "Đâu là đuôi file của TypeScript?",
        options: [".js", ".jsx", ".ts", ".tsx"],
        correctAnswer: 2,
      },
      {
        question: "Interface trong TypeScript dùng để làm gì?",
        options: [
          "Định nghĩa cấu trúc của đối tượng",
          "Tạo component React",
          "Kết nối với cơ sở dữ liệu",
          "Tối ưu hóa code",
        ],
        correctAnswer: 0,
      },
      {
        question: "Generics trong TypeScript có tác dụng gì?",
        options: [
          "Tạo ra các hàm và lớp có thể làm việc với nhiều kiểu dữ liệu",
          "Tự động tạo code",
          "Tối ưu hóa hiệu suất",
          "Tạo ra các component tái sử dụng",
        ],
        correctAnswer: 0,
      },
      {
        question: "TypeScript được phát triển bởi công ty nào?",
        options: ["Google", "Facebook", "Microsoft", "Apple"],
        correctAnswer: 2,
      },
    ],
  },
};

export default function VideoDetailPage() {
  const params = useParams();
  const videoId = params.id as string;
  const video = videoDetails[videoId as keyof typeof videoDetails];

  const [userAnswers, setUserAnswers] = useState<number[]>(
    Array(video.questions.length).fill(-1)
  );
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleQuizSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return answer === video.questions[index].correctAnswer
        ? score + 1
        : score;
    }, 0);
  };

  const resetQuiz = () => {
    setUserAnswers(Array(video.questions.length).fill(-1));
    setShowResults(false);
  };

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
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Mô tả video</h3>
              <p className="text-muted-foreground">{video.description}</p>
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
                  Trả lời {video.questions.length} câu hỏi dưới đây để kiểm tra
                  kiến thức của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {video.questions.map((quiz, quizIndex) => (
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
                              (optionIndex === quiz.correctAnswer
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
                        userAnswers[quizIndex] !== quiz.correctAnswer && (
                          <p className="text-sm text-red-500">
                            Đáp án đúng: {quiz.options[quiz.correctAnswer]}
                          </p>
                        )}
                    </div>
                  ))}
                </div>
              </CardContent>
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
                        {video.questions.length} câu hỏi
                      </AlertDescription>
                    </Alert>
                    <Button onClick={resetQuiz} className="ml-4">
                      Làm lại
                    </Button>
                  </>
                )}
              </CardFooter>
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
  );
}
