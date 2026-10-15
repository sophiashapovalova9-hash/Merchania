/* =====================================================================
   02_seed.sql — тестовые данные, чтобы фронту было что показывать.
   Выполнять ПОСЛЕ 01_schema.sql. Можно пропустить, если данные уже есть.
   ===================================================================== */

USE ArtistMerchDB;
GO

SET NOCOUNT ON;

/* ---- Роли ---- */
IF NOT EXISTS (SELECT 1 FROM Role WHERE RoleName = N'buyer')  INSERT INTO Role (RoleName) VALUES (N'buyer');
IF NOT EXISTS (SELECT 1 FROM Role WHERE RoleName = N'artist')  INSERT INTO Role (RoleName) VALUES (N'artist');
IF NOT EXISTS (SELECT 1 FROM Role WHERE RoleName = N'admin')   INSERT INTO Role (RoleName) VALUES (N'admin');
GO

/* ---- Статусы заказа (именно эти строки использует API) ---- */
IF NOT EXISTS (SELECT 1 FROM OrderStatus WHERE StatusName = N'Новый')     INSERT INTO OrderStatus (StatusName) VALUES (N'Новый');
IF NOT EXISTS (SELECT 1 FROM OrderStatus WHERE StatusName = N'Сборка')    INSERT INTO OrderStatus (StatusName) VALUES (N'Сборка');
IF NOT EXISTS (SELECT 1 FROM OrderStatus WHERE StatusName = N'Отправлен') INSERT INTO OrderStatus (StatusName) VALUES (N'Отправлен');
IF NOT EXISTS (SELECT 1 FROM OrderStatus WHERE StatusName = N'Доставлен') INSERT INTO OrderStatus (StatusName) VALUES (N'Доставлен');
IF NOT EXISTS (SELECT 1 FROM OrderStatus WHERE StatusName = N'Завершён')  INSERT INTO OrderStatus (StatusName) VALUES (N'Завершён');
IF NOT EXISTS (SELECT 1 FROM OrderStatus WHERE StatusName = N'Отменён')   INSERT INTO OrderStatus (StatusName) VALUES (N'Отменён');
GO

/* ---- Категории ---- */
IF NOT EXISTS (SELECT 1 FROM Category WHERE CategoryName = N'Значки')          INSERT INTO Category (CategoryName) VALUES (N'Значки');
IF NOT EXISTS (SELECT 1 FROM Category WHERE CategoryName = N'Стикеры')         INSERT INTO Category (CategoryName) VALUES (N'Стикеры');
IF NOT EXISTS (SELECT 1 FROM Category WHERE CategoryName = N'Акриловые стенды')INSERT INTO Category (CategoryName) VALUES (N'Акриловые стенды');
IF NOT EXISTS (SELECT 1 FROM Category WHERE CategoryName = N'Постеры')         INSERT INTO Category (CategoryName) VALUES (N'Постеры');
IF NOT EXISTS (SELECT 1 FROM Category WHERE CategoryName = N'Брелоки')         INSERT INTO Category (CategoryName) VALUES (N'Брелоки');
GO

/* ---- Фандомы ---- */
IF NOT EXISTS (SELECT 1 FROM Fandom WHERE FandomName = N'Genshin Impact')    INSERT INTO Fandom (FandomName) VALUES (N'Genshin Impact');
IF NOT EXISTS (SELECT 1 FROM Fandom WHERE FandomName = N'Honkai: Star Rail') INSERT INTO Fandom (FandomName) VALUES (N'Honkai: Star Rail');
IF NOT EXISTS (SELECT 1 FROM Fandom WHERE FandomName = N'Chainsaw Man')      INSERT INTO Fandom (FandomName) VALUES (N'Chainsaw Man');
IF NOT EXISTS (SELECT 1 FROM Fandom WHERE FandomName = N'Jujutsu Kaisen')    INSERT INTO Fandom (FandomName) VALUES (N'Jujutsu Kaisen');
GO

/* ---- Пользователи (UserID = 1 покупатель, 2 и 3 художники) ----
   PasswordHash здесь — заглушка. Реальный хеш появится вместе с auth. */
IF NOT EXISTS (SELECT 1 FROM UserAccount WHERE Email = N'ivan@example.com')
    INSERT INTO UserAccount (Email, PasswordHash, RoleID)
    VALUES (N'ivan@example.com', N'DEMO_HASH_NOT_REAL', (SELECT RoleID FROM Role WHERE RoleName = N'buyer'));

IF NOT EXISTS (SELECT 1 FROM UserAccount WHERE Email = N'studio.pan@example.com')
    INSERT INTO UserAccount (Email, PasswordHash, RoleID)
    VALUES (N'studio.pan@example.com', N'DEMO_HASH_NOT_REAL', (SELECT RoleID FROM Role WHERE RoleName = N'artist'));

IF NOT EXISTS (SELECT 1 FROM UserAccount WHERE Email = N'neon.brush@example.com')
    INSERT INTO UserAccount (Email, PasswordHash, RoleID)
    VALUES (N'neon.brush@example.com', N'DEMO_HASH_NOT_REAL', (SELECT RoleID FROM Role WHERE RoleName = N'artist'));
GO

