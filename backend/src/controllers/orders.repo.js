import { getDb } from '../db/index.js';
import { q } from '../db/params.js';

const STATUS_NEW = 'Новый';

const ORDER_COLUMNS = `
    o.OrderID        AS order_id,
    o.OrderDate      AS order_date,
    o.TotalAmount    AS total_amount,
    o.ShippingAddress AS shipping_address,
    o.TrackingNumber AS tracking_number,
    o.BuyerID        AS buyer_id,
    st.StatusName    AS status_name,
    buyer.Email      AS buyer_email`;

/** История заказов покупателя (страница Account -> Заказы) */
export async function listByBuyer(buyerId) {
  const { rows } = await getDb().query(
    `
    SELECT ${ORDER_COLUMNS},
           COALESCE(items.item_count, 0) AS item_count
    FROM Orders o
    JOIN OrderStatus st ON st.StatusID = o.StatusID
    JOIN UserAccount buyer ON buyer.UserID = o.BuyerID
    OUTER APPLY (SELECT SUM(oi.Quantity) AS item_count FROM OrderItem oi WHERE oi.OrderID = o.OrderID) items
    WHERE o.BuyerID = @buyerId
    ORDER BY o.OrderDate DESC, o.OrderID DESC;`,
    { buyerId: q.int(buyerId) },
  );
  return rows;
}

export async function getOrder(orderId) {
  const { rows } = await getDb().query(
    `
    SELECT ${ORDER_COLUMNS},
           COALESCE(items.item_count, 0) AS item_count
    FROM Orders o
    JOIN OrderStatus st ON st.StatusID = o.StatusID
    JOIN UserAccount buyer ON buyer.UserID = o.BuyerID
    OUTER APPLY (SELECT SUM(oi.Quantity) AS item_count FROM OrderItem oi WHERE oi.OrderID = o.OrderID) items
    WHERE o.OrderID = @orderId;`,
    { orderId: q.int(orderId) },
  );
  return rows[0] ?? null;
}

export async function listOrderItems(orderId) {
  const { rows } = await getDb().query(
    `
    SELECT oi.OrderItemID AS order_item_id,
           oi.ProductID   AS product_id,
           oi.Quantity    AS quantity,
           oi.UnitPrice   AS unit_price,
           oi.Quantity * oi.UnitPrice AS line_total,
           p.Title        AS title,
           a.ShopName     AS shop_name,
           main_img.ImageURL AS image_url
    FROM OrderItem oi
    JOIN Product p ON p.ProductID = oi.ProductID
    JOIN ArtistDetail a ON a.ArtistID = p.ArtistID
    OUTER APPLY (SELECT TOP 1 m.ImageURL FROM ProductMedia m WHERE m.ProductID = p.ProductID ORDER BY m.IsMain DESC, m.MediaID) main_img
    WHERE oi.OrderID = @orderId;`,
    { orderId: q.int(orderId) },
  );
  return rows;
}

/**
 * Оформление заказа из корзины — единственная операция, где нужна транзакция:
 * либо создаётся заказ И списываются остатки И чистится корзина, либо ничего.
 *
 * UPDLOCK на Cart и Product защищает от гонки: два одновременных чекаута
 * не смогут продать один и тот же остаток дважды.
 */
export async function checkout({ buyerId, shippingAddress, paymentMethod }) {
  const db = getDb();

  return db.transaction(async (tx) => {
    const { rows: items } = await tx.query(
      `
      SELECT c.ProductID AS product_id, c.Quantity AS quantity, p.Title AS title, p.Price AS price, p.StockQuantity AS stock
      FROM Cart c WITH (UPDLOCK)
      JOIN Product p WITH (UPDLOCK) ON p.ProductID = c.ProductID
      WHERE c.UserID = @buyerId;`,
      { buyerId: q.int(buyerId) },
    );

    if (items.length === 0) return { error: { status: 409, message: 'Корзина пуста' } };

    const shortage = items.find((i) => i.stock < i.quantity);
    if (shortage) {
      return {
        error: { status: 409, message: `Недостаточно остатка: "${shortage.title}" (нужно ${shortage.quantity}, есть ${shortage.stock})` },
      };
    }

    const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

    const { rows: orderRows } = await tx.query(
      `
      INSERT INTO Orders (BuyerID, StatusID, OrderDate, TotalAmount, ShippingAddress, TrackingNumber)
      OUTPUT inserted.OrderID AS order_id, inserted.TotalAmount AS total_amount
      SELECT @buyerId,
             (SELECT StatusID FROM OrderStatus WHERE StatusName = @statusName),
             SYSUTCDATETIME(),
             @total,
             @shippingAddress,
             NULL;`,
      {
        buyerId: q.int(buyerId),
        statusName: q.text(STATUS_NEW, 50),
        total: q.money(total),
        shippingAddress: q.text(shippingAddress, 500),
      },
    );

    const orderId = orderRows[0]?.order_id;
    if (!orderId) return { error: { status: 500, message: 'Не удалось создать заказ' } };

    await tx.query(
      `
      INSERT INTO OrderItem (OrderID, ProductID, Quantity, UnitPrice)
      SELECT @orderId, c.ProductID, c.Quantity, p.Price
      FROM Cart c
      JOIN Product p ON p.ProductID = c.ProductID
      WHERE c.UserID = @buyerId;

      UPDATE p
         SET p.StockQuantity = p.StockQuantity - c.Quantity
      FROM Product p
      JOIN Cart c ON c.ProductID = p.ProductID
      WHERE c.UserID = @buyerId;

      DELETE FROM Cart WHERE UserID = @buyerId;`,
      { orderId: q.int(orderId), buyerId: q.int(buyerId) },
    );

    return { orderId, total, itemsCount: items.reduce((sum, i) => sum + i.quantity, 0), paymentMethod };
  });
}

/** Смена статуса художником (Dashboard -> Заказы / Логистика) */
export async function updateStatus(orderId, statusName, trackingNumber = null) {
  await getDb().query(
    `
    UPDATE o
       SET o.StatusID = (SELECT StatusID FROM OrderStatus WHERE StatusName = @statusName),
           o.TrackingNumber = COALESCE(@trackingNumber, o.TrackingNumber)
    FROM Orders o
    WHERE o.OrderID = @orderId;`,
    { orderId: q.int(orderId), statusName: q.text(statusName, 50), trackingNumber: q.text(trackingNumber, 100) },
  );
  return getOrder(orderId);
}

export async function listStatuses() {
  const { rows } = await getDb().query('SELECT StatusID AS status_id, StatusName AS status_name FROM OrderStatus ORDER BY StatusID;');
  return rows;
}
