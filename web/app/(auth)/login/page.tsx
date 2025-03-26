"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // URL API từ biến môi trường
  const router = useRouter(); // Hook để chuyển hướng

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // Trạng thái loading

  // Hàm xử lý khi thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Hàm xử lý khi bấm nút "Đăng nhập"
  const handleSubmit = async () => {
    // Kiểm tra các trường bắt buộc
    if (!formData.email || !formData.password) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true); // Bật trạng thái loading

      // Gửi request đăng nhập
      const response = await axios.post(`${apiUrl}/Auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      // Xử lý phản hồi từ server
      if (response.status === 200) {
        alert("Đăng nhập thành công!");
        console.log("Response:", response.data);

        // Lưu token vào localStorage (nếu có)
        localStorage.setItem("token", response.data.token);

        // Chuyển hướng đến trang chính
        router.push("/");
      }
    } catch (error) {
      // Xử lý lỗi
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        alert(error.response?.data?.Message || "Đăng nhập thất bại!");
      } else {
        console.error("Unexpected error:", error);
        alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập thông tin đăng nhập của bạn để tiếp tục
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading} // Vô hiệu hóa nút khi đang loading
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
          <div className="text-center text-sm">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-primary underline underline-offset-4 hover:text-primary/90"
            >
              Đăng ký
            </Link>
          </div>
          <div className="text-center text-sm">
            <Link
              href="/public"
              className="text-muted-foreground underline underline-offset-4 hover:text-muted-foreground/90"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
