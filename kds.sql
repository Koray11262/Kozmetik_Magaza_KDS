-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1:3306
-- Üretim Zamanı: 29 Ara 2024, 23:50:25
-- Sunucu sürümü: 9.1.0
-- PHP Sürümü: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `kds`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kategoriler`
--

DROP TABLE IF EXISTS `kategoriler`;
CREATE TABLE IF NOT EXISTS `kategoriler` (
  `kategori_id` int NOT NULL AUTO_INCREMENT,
  `kategori_ad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `aciklama` text CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`kategori_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

--
-- Tablo döküm verisi `kategoriler`
--

INSERT INTO `kategoriler` (`kategori_id`, `kategori_ad`, `aciklama`, `created_at`, `updated_at`) VALUES
(1, 'Parfüm', 'Kadın ve erkek parfümleri', '2024-12-29 22:32:14', '2024-12-29 22:32:14'),
(2, 'Makyaj', 'Ruj, fondöten, maskara vb.', '2024-12-29 22:32:14', '2024-12-29 22:32:14'),
(3, 'Cilt Bakımı', 'Kremler, serumlar, temizleyiciler', '2024-12-29 22:32:14', '2024-12-29 22:32:14'),
(4, 'Saç Bakımı', 'Şampuan, saç kremi, saç maskesi', '2024-12-29 22:32:14', '2024-12-29 22:32:14'),
(5, 'Güneş Ürünleri', 'Güneş kremleri ve bronzlaştırıcılar', '2024-12-29 22:32:14', '2024-12-29 22:32:14');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `magazalar`
--

DROP TABLE IF EXISTS `magazalar`;
CREATE TABLE IF NOT EXISTS `magazalar` (
  `magaza_id` int NOT NULL AUTO_INCREMENT,
  `magaza_ad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `adres` text CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci,
  `telefon` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`magaza_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

--
-- Tablo döküm verisi `magazalar`
--

INSERT INTO `magazalar` (`magaza_id`, `magaza_ad`, `adres`, `telefon`, `email`, `created_at`, `updated_at`) VALUES
(1, 'Merkez Mağaza', 'Atatürk Cad. No:123 İstanbul', '0212-555-0001', 'merkez@kozmetik.com', '2024-12-29 22:32:42', '2024-12-29 22:32:42'),
(2, 'AVM Şubesi', 'ABC AVM Kat:2 No:45 İstanbul', '0212-555-0002', 'avm@kozmetik.com', '2024-12-29 22:32:42', '2024-12-29 22:32:42'),
(3, 'Kadıköy Şubesi', 'Bahariye Cad. No:78 İstanbul', '0216-555-0003', 'kadikoy@kozmetik.com', '2024-12-29 22:32:42', '2024-12-29 22:32:42');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `satislar`
--

DROP TABLE IF EXISTS `satislar`;
CREATE TABLE IF NOT EXISTS `satislar` (
  `satis_id` int NOT NULL AUTO_INCREMENT,
  `magaza_id` int DEFAULT NULL,
  `urun_id` int DEFAULT NULL,
  `miktar` int NOT NULL,
  `birim_fiyat` decimal(10,2) NOT NULL,
  `toplam_fiyat` decimal(10,2) NOT NULL,
  `satis_tarihi` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sezon_id` int DEFAULT NULL,
  PRIMARY KEY (`satis_id`),
  KEY `magaza_id` (`magaza_id`),
  KEY `urun_id` (`urun_id`),
  KEY `sezon_id` (`sezon_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

--
-- Tablo döküm verisi `satislar`
--

INSERT INTO `satislar` (`satis_id`, `magaza_id`, `urun_id`, `miktar`, `birim_fiyat`, `toplam_fiyat`, `satis_tarihi`, `sezon_id`) VALUES
(1, 1, 1, 2, 2500.00, 5000.00, '2024-12-29 22:33:18', 1),
(2, 2, 2, 5, 450.00, 2250.00, '2024-12-29 22:33:18', 1),
(3, 3, 3, 10, 150.00, 1500.00, '2024-12-29 22:33:18', 1),
(4, 1, 4, 8, 120.00, 960.00, '2024-12-29 22:33:18', 2),
(5, 2, 5, 3, 350.00, 1050.00, '2024-12-29 22:33:18', 2),
(6, 1, 1, 3, 2500.00, 7500.00, '2024-12-29 21:00:00', 1),
(7, 2, 2, 2, 3200.00, 6400.00, '2024-12-29 21:00:00', 1),
(8, 1, 3, 4, 2800.00, 11200.00, '2024-12-29 21:00:00', 1),
(9, 3, 4, 2, 2900.00, 5800.00, '2024-12-29 21:00:00', 1),
(10, 1, 5, 5, 450.00, 2250.00, '2024-12-29 21:00:00', 1),
(11, 2, 6, 8, 350.00, 2800.00, '2024-12-29 21:00:00', 1),
(12, 3, 7, 6, 550.00, 3300.00, '2024-12-29 21:00:00', 1),
(13, 1, 8, 4, 480.00, 1920.00, '2024-12-29 21:00:00', 1),
(14, 2, 9, 10, 380.00, 3800.00, '2024-12-29 21:00:00', 1),
(15, 3, 10, 7, 290.00, 2030.00, '2024-12-29 21:00:00', 1),
(16, 1, 11, 12, 320.00, 3840.00, '2024-12-29 21:00:00', 1),
(17, 2, 12, 5, 420.00, 2100.00, '2024-12-29 21:00:00', 1),
(18, 3, 13, 8, 450.00, 3600.00, '2024-12-29 21:00:00', 1),
(19, 1, 14, 15, 120.00, 1800.00, '2024-12-29 21:00:00', 1),
(20, 2, 15, 6, 380.00, 2280.00, '2024-12-29 21:00:00', 1),
(21, 3, 16, 9, 150.00, 1350.00, '2024-12-29 21:00:00', 1),
(22, 1, 17, 4, 350.00, 1400.00, '2024-12-29 21:00:00', 1),
(23, 2, 18, 7, 280.00, 1960.00, '2024-12-29 21:00:00', 1),
(24, 3, 19, 5, 180.00, 900.00, '2024-12-29 21:00:00', 1),
(25, 1, 20, 6, 320.00, 1920.00, '2024-12-29 21:00:00', 1),
(26, 1, 1, 2, 2500.00, 5000.00, '2024-11-29 21:00:00', 1),
(27, 2, 2, 3, 3200.00, 9600.00, '2024-11-29 21:00:00', 1),
(28, 3, 3, 1, 2800.00, 2800.00, '2024-11-29 21:00:00', 1),
(29, 1, 4, 4, 2900.00, 11600.00, '2024-11-29 21:00:00', 1),
(30, 1, 1, 15, 2500.00, 37500.00, '2024-12-29 21:00:00', NULL),
(31, 2, 2, 12, 3200.00, 38400.00, '2024-12-29 21:00:00', NULL),
(32, 1, 3, 10, 2800.00, 28000.00, '2024-12-29 21:00:00', NULL),
(33, 3, 4, 8, 2900.00, 23200.00, '2024-12-29 21:00:00', NULL),
(34, 1, 5, 25, 450.00, 11250.00, '2024-12-29 21:00:00', NULL),
(35, 2, 6, 30, 350.00, 10500.00, '2024-12-29 21:00:00', NULL),
(36, 3, 7, 20, 550.00, 11000.00, '2024-12-29 21:00:00', NULL),
(37, 1, 8, 15, 480.00, 7200.00, '2024-12-29 21:00:00', NULL),
(38, 2, 9, 35, 380.00, 13300.00, '2024-12-29 21:00:00', NULL),
(39, 3, 10, 28, 290.00, 8120.00, '2024-12-29 21:00:00', NULL),
(40, 1, 11, 40, 320.00, 12800.00, '2024-12-29 21:00:00', NULL),
(41, 2, 12, 25, 420.00, 10500.00, '2024-12-29 21:00:00', NULL),
(42, 3, 13, 15, 450.00, 6750.00, '2024-12-29 21:00:00', NULL),
(43, 1, 14, 30, 120.00, 3600.00, '2024-12-29 21:00:00', NULL),
(44, 2, 15, 12, 380.00, 4560.00, '2024-12-29 21:00:00', NULL),
(45, 3, 16, 20, 150.00, 3000.00, '2024-12-29 21:00:00', NULL),
(46, 1, 17, 10, 350.00, 3500.00, '2024-12-29 21:00:00', NULL),
(47, 2, 18, 15, 280.00, 4200.00, '2024-12-29 21:00:00', NULL),
(48, 3, 19, 12, 180.00, 2160.00, '2024-12-29 21:00:00', NULL),
(49, 1, 20, 8, 320.00, 2560.00, '2024-12-29 21:00:00', NULL),
(50, 1, 1, 5, 2500.00, 12500.00, '2024-11-29 21:00:00', NULL),
(51, 2, 6, 10, 350.00, 3500.00, '2024-11-29 21:00:00', NULL),
(52, 3, 9, 8, 380.00, 3040.00, '2024-11-29 21:00:00', NULL),
(53, 1, 13, 6, 450.00, 2700.00, '2024-11-29 21:00:00', NULL),
(54, 2, 17, 4, 350.00, 1400.00, '2024-11-29 21:00:00', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sezonlar`
--

DROP TABLE IF EXISTS `sezonlar`;
CREATE TABLE IF NOT EXISTS `sezonlar` (
  `sezon_id` int NOT NULL AUTO_INCREMENT,
  `sezon_ad` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `baslangic_tarih` date DEFAULT NULL,
  `bitis_tarih` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sezon_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

--
-- Tablo döküm verisi `sezonlar`
--

INSERT INTO `sezonlar` (`sezon_id`, `sezon_ad`, `baslangic_tarih`, `bitis_tarih`, `created_at`, `updated_at`) VALUES
(1, 'Yaz 2024', '2024-06-01', '2024-08-31', '2024-12-29 22:32:51', '2024-12-29 22:32:51'),
(2, 'Sonbahar 2024', '2024-09-01', '2024-11-30', '2024-12-29 22:32:51', '2024-12-29 22:32:51'),
(3, 'Kış 2024', '2024-12-01', '2025-02-28', '2024-12-29 22:32:51', '2024-12-29 22:32:51');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `stok`
--

DROP TABLE IF EXISTS `stok`;
CREATE TABLE IF NOT EXISTS `stok` (
  `stok_id` int NOT NULL AUTO_INCREMENT,
  `urun_id` int NOT NULL,
  `magaza_id` int NOT NULL,
  `miktar` int NOT NULL DEFAULT '0',
  `minimum_stok` int DEFAULT '10',
  `son_guncelleme` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`stok_id`),
  KEY `urun_id` (`urun_id`),
  KEY `magaza_id` (`magaza_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

--
-- Tablo döküm verisi `stok`
--

TRUNCATE TABLE stok;

INSERT INTO stok (urun_id, magaza_id, miktar, minimum_stok, son_guncelleme) VALUES
-- Normal stok seviyeleri
(1, 1, 50, 20, CURRENT_TIMESTAMP),
(2, 1, 45, 20, CURRENT_TIMESTAMP),
(3, 1, 40, 15, CURRENT_TIMESTAMP),
(4, 1, 35, 15, CURRENT_TIMESTAMP),
(5, 2, 60, 30, CURRENT_TIMESTAMP),
(6, 2, 55, 25, CURRENT_TIMESTAMP),
(7, 2, 45, 20, CURRENT_TIMESTAMP),
(8, 2, 40, 20, CURRENT_TIMESTAMP),
(9, 3, 70, 35, CURRENT_TIMESTAMP),
(10, 3, 65, 30, CURRENT_TIMESTAMP),

-- Kritik stok seviyeleri (6 ürün)
(11, 1, 5, 25, CURRENT_TIMESTAMP),  -- Fit Me Fondöten - Kritik
(12, 2, 4, 20, CURRENT_TIMESTAMP),  -- Better Than Sex Maskara - Kritik
(13, 3, 3, 15, CURRENT_TIMESTAMP),  -- Dipbrow Pomade - Kritik
(14, 1, 8, 30, CURRENT_TIMESTAMP),  -- Nemlendirici Krem - Kritik
(15, 2, 5, 25, CURRENT_TIMESTAMP),  -- Vitamin C Serum - Kritik
(16, 3, 6, 20, CURRENT_TIMESTAMP);  -- Temizleme Jeli - Kritik

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `urunler`
--

DROP TABLE IF EXISTS `urunler`;
CREATE TABLE IF NOT EXISTS `urunler` (
  `urun_id` int NOT NULL AUTO_INCREMENT,
  `urun_ad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `kategori_id` int DEFAULT NULL,
  `barkod` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `marka` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `model` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `fiyat` decimal(10,2) NOT NULL,
  `maliyet` decimal(10,2) DEFAULT NULL,
  `aciklama` text CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`urun_id`),
  UNIQUE KEY `barkod` (`barkod`),
  KEY `kategori_id` (`kategori_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

--
-- Tablo döküm verisi `urunler`
--

INSERT INTO `urunler` (`urun_id`, `urun_ad`, `kategori_id`, `barkod`, `marka`, `model`, `fiyat`, `maliyet`, `aciklama`, `created_at`, `updated_at`) VALUES
(1, 'Chanel No.5', 1, 'PRF001', 'Chanel', 'No.5', 2500.00, 1500.00, 'Klasik kadın parfümü', '2024-12-29 22:33:01', '2024-12-29 22:33:01'),
(2, 'MAC Ruj', 2, 'MKJ001', 'MAC', 'Ruby Woo', 450.00, 200.00, 'Mat kırmızı ruj', '2024-12-29 22:33:01', '2024-12-29 22:33:01'),
(3, 'Nivea Krem', 3, 'CLD001', 'Nivea', 'Soft', 150.00, 75.00, 'Nemlendirici krem', '2024-12-29 22:33:01', '2024-12-29 22:33:01'),
(4, 'Pantene Şampuan', 4, 'SAC001', 'Pantene', 'Pro-V', 120.00, 60.00, 'Temel bakım şampuanı', '2024-12-29 22:33:01', '2024-12-29 22:33:01'),
(5, 'La Roche Posay', 5, 'GNS001', 'La Roche Posay', 'Anthelios', 350.00, 175.00, 'SPF 50+ güneş kremi', '2024-12-29 22:33:01', '2024-12-29 22:33:01'),
(6, 'Light Blue', 1, NULL, 'Dolce & Gabbana', 'EDT 100ml', 2500.00, 1500.00, NULL, '2024-12-29 23:18:59', '2024-12-29 23:18:59'),
(7, 'Good Girl', 1, NULL, 'Carolina Herrera', 'EDP 80ml', 3200.00, 1800.00, NULL, '2024-12-29 23:18:59', '2024-12-29 23:18:59'),
(8, 'La Vie Est Belle', 1, NULL, 'Lancome', 'EDP 100ml', 2800.00, 1600.00, NULL, '2024-12-29 23:18:59', '2024-12-29 23:18:59'),
(9, 'Sauvage', 1, NULL, 'Dior', 'EDT 100ml', 2900.00, 1700.00, NULL, '2024-12-29 23:18:59', '2024-12-29 23:18:59'),
(10, 'Ruby Woo Ruj', 2, NULL, 'MAC', 'Matte', 450.00, 200.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(11, 'Fit Me Fondöten', 2, NULL, 'Maybelline', '220 Natural Beige', 350.00, 150.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(12, 'Better Than Sex Maskara', 2, NULL, 'Too Faced', 'Siyah', 550.00, 250.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(13, 'Dipbrow Pomade', 2, NULL, 'Anastasia Beverly Hills', 'Dark Brown', 480.00, 220.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(14, 'Nemlendirici Krem', 3, NULL, 'La Roche Posay', 'Effaclar', 380.00, 180.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(15, 'Vitamin C Serum', 3, NULL, 'The Ordinary', '30ml', 290.00, 130.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(16, 'Temizleme Jeli', 3, NULL, 'CeraVe', 'Normal Cilt', 320.00, 150.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(17, 'Gece Kremi', 3, NULL, 'Neutrogena', 'Retinol', 420.00, 200.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(18, 'Şampuan', 4, NULL, 'Kerastase', 'Nutritive', 450.00, 220.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(19, 'Saç Kremi', 4, NULL, 'Pantene', 'Pro-V', 120.00, 50.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(20, 'Saç Maskesi', 4, NULL, 'Moroccan Oil', 'Treatment', 380.00, 180.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(21, 'Saç Serumu', 4, NULL, 'L\'Oreal', 'Elseve', 150.00, 70.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(22, 'Güneş Kremi SPF50', 5, NULL, 'La Roche Posay', 'Anthelios', 350.00, 170.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(23, 'Bronzlaştırıcı Yağ', 5, NULL, 'Hawaiian Tropic', 'SPF15', 280.00, 130.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(24, 'After Sun', 5, NULL, 'Nivea', 'Aloe Vera', 180.00, 80.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03'),
(25, 'Güneş Spreyi', 5, NULL, 'Bioderma', 'Photoderm', 320.00, 150.00, NULL, '2024-12-29 23:20:03', '2024-12-29 23:20:03');

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `satislar`
--
ALTER TABLE `satislar`
  ADD CONSTRAINT `satislar_ibfk_1` FOREIGN KEY (`magaza_id`) REFERENCES `magazalar` (`magaza_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `satislar_ibfk_2` FOREIGN KEY (`urun_id`) REFERENCES `urunler` (`urun_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `satislar_ibfk_3` FOREIGN KEY (`sezon_id`) REFERENCES `sezonlar` (`sezon_id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `stok`
--
ALTER TABLE `stok`
  ADD CONSTRAINT `stok_ibfk_1` FOREIGN KEY (`urun_id`) REFERENCES `urunler` (`urun_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stok_ibfk_2` FOREIGN KEY (`magaza_id`) REFERENCES `magazalar` (`magaza_id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `urunler`
--
ALTER TABLE `urunler`
  ADD CONSTRAINT `urunler_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `kategoriler` (`kategori_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Sezonları ekle
INSERT INTO sezonlar (sezon_ad) VALUES 
('İlkbahar 2022'),
('Yaz 2022'),
('Sonbahar 2022'),
('Kış 2022'),
('İlkbahar 2023'),
('Yaz 2023'),
('Sonbahar 2023'),
('Kış 2023');

-- Her sezon için örnek satışlar oluştur
INSERT INTO satislar (urun_id, magaza_id, sezon_id, miktar, birim_fiyat, toplam_fiyat, satis_tarihi) 
SELECT 
    -- Rastgele bir ürün seç (1-10 arası)
    FLOOR(1 + RAND() * 10) as urun_id,
    -- Rastgele bir mağaza seç (1-5 arası)
    FLOOR(1 + RAND() * 5) as magaza_id,
    -- Sezon ID'si
    s.sezon_id,
    -- Miktar (1-10 arası)
    FLOOR(1 + RAND() * 10) as miktar,
    -- Birim fiyat (100-1000 arası)
    ROUND(100 + RAND() * 900, 2) as birim_fiyat,
    -- Toplam fiyat (miktar * birim_fiyat)
    ROUND((FLOOR(1 + RAND() * 10)) * (100 + RAND() * 900), 2) as toplam_fiyat,
    -- Satış tarihi (sezona göre)
    CASE 
        WHEN s.sezon_ad LIKE '%İlkbahar 2022%' THEN DATE_ADD('2022-03-01', INTERVAL FLOOR(RAND() * 90) DAY)
        WHEN s.sezon_ad LIKE '%Yaz 2022%' THEN DATE_ADD('2022-06-01', INTERVAL FLOOR(RAND() * 90) DAY)
        WHEN s.sezon_ad LIKE '%Sonbahar 2022%' THEN DATE_ADD('2022-09-01', INTERVAL FLOOR(RAND() * 90) DAY)
        WHEN s.sezon_ad LIKE '%Kış 2022%' THEN DATE_ADD('2022-12-01', INTERVAL FLOOR(RAND() * 90) DAY)
        WHEN s.sezon_ad LIKE '%İlkbahar 2023%' THEN DATE_ADD('2023-03-01', INTERVAL FLOOR(RAND() * 90) DAY)
        WHEN s.sezon_ad LIKE '%Yaz 2023%' THEN DATE_ADD('2023-06-01', INTERVAL FLOOR(RAND() * 90) DAY)
        WHEN s.sezon_ad LIKE '%Sonbahar 2023%' THEN DATE_ADD('2023-09-01', INTERVAL FLOOR(RAND() * 90) DAY)
        WHEN s.sezon_ad LIKE '%Kış 2023%' THEN DATE_ADD('2023-12-01', INTERVAL FLOOR(RAND() * 90) DAY)
    END as satis_tarihi
FROM sezonlar s
-- Her sezon için 50 satış kaydı oluştur
CROSS JOIN (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) n1
CROSS JOIN (SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) n2
WHERE s.sezon_ad LIKE '%2022%' OR s.sezon_ad LIKE '%2023%';

-- Toplam fiyatları güncelle (miktar * birim_fiyat)
UPDATE satislar 
SET toplam_fiyat = miktar * birim_fiyat 
WHERE sezon_id IN (SELECT sezon_id FROM sezonlar WHERE sezon_ad LIKE '%2022%' OR sezon_ad LIKE '%2023%');
