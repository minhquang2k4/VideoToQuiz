# VideoToQuiz

VideoToQuiz là một dự án cho phép người dùng tải lên video, tạo bản tóm tắt, câu hỏi trắc nghiệm và quản lý ghi chú cho video của họ.

## Yêu cầu

1. **.NET SDK**: Cài đặt .NET SDK (phiên bản 6.0 hoặc mới hơn).
2. **SQL Server**: Đảm bảo SQL Server đã được cài đặt và đang chạy.
3. **Node.js**: Cài đặt Node.js (phiên bản 16 hoặc mới hơn).
4. **NPM**: Đảm bảo `npm` đã được cài đặt (đi kèm với Node.js).
5. **Google Generative AI API Key**: Lấy khóa API từ Google Generative AI.

## Hướng dẫn cài đặt

### 1. Cài đặt cơ sở dữ liệu

1. Mở file `initDB.sql` trong SQL Server Management Studio hoặc bất kỳ công cụ SQL nào.
2. Chạy script để tạo cơ sở dữ liệu và các bảng:
   ```sql
   CREATE DATABASE VIDEOTOQUIZ;
   USE VIDEOTOQUIZ;
   -- Chạy phần còn lại của script
   ```

### 2. Cài đặt API (.NET Backend)

1. Điều hướng đến thư mục API:
   ```bash
   cd .\api
   ```
2. Khôi phục các gói phụ thuộc:
   ```bash
   dotnet restore
   ```
3. Cập nhật chuỗi kết nối trong file `DatabaseService.cs`:
   ```csharp
   private readonly string _connectionString = "Server=localhost\\SQLEXPRESS;Database=VIDEOTOQUIZ;User Id=sa;Password=admin;TrustServerCertificate=True;";
   ```
   Thay `User Id` và `Password` bằng thông tin đăng nhập SQL Server của bạn.
4. Chạy API:
   ```bash
   dotnet run
   ```
5. API sẽ chạy tại `http://localhost:5000`.

### 3. Cài đặt Express.js (Node.js Backend)

1. Điều hướng đến thư mục Express.js:
   ```bash
   cd .\api-express
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Cập nhật khóa API Google Generative AI trong file `app.js`:
   ```javascript
   const genAI = new GoogleGenerativeAI('YOUR_API_KEY_HERE');
   ```
4. Chạy server Express.js:
   ```bash
   npm start
   ```
5. Server sẽ chạy tại `http://localhost:8000`.

### 4. Cài đặt Next.js (Frontend)
1. Điều hướng đến thư mục Express.js:
   ```bash
   cd .\web
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
4. Chạy server Next.js:
   ```bash
   npm start
   ```
5. Server sẽ chạy tại `http://localhost:3000`