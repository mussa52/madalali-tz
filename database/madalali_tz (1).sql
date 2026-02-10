-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 05, 2026 at 03:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `madalali_tz`
--

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','responded','closed') NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `property_id`, `client_id`, `agent_id`, `subject`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 6, 10, 9, 'i have ineterested with this house', 'can get more information', 'new', '2026-02-05 13:09:57', '2026-02-05 13:09:57'),
(2, 9, 14, 13, 'interested', 'more infomation abaut it', 'new', '2026-02-05 13:54:06', '2026-02-05 13:54:06');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `property_type` enum('house','apartment','land','commercial','villa','condo') NOT NULL,
  `listing_type` enum('sale','rent') NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `location` varchar(200) NOT NULL,
  `city` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `area_sqm` decimal(10,2) DEFAULT NULL,
  `parking_spaces` int(11) DEFAULT NULL,
  `features` text DEFAULT NULL,
  `agent_id` int(11) NOT NULL,
  `status` enum('pending','approved','rejected','sold','rented') NOT NULL DEFAULT 'pending',
  `views_count` int(11) DEFAULT 0,
  `featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id`, `title`, `description`, `property_type`, `listing_type`, `price`, `location`, `city`, `address`, `bedrooms`, `bathrooms`, `area_sqm`, `parking_spaces`, `features`, `agent_id`, `status`, `views_count`, `featured`, `created_at`, `updated_at`) VALUES
(6, 'house', 'luxury apartment for good life', 'apartment', 'rent', 2300000.00, 'masaki', 'Dar es salaam', 'mau@gmail.com', 4, 2, 0.00, 1, '[]', 9, 'approved', 6, 0, '2026-02-05 12:38:10', '2026-02-05 13:26:03'),
(7, 'car', 'luxury car', 'commercial', 'sale', 25000000.00, 'mbezi', 'Dar es salaam', 'amos@gmail.com', 0, 0, 0.00, 0, '[]', 11, 'approved', 0, 0, '2026-02-05 13:39:15', '2026-02-05 13:50:32'),
(8, 'beach plot', 'Good land for life', 'land', 'sale', 55000000.00, 'kawe', 'Dar es salaam', 'seba@gmail.com', 0, 0, 167.00, 0, '[]', 12, 'approved', 0, 0, '2026-02-05 13:44:37', '2026-02-05 13:50:28'),
(9, 'furniture', 'Good furniture for your house', 'commercial', 'sale', 500000.00, 'kigamboni', 'Dar es salaam', 'mawi@gmail.com', 0, 0, 0.00, 0, '[]', 13, 'approved', 2, 0, '2026-02-05 13:49:08', '2026-02-05 13:53:31');

-- --------------------------------------------------------

--
-- Table structure for table `property_images`
--

CREATE TABLE `property_images` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property_images`
--

INSERT INTO `property_images` (`id`, `property_id`, `image_url`, `is_primary`, `display_order`, `created_at`) VALUES
(5, 6, '/uploads/1770295090643-352725059.jpg', 1, 0, '2026-02-05 12:38:10'),
(6, 7, '/uploads/1770298755957-520698213.jpg', 1, 0, '2026-02-05 13:39:15'),
(7, 8, '/uploads/1770299077515-115482821.jpg', 1, 0, '2026-02-05 13:44:37'),
(8, 9, '/uploads/1770299348565-924606735.jpg', 1, 0, '2026-02-05 13:49:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('admin','agent','client') NOT NULL DEFAULT 'client',
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role`, `status`, `profile_image`, `created_at`, `updated_at`) VALUES
(4, 'New Admin', 'newadmin@madalali.tz', '$2a$10$1GrUBBaiKzE7FHwu8MdzC.hI9ieEa9eI444oKW0r7ftaVNjK6bqHi', '0712345678', 'admin', 'active', NULL, '2026-01-26 10:34:05', '2026-01-26 10:34:05'),
(9, 'mau', 'mau@gmail.com', '$2a$10$ErZOSKpz1JwYoa2102GSx.FuVOOcAsf1tt1JBPiPQL4QK/8xFurr.', '0789238945', 'agent', 'active', NULL, '2026-02-05 12:03:52', '2026-02-05 12:03:52'),
(10, 'musa', 'musa@gmail.com', '$2a$10$HdT6dkftJ.EmHpEpkvnNEOPXwcYb15Jyqlddf9BFTE5AIO7P1Y9za', '0778901234', 'client', 'active', NULL, '2026-02-05 12:42:45', '2026-02-05 12:42:45'),
(11, 'amos@madalali.tz', 'amos@gamil.com', '$2a$10$TxbO69PQUW7NlQc234RYb.MsVH5.L2mRtj.gOY3mtekc5Mc/G3YAu', '0656328956', 'agent', 'active', NULL, '2026-02-05 13:37:07', '2026-02-05 13:37:07'),
(12, 'seba@madalali.tz', 'seba@gmail.com', '$2a$10$13.JzsYtp06Ug9rK3t8UZ.0j6JAkkFTk1Kk7a0W05nx99fZfZAUPS', '0745781234', 'agent', 'active', NULL, '2026-02-05 13:40:44', '2026-02-05 13:40:44'),
(13, 'mawi@madalali.tz', 'mawi@gmail.com', '$2a$10$as/46veErfg11SjYUD5tju4V9.ZLZP5aexODAQ12ysuVMveJV5gXC', '0789125632', 'agent', 'active', NULL, '2026-02-05 13:45:50', '2026-02-05 13:45:50'),
(14, 'kevi@madalali.tz', 'kevi@gmail.com', '$2a$10$f4rY2w7H2cEGe8PoF/cNC.QSmKeZFQ5r04K1/t0c/f0GcPXRHE..G', '0789236127', 'client', 'active', NULL, '2026-02-05 13:52:27', '2026-02-05 13:52:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_property` (`property_id`),
  ADD KEY `idx_client` (`client_id`),
  ADD KEY `idx_agent` (`agent_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_entity` (`entity_type`,`entity_id`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_agent` (`agent_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_property_type` (`property_type`),
  ADD KEY `idx_listing_type` (`listing_type`),
  ADD KEY `idx_location` (`city`,`location`),
  ADD KEY `idx_price` (`price`);

--
-- Indexes for table `property_images`
--
ALTER TABLE `property_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_property` (`property_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD CONSTRAINT `inquiries_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inquiries_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inquiries_ibfk_3` FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `property_images`
--
ALTER TABLE `property_images`
  ADD CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
