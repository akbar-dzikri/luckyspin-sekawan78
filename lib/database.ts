import Database from 'better-sqlite3';
import path from "path";

const dbPath = path.join(process.cwd(), "database.sqlite");
const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS prizes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT -1,
    category TEXT DEFAULT 'hadiah' CHECK(category IN ('hadiah', 'zonk')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    prize_id INTEGER,
    is_used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prize_id) REFERENCES prizes (id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    won_prize_id INTEGER,
    used_coupon_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (won_prize_id) REFERENCES prizes (id),
    FOREIGN KEY (used_coupon_id) REFERENCES coupons (id)
  );
`);

// Insert default prizes if table is empty
const prizeCount = db.prepare("SELECT COUNT(*) as count FROM prizes").get() as {
  count: number;
};
if (prizeCount.count === 0) {
  const insertPrize = db.prepare(
    "INSERT INTO prizes (name, description, quantity, category) VALUES (?, ?, ?, ?)"
  );
  // Hadiah kategori
  insertPrize.run(
    "Diskon 10%",
    "Dapatkan diskon 10% untuk pembelian berikutnya",
    100,
    "hadiah"
  );
  insertPrize.run(
    "Gratis Ongkir",
    "Gratis ongkos kirim untuk seluruh Indonesia",
    50,
    "hadiah"
  );
  insertPrize.run("Pulsa Rp 5.000", "Pulsa senilai Rp 5.000", 30, "hadiah");
  insertPrize.run("Voucher Rp 25.000", "Voucher belanja senilai Rp 25.000", 20, "hadiah");
  insertPrize.run("Cashback 15%", "Cashback 15% maksimal Rp 50.000", 15, "hadiah");
  insertPrize.run("Hadiah Utama", "Smartphone terbaru", 1, "hadiah");
  
  // Zonk kategori
  insertPrize.run("Coba Lagi", "Belum beruntung, silakan coba lagi", -1, "zonk");
  insertPrize.run("Zonk", "Maaf, Anda belum beruntung kali ini", -1, "zonk");
}

export default db;

// Database operations
export const dbOperations = {
  // Prize operations
  getAllPrizes: () => {
    return db.prepare("SELECT * FROM prizes ORDER BY id").all();
  },

  addPrize: (name: string, description: string, quantity: number, category: 'hadiah' | 'zonk' = 'hadiah') => {
    return db
      .prepare(
        "INSERT INTO prizes (name, description, quantity, category) VALUES (?, ?, ?, ?)"
      )
      .run(name, description, quantity, category);
  },

  updatePrize: (
    id: number,
    name: string,
    description: string,
    quantity: number,
    category: 'hadiah' | 'zonk' = 'hadiah'
  ) => {
    return db
      .prepare(
        "UPDATE prizes SET name = ?, description = ?, quantity = ?, category = ? WHERE id = ?"
      )
      .run(name, description, quantity, category, id);
  },

  deletePrize: (id: number) => {
    return db.prepare("DELETE FROM prizes WHERE id = ?").run(id);
  },

  // Coupon operations
  getAllCoupons: () => {
    return db
      .prepare(
        `
      SELECT c.*, p.name as prize_name 
      FROM coupons c 
      LEFT JOIN prizes p ON c.prize_id = p.id 
      ORDER BY c.id
    `
      )
      .all();
  },

  addCoupon: (code: string, prizeId?: number) => {
    return db
      .prepare("INSERT INTO coupons (code, prize_id) VALUES (?, ?)")
      .run(code, prizeId || null);
  },

  updateCoupon: (id: number, code: string, prizeId?: number) => {
    return db
      .prepare("UPDATE coupons SET code = ?, prize_id = ? WHERE id = ?")
      .run(code, prizeId || null, id);
  },

  deleteCoupon: (id: number) => {
    return db.prepare("DELETE FROM coupons WHERE id = ?").run(id);
  },

  validateCoupon: (code: string) => {
    return db
      .prepare(
        `
      SELECT c.*, p.name as prize_name, p.description as prize_description
      FROM coupons c 
      LEFT JOIN prizes p ON c.prize_id = p.id 
      WHERE c.code = ? AND c.is_used = FALSE
    `
      )
      .get(code);
  },

  useCoupon: (code: string, username: string, prizeId: number) => {
    const transaction = db.transaction(() => {
      // Mark coupon as used
      const couponResult = db
        .prepare("UPDATE coupons SET is_used = TRUE WHERE code = ?")
        .run(code);

      // Get coupon ID
      const coupon = db
        .prepare("SELECT id FROM coupons WHERE code = ?")
        .get(code) as { id: number };

      // Add user record
      const userResult = db
        .prepare(
          "INSERT INTO users (username, won_prize_id, used_coupon_id) VALUES (?, ?, ?)"
        )
        .run(username, prizeId, coupon.id);

      return { couponResult, userResult };
    });

    return transaction();
  },

  // User operations
  getAllUsers: () => {
    return db
      .prepare(
        `
      SELECT u.*, p.name as prize_name, c.code as coupon_code
      FROM users u
      LEFT JOIN prizes p ON u.won_prize_id = p.id
      LEFT JOIN coupons c ON u.used_coupon_id = c.id
      ORDER BY u.timestamp DESC
    `
      )
      .all();
  },
};
