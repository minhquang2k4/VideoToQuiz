"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Search, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Định nghĩa kiểu dữ liệu cho video
interface VideoItem {
  videoID: number
  title: string
  url: string
  uploadDate: string
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

// API URL - trong ứng dụng thực tế, bạn nên đặt URL này trong biến môi trường
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newVideoTitle, setNewVideoTitle] = useState("")
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [addingVideo, setAddingVideo] = useState(false)

  // Fetch danh sách video từ API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError(null)

        // Kiểm tra token
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem danh sách video.")
          setLoading(false)
          return
        }

        // Gọi API để lấy danh sách video
        const response = await axios.get(`${apiUrl}/Video`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Lưu danh sách video vào state
        setVideos(response.data)
      } catch (err) {
        console.error("Error fetching videos:", err)
        setError("Có lỗi xảy ra khi tải danh sách video. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  // Thêm video mới
  const handleAddVideo = async () => {
    if (newVideoTitle && newVideoUrl) {
      const videoId = getYouTubeVideoId(newVideoUrl)
      if (videoId) {
        try {
          setAddingVideo(true)

          // Kiểm tra token
          const token = localStorage.getItem("token")
          if (!token) {
            setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để thêm video.")
            setAddingVideo(false)
            return
          }

          // Gọi API để thêm video mới
          const response = await axios.post(
            `${apiUrl}/Video`,
            {
              title: newVideoTitle,
              url: newVideoUrl,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )

          // Thêm video mới vào danh sách
          setVideos([response.data, ...videos])

          // Reset form
          setNewVideoTitle("")
          setNewVideoUrl("")
          setIsDialogOpen(false)
        } catch (err) {
          console.error("Error adding video:", err)
          alert("Có lỗi xảy ra khi thêm video. Vui lòng thử lại sau.")
        } finally {
          setAddingVideo(false)
        }
      }
    }
  }

  // Lọc video theo từ khóa tìm kiếm
  const filteredVideos = videos.filter((video) => video.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-semibold">Đang tải danh sách video...</h2>
        </div>
      </div>
    )
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/">Quay lại trang chủ</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Danh sách video của bạn</h1>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm video..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm video
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm video mới</DialogTitle>
                <DialogDescription>Nhập thông tin video YouTube bạn muốn thêm vào danh sách</DialogDescription>
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
                <Button onClick={handleAddVideo} disabled={!newVideoTitle || !newVideoUrl || addingVideo}>
                  {addingVideo ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm video"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => {
          const videoId = getYouTubeVideoId(video.url)
          return (
            <Link href={`/videos/${video.videoID}`} key={video.videoID} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-video relative">
                    {videoId && (
                      <Image
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt={video.title}
                        fill
                        className="object-cover rounded-t-lg"
                        onError={(e) => {
                          // Fallback to medium quality thumbnail if maxresdefault is not available
                          const target = e.target as HTMLImageElement
                          target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                        }}
                      />
                    )}
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
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                  <div className="flex justify-between w-full">
                    <span>Ngày tạo: {formatDate(video.uploadDate)}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy video</h2>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? `Không tìm thấy video nào phù hợp với từ khóa "${searchQuery}"`
              : "Bạn chưa thêm video nào vào danh sách. Hãy thêm video đầu tiên của bạn!"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm video mới
            </Button>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline">
          <Link href="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    </div>
  )
}