const http = require('http');
const express = require('express');
const mysql = require('mysql');
const dbConfig = require('./dbConfig');
const path = require('path');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();
app.use(express.static(path.join(__dirname, 'admin')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define your route
app.get('/', (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  connection.query('SELECT * FROM urunler', (error, results, fields) => {
    if (error) throw error;
    res.send('<h1>Admin Panel</h1><ul>' + results.map(urun => `<li>${urun.urun_ad}</li>`).join('') + '</ul>');
    connection.end();
  });
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});


app.get('/admin/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'register.html'));
});


app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});


app.get('/admin/urunler', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'products.html'));
});

app.get('/admin/stock', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'stock.html'));
});

app.get('/admin/magazalar', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'stores.html'));
});

app.get('/admin/sezonlar', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'sezon.html'));
});

app.get('/admin/kategoriler', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'categories.html'));
});

app.get('/admin/fetch-sales-by-year-and-season', (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  const query = `
        SELECT s.yil, sz.sezon_ad, COUNT(s.satis_id) AS toplam_satis
        FROM satislar s
        JOIN sezonlar sz ON s.sezon_id = sz.sezon_id
        GROUP BY s.yil, sz.sezon_ad
        ORDER BY s.yil DESC, sz.sezon_ad ASC
    `;

  connection.query(query, (error, results, fields) => {
    connection.end();

    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Send the data as JSON
    res.json(results);
  });
});
app.get('/admin/satislar', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'sales.html'));
});

// Admin sayfası route'u
app.get('/admin/fetch', (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  // Toplam ürün sayısı ve toplam geliri getir
  const query = `
    SELECT
      COUNT(*) AS total_products,
      SUM(u.fiyat * s.satis_adedi) AS total_revenue
    FROM urunler u
    LEFT JOIN satislar s ON u.urun_id = s.urun_id
  `;
  connection.query(query, (error, results, fields) => {
    connection.end();

    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Send the data as JSON
    res.json(results);
  });
});



app.get('/admin/fetch-stores', (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  const query = `
        SELECT m.*, COUNT(s.satis_id) AS toplam_satis
        FROM magazalar m
        LEFT JOIN satislar s ON m.magaza_id = s.magaza_id
        GROUP BY m.magaza_id
    `;

  connection.query(query, (error, results, fields) => {
    if (error) {
      connection.end();
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Send the data as JSON
    res.json(results);

    connection.end();
  });
});

app.get('/admin/fetch-products-with-sales-by-store-grouped', (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  const query = `
    SELECT
      m.magaza_id,
      m.magaza_ad,
      GROUP_CONCAT(u.urun_id) AS urun_ids,
      GROUP_CONCAT(u.urun_ad) AS urun_ads,
      GROUP_CONCAT(s.satis_adedi) AS satis_adetleri,
      SUM(s.satis_adedi) AS toplam_satis
    FROM
      satislar s
      INNER JOIN magazalar m ON s.magaza_id = m.magaza_id
      INNER JOIN urunler u ON s.urun_id = u.urun_id
    GROUP BY
      m.magaza_id,
      m.magaza_ad
    ORDER BY
      m.magaza_id;
  `;

  connection.query(query, (error, results, fields) => {
    connection.end();

    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(results);
  });
});


app.get('/admin/fetch-products-with-sales-by-store', (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  const query = `
        SELECT u.*, k.kategori_ad, m.magaza_ad, SUM(s.satis_adedi) AS toplam_satis
        FROM urunler u
        LEFT JOIN kategoriler k ON u.kategori_id = k.kategori_id
        LEFT JOIN satislar s ON u.urun_id = s.urun_id
        LEFT JOIN magazalar m ON s.magaza_id = m.magaza_id
        GROUP BY u.urun_id, m.magaza_id
    `;

  connection.query(query, (error, results, fields) => {
    connection.end();

    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(results);
  });
});


app.get('/admin/fetch-categories', (req, res) => {
  const connection = mysql.createConnection(dbConfig);

  const query = `
        SELECT k.*, COUNT(u.urun_id) AS urun_sayisi
        FROM kategoriler k
        LEFT JOIN urunler u ON k.kategori_id = u.kategori_id
        GROUP BY k.kategori_id
    `;

  connection.query(query, (error, results, fields) => {
    if (error) {
      connection.end();
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Send the data as JSON
    res.json(results);

    connection.end();
  });
});



app.get('/admin/fetch-products', (req, res) => {

  const connection = mysql.createConnection(dbConfig);

  const query = `
        SELECT u.*, k.kategori_ad
        FROM urunler u
        JOIN kategoriler k ON u.kategori_id = k.kategori_id
    `;

  connection.query(query, (error, results, fields) => {
    if (error) {
      connection.end();
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Send the data as JSON
    res.json(results);

    connection.end();
  });
});

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.post('/register-post', async (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const { admin_adsoyad, admin_mail, admin_password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(admin_password, saltRounds);
    const query = 'INSERT INTO kullanicilar (admin_adsoyad, admin_mail, admin_password) VALUES (?, ?, ?)';
    connection.query(query, [admin_adsoyad, admin_mail, hashedPassword], (error, results, fields) => {
      if (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ message: 'Registration successful' });
    });
  } catch (error) {
    console.error('Error during password hashing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the database connection
    connection.end();
  }
});


// app.js
app.post('/login-post', async (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const { admin_mail, admin_password } = req.body;

  try {
    // Kullanıcıyı kontrol et
    const query = 'SELECT * FROM admin WHERE admin_mail = ?';
    connection.query(query, [admin_mail], async (error, results, fields) => {
      if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const hashedPassword = results[0].admin_password;

      // Şifre karşılaştırması
      const match = await bcrypt.compare(admin_password, hashedPassword);

      if (match) {
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    connection.end();
  }
});




const server = http.createServer(app);

// Tüm bağlantıları takip etmek için
let connections = [];

server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => {
        connections = connections.filter(curr => curr !== connection);
    });
});

server.listen(3000, () => {
    console.log('Uygulama çalıştırıldı... (Kapatmak için Ctrl+C)');
});

// Graceful shutdown işlemi
function shutdown() {
    console.log('\nKapatma sinyali alındı...');
    
    server.close(() => {
        console.log('Sunucu kapatıldı.');
        
        // Tüm açık bağlantıları kapat
        connections.forEach(curr => curr.end());
        
        // MySQL bağlantısını kapat
        const connection = mysql.createConnection(dbConfig);
        connection.end((err) => {
            if (err) {
                console.error('MySQL bağlantısı kapatılırken hata:', err);
            } else {
                console.log('MySQL bağlantısı kapatıldı.');
            }
            process.exit(0);
        });
    });

    // 5 saniye içinde kapanmazsa zorla kapat
    setTimeout(() => {
        console.error('Zorla kapatılıyor...');
        process.exit(1);
    }, 5000);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
