"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra xem token có tồn tại trong localStorage hay không
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Đã đăng nhập
    }
  }, []);

  const handleViewVideos = () => {
    if (isLoggedIn) {
      console.log("🚀 ~ handleViewVideos ~ isLoggedIn:", isLoggedIn)
      router.push("/videos");
    } else {
      console.log("🚀 ~ handleViewVideos ~ isLoggedIn:", isLoggedIn)
      router.push("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); 
    // router.push("/"); 
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Học tập từ Video YouTube</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Nền tảng học tập tương tác giúp bạn tạo và làm bài trắc nghiệm từ các
          video YouTube yêu thích
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg" onClick={handleViewVideos}>
            <p className="cursor-pointer">Xem danh sách video</p>
          </Button>
          {!isLoggedIn && (
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Đăng nhập</Link>
            </Button>
          )}
          {isLoggedIn && (
            <Button asChild variant="outline" size="lg" onClick={handleLogout}>
              <p className="cursor-pointer" >Đăng xuất</p>
            </Button>
          )}
        </div>
      </div>

      {/* Giới thiệu tính năng */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Tạo bài học từ YouTube</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M10 12a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-4z"></path>
                </svg>
              </div>
            </div>
            <p className="text-center">
              Thêm video YouTube yêu thích và tạo bài học tương tác với các câu
              hỏi trắc nghiệm
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Làm bài trắc nghiệm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
            </div>
            <p className="text-center">
              Kiểm tra kiến thức của bạn với các câu hỏi trắc nghiệm và nhận
              phản hồi ngay lập tức
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theo dõi tiến độ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 20v-6"></path>
                  <path d="M6 20v-6"></path>
                  <path d="M18 20v-6"></path>
                  <path d="M6 14l6-6 6 6"></path>
                  <path d="M6 4h12"></path>
                </svg>
              </div>
            </div>
            <p className="text-center">
              Lưu trữ kết quả học tập và theo dõi sự tiến bộ của bạn qua thời
              gian
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cách sử dụng */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Cách sử dụng</h2>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                1
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold mb-2">Thêm video YouTube</h3>
              <p className="text-muted-foreground">
                Nhập tiêu đề và đường dẫn video YouTube bạn muốn học
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                2
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold mb-2">Xem video và mô tả</h3>
              <p className="text-muted-foreground">
                Xem video và đọc mô tả để hiểu nội dung
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                3
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold mb-2">
                Làm bài trắc nghiệm
              </h3>
              <p className="text-muted-foreground">
                Trả lời các câu hỏi trắc nghiệm để kiểm tra kiến thức của bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary/5 rounded-lg p-8 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Bắt đầu học tập ngay hôm nay
        </h2>
        <p className="text-muted-foreground mb-6">
          Tạo tài khoản miễn phí và bắt đầu tạo bài học từ các video YouTube yêu
          thích của bạn
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Đăng ký miễn phí</Link>
          </Button>
          <Button asChild variant="outline" size="lg" onClick={handleViewVideos}>
            <p className="cursor-pointer">Xem danh sách video</p>
          </Button>
        </div>
      </div>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <div className="flex justify-center space-x-4">
          <Link href="/login" className="hover:underline">
            Đăng nhập
          </Link>
          <Link href="/register" className="hover:underline">
            Đăng ký
          </Link>
        </div>
        <p className="mt-2">© 2024 Ứng dụng Học tập từ Video YouTube</p>
      </footer>
    </div>
  );
}
