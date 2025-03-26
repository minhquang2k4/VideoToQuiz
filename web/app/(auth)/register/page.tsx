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


export default function RegisterPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  // State để lưu trữ thông tin form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Hàm xử lý khi thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value, // Cập nhật giá trị theo id của input
    }));
  };

  // Hàm xử lý khi bấm nút "Đăng ký"
  const handleSubmit = async () => {
    // Kiểm tra các trường bắt buộc
    if (!formData.name || !formData.email || !formData.password) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ");
      return;
    }

    if (formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không trùng khớp");
      return;
    }
    try {
      // Gửi request đăng ký tài khoản
      const response = await axios.post(`${apiUrl}/Auth/register`, {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Xử lý phản hồi từ server
      if (response.status === 200) {
        alert("Đăng ký thành công!");
        console.log("Response:", response.data);
        router.push("/login");
      }
    } catch (error) {
      // Xử lý lỗi
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        alert(error.response?.data?.Message || "Đăng ký thất bại!");
      } else {
        console.error("Unexpected error:", error);
        alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng ký</CardTitle>
          <CardDescription>
            Tạo tài khoản mới để sử dụng dịch vụ của chúng tôi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
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
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" onClick={handleSubmit}>
            Đăng ký
          </Button>
          <div className="text-center text-sm">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-primary underline underline-offset-4 hover:text-primary/90"
            >
              Đăng nhập
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
