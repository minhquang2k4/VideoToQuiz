"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

// Dữ liệu mẫu cho danh sách video
const sampleVideos = [
  {
    id: "1",
    title: "Giới thiệu về Next.js 13",
    videoUrl: "https://www.youtube.com/watch?v=_w0Ikk4JY7U",
    thumbnailUrl: "/placeholder.svg",
    description: "Tìm hiểu về Next.js 13 và các tính năng mới",
    createdAt: "2024-03-15",
    questionsCount: 5,
  },
  {
    id: "2",
    title: "Học React Hooks cơ bản",
    videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM",
    thumbnailUrl: "/placeholder.svg",
    description: "Hướng dẫn sử dụng React Hooks từ cơ bản đến nâng cao",
    createdAt: "2024-03-10",
    questionsCount: 8,
  },
  {
    id: "3",
    title: "Tailwind CSS Tutorial",
    videoUrl: "https://www.youtube.com/watch?v=mr15Xzb1Ook",
    thumbnailUrl: "/placeholder.svg",
    description: "Học cách sử dụng Tailwind CSS để tạo giao diện đẹp",
    createdAt: "2024-03-05",
    questionsCount: 6,
  },
  {
    id: "4",
    title: "TypeScript cho người mới bắt đầu",
    videoUrl: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
    thumbnailUrl: "/placeholder.svg",
    description: "Hướng dẫn TypeScript từ cơ bản đến nâng cao",
    createdAt: "2024-02-28",
    questionsCount: 10,
  },
];

// Hàm để lấy ID video từ URL YouTube
const getYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function VideosPage() {
  const [videos, setVideos] = useState(sampleVideos);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddVideo = () => {
    if (newVideoTitle && newVideoUrl) {
      const videoId = getYouTubeVideoId(newVideoUrl);
      if (videoId) {
        const newVideo = {
          id: (videos.length + 1).toString(),
          title: newVideoTitle,
          videoUrl: newVideoUrl,
          thumbnailUrl: `/placeholder.svg`,
          description: "Mô tả video sẽ được hiển thị ở đây.",
          createdAt: new Date().toISOString().split("T")[0],
          questionsCount: 5,
        };

        setVideos([newVideo, ...videos]);
        setNewVideoTitle("");
        setNewVideoUrl("");
        setIsDialogOpen(false);
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Danh sách video của bạn</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm video mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm video mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin video YouTube bạn muốn thêm vào danh sách
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề video</Label>
                <Input
                  id="title"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="Nhập tiêu đề video"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Đường dẫn YouTube</Label>
                <Input
                  id="url"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddVideo}
                disabled={!newVideoTitle || !newVideoUrl}
              >
                Thêm video
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link href={`/videos/${video.id}`} key={video.id} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-video relative">
                  <Image
                    src={video.thumbnailUrl || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
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
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle className="line-clamp-1">{video.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {video.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="text-sm text-muted-foreground">
                <div className="flex justify-between w-full">
                  <span>Ngày tạo: {video.createdAt}</span>
                  <span>{video.questionsCount} câu hỏi</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Chưa có video nào</h2>
          <p className="text-muted-foreground mb-4">
            Bạn chưa thêm video nào vào danh sách. Hãy thêm video đầu tiên của
            bạn!
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm video mới
          </Button>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline">
          <Link href="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}
