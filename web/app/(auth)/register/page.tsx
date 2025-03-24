import Link from "next/link";
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
            <Input id="name" type="text" placeholder="Nguyễn Văn A" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input id="confirmPassword" type="password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full">Đăng ký</Button>
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
