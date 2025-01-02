const http = require('http');
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const dbConfig = require('./dbConfig');
const fs = require('fs');

const app = express();

// 1. Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Debug middleware - daha detaylı log için
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test route'u ekleyelim
app.get('/', (req, res) => {
  res.send('Sunucu çalışıyor!');
});

// Admin route'ları - hem Türkçe hem İngilizce destekleyelim
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'nodejs', 'admin', 'index.html'));
});

app.get(['/admin/products', '/admin/urunler'], (req, res) => {
  res.sendFile(path.join(__dirname, 'nodejs', 'admin', 'products.html'));
});

app.get(['/admin/stock', '/admin/stok'], (req, res) => {
  res.sendFile(path.join(__dirname, 'nodejs', 'admin', 'stock.html'));
});

app.get(['/admin/sales', '/admin/satislar'], (req, res) => {
  res.sendFile(path.join(__dirname, 'nodejs', 'admin', 'sales.html'));
});

app.get(['/admin/categories', '/admin/kategoriler'], (req, res) => {
  res.sendFile(path.join(__dirname, 'nodejs', 'admin', 'categories.html'));
});

app.get(['/admin/seasons', '/admin/sezonlar'], (req, res) => {
  res.sendFile(path.join(__dirname, 'nodejs', 'admin', 'sezon.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'nodejs', 'admin', 'login.html'));
});

app.get('/admin/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'nodejs', 'admin', 'register.html'));
});

// 3. Statik dosya servisi
app.use(express.static(path.join(__dirname, 'nodejs', 'admin')));
app.use('/vendor', express.static(path.join(__dirname, 'nodejs', 'admin', 'vendor')));
app.use('/css', express.static(path.join(__dirname, 'nodejs', 'admin', 'css')));
app.use('/js', express.static(path.join(__dirname, 'nodejs', 'admin', 'js')));
app.use('/img', express.static(path.join(__dirname, 'nodejs', 'admin', 'img')));

// API Endpoints
app.get('/admin/fetch-products', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  const query = 'SELECT * FROM urunler';
  
  connection.query(query, (error, results) => {
    connection.end();
    if (error) {
      console.error('Veritabanı hatası:', error);
      return res.status(500).json({ error: 'Veritabanı hatası' });
    }
    res.json(results);
  });
});

app.get('/admin/fetch-stock', (req, res) => {
  const connection = mysql.createConnection(dbConfig);
  
  // Bağlantı kontrolü
  connection.connect((err) => {
    if (err) {
      console.error('MySQL Bağlantı Hatası:', err);
      return res.status(500).json({ 
        error: 'Veritabanı bağlantı hatası',
        details: err.message 
      });
    }

    const query = `
        SELECT 
            s.stok_id,
            u.urun_ad,
            m.magaza_ad,
            s.miktar,
            s.minimum_stok,
            CASE 
                WHEN s.miktar <= s.minimum_stok THEN 'Kritik'
                WHEN s.miktar <= s.minimum_stok * 1.5 THEN 'Uyarı'
                ELSE 'Normal'
            END as stok_durumu,
            s.son_guncelleme,
            u.fiyat
        FROM stok s
        JOIN urunler u ON s.urun_id = u.urun_id
        JOIN magazalar m ON s.magaza_id = m.magaza_id
        ORDER BY 
            CASE 
                WHEN s.miktar <= s.minimum_stok THEN 1
                WHEN s.miktar <= s.minimum_stok * 1.5 THEN 2
                ELSE 3
            END,
            s.miktar ASC`;

    console.log('SQL Sorgusu:', query);

    connection.query(query, (error, results) => {
      if (error) {
        console.error('MySQL Sorgu Hatası:', error);
        connection.end();
        return res.status(500).json({ 
          error: 'Veritabanı sorgu hatası',
          details: error.message 
        });
      }

      console.log('Stok verileri başarıyla çekildi. Kayıt sayısı:', results.length);
      connection.end();
      res.json(results);
    });
  });
});

