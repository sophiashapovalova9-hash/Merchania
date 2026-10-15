/* =====================================================================
   01_schema.sql  —  твоя текущая схема + только те дополнения,
                     которые нужны минимальному бэкенду.

   Если БД уже создана твоим скриптом — пропусти секцию CREATE DATABASE
   и выполни только секцию "ДОПОЛНЕНИЯ" внизу файла.
   ===================================================================== */

IF DB_ID(N'ArtistMerchDB') IS NULL
    CREATE DATABASE ArtistMerchDB;
GO

USE ArtistMerchDB;
GO

/* ---------------------------- ЯДРО СХЕМЫ ---------------------------- */

IF OBJECT_ID(N'dbo.Role', N'U') IS NULL
CREATE TABLE Role (
    RoleID INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);
GO

IF OBJECT_ID(N'dbo.UserAccount', N'U') IS NULL
CREATE TABLE UserAccount (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    RoleID INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_User_Role FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
);
GO

IF OBJECT_ID(N'dbo.UserProfile', N'U') IS NULL
CREATE TABLE UserProfile (
    ProfileID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Patronymic NVARCHAR(50) NULL,
    Phone NVARCHAR(30) NULL,

    CONSTRAINT FK_Profile_User FOREIGN KEY (UserID) REFERENCES UserAccount(UserID)
);
GO

IF OBJECT_ID(N'dbo.ArtistDetail', N'U') IS NULL
CREATE TABLE ArtistDetail (
    ArtistID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL UNIQUE,
    ShopName NVARCHAR(100) NOT NULL,
    Bio NVARCHAR(MAX) NULL,
    Rating DECIMAL(3,2) DEFAULT 0,

    CONSTRAINT FK_Artist_User FOREIGN KEY (UserID) REFERENCES UserAccount(UserID)
);
GO

IF OBJECT_ID(N'dbo.Fandom', N'U') IS NULL
CREATE TABLE Fandom (
    FandomID INT IDENTITY(1,1) PRIMARY KEY,
    FandomName NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(255) NULL
);
GO

IF OBJECT_ID(N'dbo.Category', N'U') IS NULL
CREATE TABLE Category (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL UNIQUE
);
GO

IF OBJECT_ID(N'dbo.Product', N'U') IS NULL
CREATE TABLE Product (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    ArtistID INT NOT NULL,
    CategoryID INT NOT NULL,
    FandomID INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Price DECIMAL(12,2) NOT NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_Product_Artist FOREIGN KEY (ArtistID) REFERENCES ArtistDetail(ArtistID),
    CONSTRAINT FK_Product_Category FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID),
    CONSTRAINT FK_Product_Fandom FOREIGN KEY (FandomID) REFERENCES Fandom(FandomID)
);
GO

IF OBJECT_ID(N'dbo.Tag', N'U') IS NULL
CREATE TABLE Tag (
    TagID INT IDENTITY(1,1) PRIMARY KEY,
    TagName NVARCHAR(50) NOT NULL UNIQUE
);
GO

IF OBJECT_ID(N'dbo.ProductTag', N'U') IS NULL
CREATE TABLE ProductTag (
    ProductID INT NOT NULL,
    TagID INT NOT NULL,
    PRIMARY KEY (ProductID, TagID),
    CONSTRAINT FK_PT_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
    CONSTRAINT FK_PT_Tag FOREIGN KEY (TagID) REFERENCES Tag(TagID)
);
GO

IF OBJECT_ID(N'dbo.ProductMedia', N'U') IS NULL
CREATE TABLE ProductMedia (
    MediaID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    ImageURL NVARCHAR(500) NOT NULL,
    IsMain BIT DEFAULT 0,

    CONSTRAINT FK_Media_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);
GO

IF OBJECT_ID(N'dbo.OrderStatus', N'U') IS NULL
CREATE TABLE OrderStatus (
    StatusID INT IDENTITY(1,1) PRIMARY KEY,
    StatusName NVARCHAR(50) NOT NULL UNIQUE
);
GO

