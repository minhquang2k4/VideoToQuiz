CREATE DATABASE VIDEOTOQUIZ;
GO

DROP DATABASE VIDEOTOQUIZ;

USE VIDEOTOQUIZ;
GO

-- Bảng Users
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Fullname NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL
);
GO

-- Bảng Videos (lưu video của người dùng)
CREATE TABLE Videos (
    VideoID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Url NVARCHAR(500) NOT NULL UNIQUE,
    UploadDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
GO

-- Bảng Transcripts (lưu phần tóm tắt của video)
CREATE TABLE Transcripts (
    TranscriptID INT IDENTITY(1,1) PRIMARY KEY,
    VideoID INT NOT NULL,
    Summary NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (VideoID) REFERENCES Videos(VideoID) ON DELETE CASCADE
);
GO

-- Bảng QuizQuestions (lưu câu hỏi của video)
CREATE TABLE QuizQuestions (
    QuestionID INT IDENTITY(1,1) PRIMARY KEY,
    VideoID INT NOT NULL,
    Question NVARCHAR(500) NOT NULL,
    CorrectAnswer NVARCHAR(255) NOT NULL,
    FOREIGN KEY (VideoID) REFERENCES Videos(VideoID) ON DELETE CASCADE
);
GO

-- Bảng QuizOptions (lưu danh sách đáp án cho mỗi câu hỏi)
CREATE TABLE QuizOptions (
    OptionID INT IDENTITY(1,1) PRIMARY KEY,
    QuestionID INT NOT NULL,
    OptionText NVARCHAR(255) NOT NULL,
    FOREIGN KEY (QuestionID) REFERENCES QuizQuestions(QuestionID) ON DELETE CASCADE
);
GO

CREATE TABLE Notes (
    NoteID INT IDENTITY(1,1) PRIMARY KEY,
    VideoID INT NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (VideoID) REFERENCES Videos(VideoID) ON DELETE CASCADE
)

DROP TABLE Users;
DROP TABLE Videos;
DROP TABLE Transcripts;
DROP TABLE QuizQuestions;
DROP TABLE QuizOptions;


-- Kiểm tra dữ liệu
SELECT * FROM Users;
SELECT * FROM Videos;
SELECT * FROM Transcripts;
SELECT * FROM QuizQuestions;
SELECT * FROM QuizOptions;
SELECT * FROM Notes;