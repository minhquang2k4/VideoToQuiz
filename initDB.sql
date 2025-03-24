CREATE DATABASE VIDEOTOQUIZ;
GO

DROP DATABASE VIDEOTOQUIZ;

USE VIDEOTOQUIZ;
GO

CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Fullname NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
);
GO

SELECT * FROM Users;



-- CREATE TABLE Video (
--     ID INT IDENTITY(1,1) PRIMARY KEY,
--     VideoUrl NVARCHAR(255) NOT NULL,
--     Summary NVARCHAR(MAX)
-- );
-- GO

-- CREATE TABLE Quizs (
--     ID INT IDENTITY(1,1) PRIMARY KEY,
--     VideoID INT NOT NULL,
--     Question NVARCHAR(MAX) NOT NULL,
--     AnswerA NVARCHAR(MAX) NOT NULL,
--     AnswerB NVARCHAR(MAX) NOT NULL,
--     AnswerC NVARCHAR(MAX) NOT NULL,
--     AnswerD NVARCHAR(MAX) NOT NULL,
--     CorrectAnswer NVARCHAR(10) NOT NULL,
--     FOREIGN KEY (VideoID) REFERENCES Video(ID) ON DELETE CASCADE
-- );
-- GO

-- SELECT * FROM Video;
-- SELECT * FROM Quizs;

-- INSERT INTO Video (VideoUrl, Summary)
-- VALUES (
--     'https://www.youtube.com/watch?v=btk79A7uopg&t=211s',
--     N'Video hướng dẫn lập trình C/C++ cơ bản về con trỏ (pointer). Video giải thích khái niệm con trỏ một cách đơn giản trong 10 phút, bao gồm:\n\n* **Khái niệm cơ bản:** Con trỏ là một loại biến đặc biệt lưu trữ địa chỉ ô nhớ. Giống như địa chỉ nhà giúp giao hàng, con trỏ giúp truy cập dữ liệu trong bộ nhớ.\n* **Hoạt động của chương trình:** Chương trình gồm dữ liệu vào (input), xử lý và dữ liệu ra (output). Bộ nhớ được chia thành các ô nhớ, mỗi ô có địa chỉ riêng. Biến lưu trữ cả giá trị và địa chỉ.\n* **Khai báo và sử dụng con trỏ:** Video minh họa khai báo con trỏ trong Visual Studio, sử dụng toán tử `&` (lấy địa chỉ) và `*` (lấy giá trị).\n* **Mối quan hệ giữa mảng và con trỏ:** Tên mảng là con trỏ trỏ đến phần tử đầu tiên. Các phần tử mảng có địa chỉ liên tiếp nhau trong bộ nhớ, khoảng cách phụ thuộc vào kiểu dữ liệu.\n* **Truyền tham trị và tham chiếu:** Video so sánh truyền tham trị (copy giá trị) và truyền tham chiếu (truyền địa chỉ) khi sử dụng hàm, minh họa cách sử dụng con trỏ để thay đổi giá trị biến trong hàm.\n\nVideo kết thúc bằng lời hứa sẽ làm video tiếp theo về các ứng dụng nâng cao của con trỏ như mảng động, linked list, đồ thị,...\n'
-- );
-- GO

-- -- Get the ID of the inserted video
-- DECLARE @VideoID INT = SCOPE_IDENTITY();

-- -- Insert data into Quizs table
-- INSERT INTO Quizs (VideoID, Question, AnswerA, AnswerB, AnswerC, AnswerD, CorrectAnswer)
-- VALUES
-- (@VideoID, N'Theo video, con trỏ trong lập trình C/C++ là gì?', N'Một loại biến lưu trữ giá trị của một biến khác.', N'Một loại biến đặc biệt lưu trữ địa chỉ của một ô nhớ khác.', N'Một loại hàm dùng để xử lý dữ liệu.', N'Một cấu trúc dữ liệu dùng để lưu trữ nhiều giá trị.', 'answerB'),
-- (@VideoID, N'Toán tử nào được sử dụng để lấy địa chỉ của một biến?', N'*', N'&', N'->', N'.', 'answerB'),
-- (@VideoID, N'Toán tử nào được sử dụng để lấy giá trị mà con trỏ trỏ đến?', N'&', N'->', N'*', N'.', 'answerC'),
-- (@VideoID, N'Mối quan hệ giữa mảng và con trỏ trong C/C++ là gì?', N'Mảng và con trỏ không liên quan đến nhau.', N'Tên mảng là một con trỏ hằng, trỏ đến phần tử đầu tiên của mảng.', N'Con trỏ là một mảng động.', N'Mảng là một con trỏ, nhưng con trỏ không phải là mảng.', 'answerB'),
-- (@VideoID, N'Để thay đổi giá trị của một biến trong một hàm, ta nên truyền tham số vào hàm như thế nào?', N'Truyền tham trị.', N'Truyền tham chiếu hoặc sử dụng con trỏ.', N'Không cần truyền tham số.', N'Truyền giá trị mặc định.', 'answerB');
-- GO