// MySQL bağlantı havuzu oluştur
const pool = mysql.createPool(dbConfig);

// Bağlantı testi endpoint'i
app.get('/test-db', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('MySQL Bağlantı Test Hatası:', err);
      return res.status(500).json({ 
        error: 'Veritabanı bağlantı hatası',
        details: err.message 
      });
    }
    
    connection.release();
    res.json({ message: 'Veritabanı bağlantısı başarılı!' });
  });
});

// Kategori bazlı satış dağılımı için endpoint
app.get('/admin/fetch-category-sales', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    
    const query = `
        SELECT 
            k.kategori_ad,
            COUNT(DISTINCT u.urun_id) as urun_sayisi,
            COUNT(DISTINCT s.satis_id) as satis_sayisi,
            COALESCE(SUM(s.toplam_fiyat), 0) as toplam_satis,
            ROUND(
                (COUNT(DISTINCT s.satis_id) * 100.0 / (
                    SELECT COUNT(DISTINCT satis_id) 
                    FROM satislar
                )), 2
            ) as yuzde
        FROM kategoriler k
        LEFT JOIN urunler u ON k.kategori_id = u.kategori_id
        LEFT JOIN satislar s ON u.urun_id = s.urun_id
        GROUP BY k.kategori_id, k.kategori_ad
        HAVING satis_sayisi > 0
        ORDER BY satis_sayisi DESC
    `;
    
    connection.query(query, (error, results) => {
        connection.end();
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }

        // Yüzdeleri düzelt ve formatla
        const total = results.reduce((sum, item) => sum + item.satis_sayisi, 0);
        results.forEach(item => {
            item.yuzde = ((item.satis_sayisi / total) * 100).toFixed(2);
        });

        res.json(results);
    });
});

// Mağaza bazlı satış performansı için endpoint
app.get('/admin/fetch-store-performance', (req, res) => {
    const query = `
        SELECT 
            m.magaza_ad,
            COUNT(s.satis_id) as satis_adedi,
            COALESCE(SUM(s.toplam_fiyat), 0) as toplam_satis,
            COALESCE(ROUND(AVG(NULLIF(s.toplam_fiyat, 0)), 2), 0) as ortalama_satis,
            COALESCE(ROUND(
                (COUNT(s.satis_id) * 100.0 / (
                    SELECT COUNT(satis_id) 
                    FROM satislar 
                    WHERE magaza_id = m.magaza_id
                )), 2
            ), 0) as performans
        FROM magazalar m
        LEFT JOIN satislar s ON m.magaza_id = s.magaza_id
        GROUP BY m.magaza_id, m.magaza_ad
        ORDER BY toplam_satis DESC`;
    
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }

        // Performans yüzdelerini hesapla
        const maxSales = Math.max(...results.map(item => item.toplam_satis));
        results.forEach(item => {
            item.performans = maxSales > 0 ? 
                Math.round((item.toplam_satis / maxSales) * 100) : 0;
        });

        res.json(results);
    });
});

// Ürün yüzdelikleri için endpoint
app.get('/admin/fetch-product-percentages', (req, res) => {
    const query = `
        SELECT 
            u.urun_ad,
            k.kategori_ad,
            COUNT(s.satis_id) as satis_adedi,
            ROUND(
                (COUNT(s.satis_id) * 100.0 / (
                    SELECT COUNT(*) 
                    FROM satislar
                )), 2
            ) as yuzde
        FROM urunler u
        JOIN kategoriler k ON u.kategori_id = k.kategori_id
        LEFT JOIN satislar s ON u.urun_id = s.urun_id
        GROUP BY u.urun_id, u.urun_ad, k.kategori_ad
        HAVING satis_adedi > 0
        ORDER BY satis_adedi DESC`;
    
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

// Anasayfa istatistikleri için endpoint
app.get('/admin/fetch-dashboard-stats', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    
    const query = `
        SELECT 
            (SELECT COUNT(DISTINCT urun_id) FROM satislar) as toplam_satilan_urun,
            (SELECT SUM(toplam_fiyat) FROM satislar) as toplam_kazanc,
            (SELECT COUNT(*) FROM satislar WHERE MONTH(satis_tarihi) = MONTH(CURRENT_DATE())) as aylik_satis,
            (SELECT SUM(toplam_fiyat - (u.maliyet * s.miktar)) 
             FROM satislar s 
             JOIN urunler u ON s.urun_id = u.urun_id) as toplam_kar
        FROM dual
    `;
    
    connection.query(query, (error, results) => {
        connection.end();
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results[0]);
    });
});