IF OBJECT_ID(N'dbo.Orders', N'U') IS NULL
CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    BuyerID INT NOT NULL,
    StatusID INT NOT NULL,
    OrderDate DATETIME2 DEFAULT GETDATE(),
    TotalAmount DECIMAL(12,2) NOT NULL,
    ShippingAddress NVARCHAR(500) NOT NULL,
    TrackingNumber NVARCHAR(100) NULL, -- Для интеграции с Boxberry

    CONSTRAINT FK_Order_Buyer FOREIGN KEY (BuyerID) REFERENCES UserAccount(UserID),
    CONSTRAINT FK_Order_Status FOREIGN KEY (StatusID) REFERENCES OrderStatus(StatusID)
);
GO

IF OBJECT_ID(N'dbo.OrderItem', N'U') IS NULL
CREATE TABLE OrderItem (
    OrderItemID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(12,2) NOT NULL, -- Фиксируем цену на момент покупки

    CONSTRAINT FK_Item_Order FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    CONSTRAINT FK_Item_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);
GO

IF OBJECT_ID(N'dbo.Wishlist', N'U') IS NULL
CREATE TABLE Wishlist (
    WishlistID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    AddedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_Wish_User FOREIGN KEY (UserID) REFERENCES UserAccount(UserID),
    CONSTRAINT FK_Wish_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);
GO

IF OBJECT_ID(N'dbo.Review', N'U') IS NULL
CREATE TABLE Review (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    UserID INT NOT NULL,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    Comment NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_Review_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
    CONSTRAINT FK_Review_User FOREIGN KEY (UserID) REFERENCES UserAccount(UserID)
);
GO

IF OBJECT_ID(N'dbo.SupportTicket', N'U') IS NULL
CREATE TABLE SupportTicket (
    TicketID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    Subject NVARCHAR(200) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    IsResolved BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_Ticket_User FOREIGN KEY (UserID) REFERENCES UserAccount(UserID)
);
GO

/* ---------------------------- ДОПОЛНЕНИЯ ----------------------------
   Три вещи, без которых минимальный бэкенд не обойдётся.
   1) UNIQUE(UserID, ProductID) в Wishlist  — чтобы нельзя было дважды
      добавить один товар в избранное (и чтобы работал toggle).
   2) Таблица Cart — корзина на сервере (сейчас на фронте она захардкожена).
   3) Индексы на частые фильтры каталога.
   ------------------------------------------------------------------- */

-- 1. Уникальность избранного: пересоздаём ограничение без потери данных
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_Wishlist_User_Product' AND object_id = OBJECT_ID(N'dbo.Wishlist'))
BEGIN
    ;WITH d AS (
        SELECT WishlistID, ROW_NUMBER() OVER (PARTITION BY UserID, ProductID ORDER BY WishlistID) AS rn
        FROM Wishlist
    )
    DELETE FROM d WHERE rn > 1;

    ALTER TABLE Wishlist ADD CONSTRAINT UQ_Wishlist_User_Product UNIQUE (UserID, ProductID);
END
GO

-- 2. Корзина
IF OBJECT_ID(N'dbo.Cart', N'U') IS NULL
CREATE TABLE Cart (
    CartItemID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1 CONSTRAINT CK_Cart_Quantity CHECK (Quantity > 0),
    AddedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT UQ_Cart_User_Product UNIQUE (UserID, ProductID),
    CONSTRAINT FK_Cart_User FOREIGN KEY (UserID) REFERENCES UserAccount(UserID),
    CONSTRAINT FK_Cart_Product FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);
GO

-- 3. Индексы
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Product_Catalog' AND object_id = OBJECT_ID(N'dbo.Product'))
    CREATE INDEX IX_Product_Catalog ON Product (FandomID, CategoryID) INCLUDE (Price, StockQuantity);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Product_Artist' AND object_id = OBJECT_ID(N'dbo.Product'))
    CREATE INDEX IX_Product_Artist ON Product (ArtistID);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Orders_Buyer' AND object_id = OBJECT_ID(N'dbo.Orders'))
    CREATE INDEX IX_Orders_Buyer ON Orders (BuyerID, OrderDate DESC);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_OrderItem_Order' AND object_id = OBJECT_ID(N'dbo.OrderItem'))
    CREATE INDEX IX_OrderItem_Order ON OrderItem (OrderID);
GO

PRINT '01_schema.sql выполнен.';
GO