IF NOT EXISTS (SELECT 1 FROM UserProfile WHERE UserID = 1)
    INSERT INTO UserProfile (UserID, FirstName, LastName, Phone) VALUES (1, N'Иван', N'Иванов', N'+7 999 000-00-00');
IF NOT EXISTS (SELECT 1 FROM UserProfile WHERE UserID = 2)
    INSERT INTO UserProfile (UserID, FirstName, LastName) VALUES (2, N'Пан', N'Студиев');
IF NOT EXISTS (SELECT 1 FROM UserProfile WHERE UserID = 3)
    INSERT INTO UserProfile (UserID, FirstName, LastName) VALUES (3, N'Неон', N'Брашев');
GO

IF NOT EXISTS (SELECT 1 FROM ArtistDetail WHERE UserID = 2)
    INSERT INTO ArtistDetail (UserID, ShopName, Bio, Rating)
    VALUES (2, N'Studio_Pan', N'Акрил, значки и стикеры по мотивам аниме-игр.', 4.90);
IF NOT EXISTS (SELECT 1 FROM ArtistDetail WHERE UserID = 3)
    INSERT INTO ArtistDetail (UserID, ShopName, Bio, Rating)
    VALUES (3, N'NeonBrush', N'Постеры и prints, малые тиражи.', 4.70);
GO

/* ---- Товары (9 штук, как в сетке каталога) ---- */
DECLARE @A1 INT = (SELECT ArtistID FROM ArtistDetail WHERE ShopName = N'Studio_Pan');
DECLARE @A2 INT = (SELECT ArtistID FROM ArtistDetail WHERE ShopName = N'NeonBrush');

DECLARE @C_Pins INT = (SELECT CategoryID FROM Category WHERE CategoryName = N'Значки');
DECLARE @C_Stick INT = (SELECT CategoryID FROM Category WHERE CategoryName = N'Стикеры');
DECLARE @C_Acrl INT = (SELECT CategoryID FROM Category WHERE CategoryName = N'Акриловые стенды');
DECLARE @C_Post INT = (SELECT CategoryID FROM Category WHERE CategoryName = N'Постеры');
DECLARE @C_Key  INT = (SELECT CategoryID FROM Category WHERE CategoryName = N'Брелоки');

DECLARE @F_Gen INT = (SELECT FandomID FROM Fandom WHERE FandomName = N'Genshin Impact');
DECLARE @F_Hsr INT = (SELECT FandomID FROM Fandom WHERE FandomName = N'Honkai: Star Rail');
DECLARE @F_Csm INT = (SELECT FandomID FROM Fandom WHERE FandomName = N'Chainsaw Man');
DECLARE @F_Jjk INT = (SELECT FandomID FROM Fandom WHERE FandomName = N'Jujutsu Kaisen');

IF NOT EXISTS (SELECT 1 FROM Product)
BEGIN
    INSERT INTO Product (ArtistID, CategoryID, FandomID, Title, Description, Price, StockQuantity) VALUES
    (@A1, @C_Acrl, @F_Gen, N'Акриловый стенд "Странник"', N'Двусторонняя печать, высота 15 см, защитная плёнка.', 750.00, 12),
    (@A1, @C_Pins, @F_Gen, N'Значок "Паймон"',            N'Металл, эмаль, 3 см.',                                  250.00, 40),
    (@A1, @C_Stick, @F_Hsr, N'Стикерпак "Звёздный экспресс"', N'6 виниловых стикеров, влагостойкие.',                400.00, 25),
    (@A1, @C_Key,  @F_Csm, N'Брелок "Аки"',              N'Акрил, двусторонний, 6 см.',                             300.00, 18),
    (@A1, @C_Acrl, @F_Jjk, N'Акриловый стенд "Годжо"',   N'Двусторонняя печать, высота 20 см.',                     900.00, 7),
    (@A1, @C_Pins, @F_Hsr, N'Значок "Март 7"',           N'Металл, эмаль, 3.5 см.',                                 280.00, 0),
    (@A2, @C_Post, @F_Csm, N'Постер "Денджи" A3',        N'Плотная бумага 250 г/м², без рамки.',                    550.00, 15),
    (@A2, @C_Post, @F_Gen, N'Постер "Ли Юэ" A2',         N'Плотная бумага 250 г/м², без рамки.',                    700.00, 9),
    (@A2, @C_Stick, @F_Jjk, N'Стикер "Сукуна"',          N'Винил, 10 см.',                                          180.00, 60);
END
GO

/* ---- Медиа (по одному главному изображению на товар) ---- */
IF NOT EXISTS (SELECT 1 FROM ProductMedia)
BEGIN
    INSERT INTO ProductMedia (ProductID, ImageURL, IsMain)
    SELECT ProductID, N'/uploads/products/' + CAST(ProductID AS NVARCHAR(10)) + N'-main.jpg', 1
    FROM Product;
END
GO

/* ---- Корзина демо-покупателя (ровно как на фронте: 2 позиции) ---- */
IF NOT EXISTS (SELECT 1 FROM Cart WHERE UserID = 1)
BEGIN
    INSERT INTO Cart (UserID, ProductID, Quantity)
    SELECT 1, ProductID, 1 FROM Product WHERE Title IN (N'Акриловый стенд "Странник"', N'Значок "Паймон"');
END
GO

PRINT '02_seed.sql выполнен.';
GO