// Ürünleri ve markalarını getiren endpoint
app.get('/admin/fetch-products-with-brands', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    
    const query = `
        SELECT 
            u.urun_id,
            u.urun_ad,
            u.marka,
            u.model,
            u.fiyat,
            u.maliyet,
            k.kategori_ad,
            (SELECT SUM(miktar) FROM stok WHERE urun_id = u.urun_id) as toplam_stok
        FROM urunler u
        LEFT JOIN kategoriler k ON u.kategori_id = k.kategori_id
        ORDER BY u.marka, u.urun_ad
    `;
    
    connection.query(query, (error, results) => {
        connection.end();
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

// Ürün bazında mağaza satışları için endpoint
app.get('/admin/fetch-product-store-sales', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    
    const query = `
        SELECT 
            u.urun_id,
            u.urun_ad,
            u.marka,
            m.magaza_ad,
            k.kategori_ad,
            COUNT(s.satis_id) as satis_adedi,
            SUM(s.miktar) as toplam_miktar,
            SUM(s.toplam_fiyat) as toplam_satis,
            ROUND(
                (COUNT(s.satis_id) * 100.0 / (
                    SELECT COUNT(*) FROM satislar 
                    WHERE urun_id = u.urun_id
                )), 2
            ) as magaza_yuzdesi
        FROM urunler u
        JOIN kategoriler k ON u.kategori_id = k.kategori_id
        JOIN satislar s ON u.urun_id = s.urun_id
        JOIN magazalar m ON s.magaza_id = m.magaza_id
        GROUP BY u.urun_id, m.magaza_id
        ORDER BY u.urun_ad, toplam_satis DESC
    `;
    
    connection.query(query, (error, results) => {
        connection.end();
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

// Kar-zarar analizi için endpoint
app.get('/admin/fetch-profit-analysis', (req, res) => {
    const query = `
        SELECT 
            u.urun_ad,
            u.marka,
            u.fiyat,
            u.maliyet,
            COALESCE(s.miktar, 0) as stok_miktar,
            (u.fiyat - u.maliyet) as birim_kar,
            COALESCE((u.fiyat - u.maliyet) * s.miktar, 0) as potansiyel_kar,
            CASE 
                WHEN u.maliyet > 0 THEN ROUND(((u.fiyat - u.maliyet) / u.maliyet * 100), 2)
                ELSE 0 
            END as kar_yuzdesi
        FROM urunler u
        LEFT JOIN stok s ON u.urun_id = s.urun_id
        WHERE s.miktar > 0
        ORDER BY potansiyel_kar DESC`;

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Kar-zarar analizi hatası:', error);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

// Stok güncelleme endpoint'i
app.post('/admin/update-stock', (req, res) => {
    const { stokId, miktar, minimumStok } = req.body;
    const query = `
        UPDATE stok 
        SET miktar = ?, minimum_stok = ?, son_guncelleme = CURRENT_TIMESTAMP
        WHERE stok_id = ?`;

    connection.query(query, [miktar, minimumStok, stokId], (err, result) => {
        if (err) {
            console.error('Stok güncelleme hatası:', err);
            res.status(500).json({ success: false, error: 'Veritabanı hatası' });
            return;
        }
        res.json({ success: true });
    });
});

// Stok silme endpoint'i
app.delete('/admin/delete-stock/:id', (req, res) => {
    const stokId = req.params.id;
    const query = 'DELETE FROM stok WHERE stok_id = ?';

    connection.query(query, [stokId], (err, result) => {
        if (err) {
            console.error('Stok silme hatası:', err);
            res.status(500).json({ success: false, error: 'Veritabanı hatası' });
            return;
        }
        res.json({ success: true });
    });
});

// Kategori bazlı ürün dağılımı için endpoint
app.get('/admin/fetch-category-products', (req, res) => {
    const query = `
        SELECT 
            k.kategori_ad,
            COUNT(u.urun_id) as urun_sayisi,
            ROUND(
                (COUNT(u.urun_id) * 100.0 / (
                    SELECT COUNT(*) 
                    FROM urunler
                )), 2
            ) as yuzde
        FROM kategoriler k
        LEFT JOIN urunler u ON k.kategori_id = u.kategori_id
        GROUP BY k.kategori_id, k.kategori_ad
        ORDER BY urun_sayisi DESC`;

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Kategori ürün dağılımı hatası:', error);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

// Mağaza iyileştirme önerileri için endpoint
app.get('/admin/fetch-store-improvements', (req, res) => {
    const query = `
        SELECT 
            m.magaza_ad,
            COUNT(DISTINCT s.satis_id) as toplam_satis,
            ROUND(AVG(s.toplam_fiyat), 2) as ortalama_satis,
            SUM(s.toplam_fiyat) as toplam_ciro,
            COUNT(DISTINCT u.urun_id) as urun_cesitliligi,
            (
                SELECT COUNT(*) 
                FROM stok st 
                WHERE st.magaza_id = m.magaza_id 
                AND st.miktar <= st.minimum_stok
            ) as kritik_stok_sayisi,
            ROUND(
                (COUNT(DISTINCT s.satis_id) * 100.0 / (
                    SELECT COUNT(*) FROM satislar
                )), 2
            ) as satis_yuzdesi
        FROM magazalar m
        LEFT JOIN satislar s ON m.magaza_id = s.magaza_id
        LEFT JOIN urunler u ON s.urun_id = u.urun_id
        GROUP BY m.magaza_id, m.magaza_ad
        ORDER BY toplam_ciro DESC`;

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Mağaza analizi hatası:', error);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }

        // Her mağaza için öneriler oluştur
        const improvements = results.map(store => {
            const suggestions = [];
            
            if (store.kritik_stok_sayisi > 0) {
                suggestions.push(`${store.kritik_stok_sayisi} üründe kritik stok seviyesi`);
            }
            
            if (store.satis_yuzdesi < 10) {
                suggestions.push('Satış performansı düşük');
            }
            
            if (store.urun_cesitliligi < 5) {
                suggestions.push('Ürün çeşitliliği artırılmalı');
            }

            return {
                ...store,
                oneriler: suggestions
            };
        });

        res.json(improvements);
    });
});

// Sezon bazlı satış analizi için endpoint
app.get('/admin/fetch-season-sales', (req, res) => {
    const query = `
        SELECT 
            SUBSTRING_INDEX(sz.sezon_ad, ' ', 1) as sezon,
            YEAR(s.satis_tarihi) as yil,
            COUNT(s.satis_id) as satis_adedi,
            COALESCE(SUM(s.toplam_fiyat), 0) as toplam_satis,
            COUNT(DISTINCT u.urun_id) as urun_cesitliligi,
            COALESCE(ROUND(AVG(s.toplam_fiyat), 2), 0) as ortalama_satis
        FROM sezonlar sz
        LEFT JOIN satislar s ON sz.sezon_id = s.sezon_id
        LEFT JOIN urunler u ON s.urun_id = u.urun_id
        WHERE YEAR(s.satis_tarihi) IN (2022, 2023, 2024)
        GROUP BY SUBSTRING_INDEX(sz.sezon_ad, ' ', 1), YEAR(s.satis_tarihi)
        ORDER BY yil DESC, 
            CASE SUBSTRING_INDEX(sz.sezon_ad, ' ', 1)
                WHEN 'İlkbahar' THEN 1
                WHEN 'Yaz' THEN 2
                WHEN 'Sonbahar' THEN 3
                WHEN 'Kış' THEN 4
            END`;

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Sezon analizi hatası:', error);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

// Dashboard istatistikleri için endpoint'ler
app.get('/admin/fetch-total-products', (req, res) => {
    const query = `SELECT COUNT(*) as total FROM urunler`;
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json({ total: results[0].total });
    });
});

app.get('/admin/fetch-total-sales', (req, res) => {
    const query = `SELECT COALESCE(SUM(toplam_fiyat), 0) as total FROM satislar`;
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json({ total: results[0].total });
    });
});

app.get('/admin/fetch-stock-status', (req, res) => {
    const query = `SELECT COALESCE(SUM(miktar), 0) as total FROM stok`;
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json({ total: results[0].total });
    });
});

app.get('/admin/fetch-critical-stock', (req, res) => {
    const query = `
        SELECT COUNT(*) as total 
        FROM stok 
        WHERE miktar <= minimum_stok`;
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json({ total: results[0].total });
    });
});

app.get('/admin/fetch-sales-trend', (req, res) => {
    const query = `
        SELECT 
            DATE_FORMAT(satis_tarihi, '%Y-%m') as ay,
            SUM(toplam_fiyat) as toplam_satis,
            COUNT(*) as satis_adedi
        FROM satislar
        WHERE satis_tarihi >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(satis_tarihi, '%Y-%m')
        ORDER BY ay`;
    
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

app.get('/admin/fetch-category-distribution', (req, res) => {
    const query = `
        SELECT 
            k.kategori_ad,
            COUNT(u.urun_id) as urun_sayisi,
            COALESCE(SUM(s.toplam_fiyat), 0) as toplam_satis
        FROM kategoriler k
        LEFT JOIN urunler u ON k.kategori_id = u.kategori_id
        LEFT JOIN satislar s ON u.urun_id = s.urun_id
        GROUP BY k.kategori_id, k.kategori_ad
        ORDER BY toplam_satis DESC`;
    
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

app.get('/admin/fetch-recent-transactions', (req, res) => {
    const query = `
        SELECT 
            s.satis_tarihi as tarih,
            'Satış' as islem_tipi,
            u.urun_ad,
            s.miktar,
            s.toplam_fiyat as tutar
        FROM satislar s
        JOIN urunler u ON s.urun_id = u.urun_id
        ORDER BY s.satis_tarihi DESC
        LIMIT 10`;
    
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

// Kritik stok detayları için endpoint
app.get('/admin/fetch-critical-stock-details', (req, res) => {
    const query = `
        SELECT 
            u.urun_ad,
            m.magaza_ad,
            s.miktar,
            s.minimum_stok
        FROM stok s
        JOIN urunler u ON s.urun_id = u.urun_id
        JOIN magazalar m ON s.magaza_id = m.magaza_id
        WHERE s.miktar <= s.minimum_stok * 1.5
        ORDER BY 
            CASE 
                WHEN s.miktar <= s.minimum_stok THEN 1
                ELSE 2
            END,
            s.miktar ASC`;
    
    pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

const port = process.env.PORT || 3000;
const host = '0.0.0.0'; // Tüm network arayüzlerinden gelen bağlantıları kabul et

// Server'ı oluştur ve dinle
const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
  console.log(`Dış bağlantılar için: http://${host}:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM sinyali alındı, bağlantılar kapatılıyor...');
  server.close(() => {
    console.log('Sunucu kapatıldı');
    pool.end(() => {
      console.log('MySQL bağlantı havuzu kapatıldı');
      process.exit(0);
    });
  });
});

// Hata yakalama
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} kullanımda. Başka bir port deneyin.`);
  } else {
    console.error('Sunucu hatası:', error);
  }
});
