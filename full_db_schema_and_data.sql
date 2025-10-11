-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 11, 2025 at 01:06 PM
-- Server version: 10.11.11-MariaDB-0+deb12u1
-- PHP Version: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `owncent`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('checking','savings','credit','credit_card','investment','loan') NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `account_type` enum('checking','savings','credit','credit_card','loan','investment','asset','liability','cash') NOT NULL,
  `balance` decimal(15,2) DEFAULT 0.00,
  `availableBalance` decimal(14,2) DEFAULT 0.00,
  `minimumBalance` decimal(14,2) DEFAULT NULL,
  `overdraftLimit` decimal(14,2) DEFAULT NULL,
  `creditLimit` decimal(14,2) DEFAULT NULL,
  `currency` char(3) DEFAULT 'USD',
  `lastUpdated` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `institution` varchar(255) NOT NULL DEFAULT '',
  `institution_name` varchar(255) DEFAULT '',
  `account_number_last4` char(4) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `is_active` tinyint(1) DEFAULT 1,
  `status` enum('active','frozen') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `user_id`, `name`, `type`, `account_name`, `account_type`, `balance`, `availableBalance`, `minimumBalance`, `overdraftLimit`, `creditLimit`, `currency`, `lastUpdated`, `institution`, `institution_name`, `account_number_last4`, `metadata`, `is_active`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '', 'checking', 'Wells Fargo Checking', 'checking', 1230.45, 0.00, NULL, NULL, NULL, 'USD', '2025-10-04 21:51:16', '', 'Wells Fargo', NULL, NULL, 1, 'active', '2025-10-03 09:36:28', '2025-10-03 09:36:28', NULL),
('a50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '', 'checking', 'Emergency Fund', 'savings', 8500.00, 0.00, NULL, NULL, NULL, 'USD', '2025-10-04 21:51:16', '', 'Marcus by Goldman Sachs', NULL, NULL, 1, 'active', '2025-10-03 09:36:28', '2025-10-03 09:36:28', NULL),
('a50e8400-e29b-41d4-a716-446655440007', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '', 'checking', 'Fidelity Roth IRA', 'investment', 45230.78, 0.00, NULL, NULL, NULL, 'USD', '2025-10-05 09:59:02', '', 'Fidelity', NULL, NULL, 1, 'active', '2025-10-03 09:36:28', '2025-10-05 09:59:02', NULL),
('a50e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', '', 'checking', 'Mortgage', 'loan', -285000.00, 0.00, NULL, NULL, NULL, 'USD', '2025-10-04 21:51:16', '', 'Wells Fargo', NULL, NULL, 1, 'active', '2025-10-03 09:36:28', '2025-10-03 09:36:28', NULL),
('a50e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', '', 'checking', 'Auto Loan', 'loan', -18500.00, 0.00, NULL, NULL, NULL, 'USD', '2025-10-04 21:51:16', '', 'Toyota Financial', NULL, NULL, 1, 'active', '2025-10-03 09:36:28', '2025-10-03 09:36:28', NULL),
('a50e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', '', 'checking', 'Main Checking', 'checking', 987.34, 0.00, NULL, NULL, NULL, 'USD', '2025-10-04 21:51:16', '', 'Bank of America', NULL, NULL, 1, 'active', '2025-10-03 09:37:07', '2025-10-03 09:37:07', NULL),
('a50e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', '', 'checking', 'Savings Account', 'savings', 2500.00, 0.00, NULL, NULL, NULL, 'USD', '2025-10-04 21:51:16', '', 'Bank of America', NULL, NULL, 1, 'active', '2025-10-03 09:37:07', '2025-10-03 09:37:07', NULL),
('acc-001-demo-0001-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Main Checking', 'checking', 'Main Checking', 'investment', 15420.00, 0.00, NULL, NULL, NULL, 'NOK', '2025-10-05 10:05:44', '', 'OwnCent Bank', '4821', '{\"minimum_balance\": 500, \"available_balance\": 15420, \"overdraft_limit\": 1000}', 1, 'active', '2025-10-04 00:43:22', '2025-10-05 10:05:44', NULL),
('acc-001-demo-0002-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'High Yield Savings', 'checking', 'High Yield Savings', 'savings', 82000.00, 0.00, NULL, NULL, NULL, 'NOK', '2025-10-04 21:51:16', '', 'Nordic Savings', '7342', '{\"apy\": 4.2, \"available_balance\": 82000}', 1, 'active', '2025-10-04 00:43:22', '2025-10-04 00:43:22', NULL),
('acc-001-demo-0003-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Emergency Fund', 'checking', 'Emergency Fund', 'savings', 47200.00, 0.00, NULL, NULL, NULL, 'NOK', '2025-10-04 21:51:16', '', 'Secure Reserve', '9012', '{\"goal_linked\": \"goal-emergency\"}', 1, 'active', '2025-10-04 00:43:22', '2025-10-04 00:43:22', NULL),
('acc-001-demo-0004-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Mastercard Credit', 'checking', 'Mastercard Credit', 'credit', -18500.00, 0.00, NULL, NULL, NULL, 'NOK', '2025-10-04 21:51:16', '', 'Nordic Credit', '1122', '{\"credit_limit\": 25000, \"interest_rate\": 18.9, \"minimum_payment\": 555}', 1, 'active', '2025-10-04 00:43:22', '2025-10-04 00:43:22', NULL),
('acct_cc', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Visa Credit', 'credit', 'Visa Credit', 'credit', -8000.00, 0.00, NULL, NULL, 20000.00, 'NOK', '2025-10-04 22:39:20', '', 'OwnBank', '9012', NULL, 1, 'active', '2025-10-04 22:39:20', '2025-10-04 22:39:20', NULL),
('acct_check', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Main Checking', 'checking', 'Main Checking', 'checking', 42000.00, 40000.00, 1000.00, 5000.00, NULL, 'NOK', '2025-10-04 22:37:54', '', 'OwnBank', '1234', NULL, 1, 'active', '2025-10-04 22:37:54', '2025-10-04 22:37:54', NULL),
('acct_save', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Emergency Savings', 'savings', 'Emergency Savings', 'savings', 60000.00, 60000.00, 0.00, NULL, NULL, 'NOK', '2025-10-04 22:39:20', '', 'OwnBank', '5678', NULL, 1, 'active', '2025-10-04 22:39:20', '2025-10-04 22:39:20', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `actor_user_id` char(36) NOT NULL,
  `impersonated_user_id` char(36) DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `target_entity` varchar(255) NOT NULL,
  `entity_type` varchar(100) DEFAULT NULL,
  `entity_id` varchar(255) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `changes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`changes`)),
  `severity` enum('info','warning','critical') NOT NULL DEFAULT 'info',
  `immutable` tinyint(1) NOT NULL DEFAULT 0,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `actor_user_id`, `impersonated_user_id`, `user_id`, `action`, `target_entity`, `entity_type`, `entity_id`, `metadata`, `changes`, `severity`, `immutable`, `ip_address`, `user_agent`, `timestamp`) VALUES
(1, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-04 01:35:04'),
(2, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-04 08:34:51'),
(25, '550e8400-e29b-41d4-a716-446655440003', NULL, '550e8400-e29b-41d4-a716-446655440003', 'login_failed', 'auth', 'user', '550e8400-e29b-41d4-a716-446655440003', NULL, '{\"reason\":\"invalid_password\"}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-04 12:21:06'),
(26, '550e8400-e29b-41d4-a716-446655440002', NULL, '550e8400-e29b-41d4-a716-446655440002', 'login', 'auth', 'user', '550e8400-e29b-41d4-a716-446655440002', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-04 12:21:11'),
(27, '550e8400-e29b-41d4-a716-446655440002', NULL, '550e8400-e29b-41d4-a716-446655440002', 'logout', 'auth', 'user', '550e8400-e29b-41d4-a716-446655440002', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-04 12:21:47'),
(34, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-04 22:24:47'),
(35, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-04 22:27:47'),
(36, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-04 22:28:02'),
(37, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-04 22:47:35'),
(38, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-04 22:47:40'),
(39, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-04 23:04:00'),
(40, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-04 23:04:09'),
(41, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 09:47:39'),
(42, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 09:47:45'),
(43, '550e8400-e29b-41d4-a716-446655440002', NULL, '550e8400-e29b-41d4-a716-446655440002', 'login', 'auth', 'user', '550e8400-e29b-41d4-a716-446655440002', NULL, '{\"success\":true}', 'info', 0, '::ffff:10.150.20.13', 'PostmanRuntime/7.48.0', '2025-10-05 09:50:39'),
(44, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '::ffff:10.150.20.13', 'PostmanRuntime/7.48.0', '2025-10-05 09:53:40'),
(45, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 10:40:15'),
(46, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 10:40:22'),
(47, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 10:42:43'),
(48, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 10:42:49'),
(49, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 10:58:09'),
(50, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 10:58:17'),
(51, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 11:25:53'),
(52, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 11:25:58'),
(53, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 11:28:43'),
(54, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 11:28:56'),
(55, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 11:30:48'),
(56, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 11:30:55'),
(57, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 11:35:18'),
(58, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-05 11:35:23'),
(59, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-06 08:18:43'),
(60, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-06 08:18:52'),
(61, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '::ffff:10.150.20.13', 'PostmanRuntime/7.48.0', '2025-10-06 08:26:32'),
(62, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '::ffff:10.150.20.13', 'PostmanRuntime/7.48.0', '2025-10-06 08:42:55'),
(63, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'PostmanRuntime/7.48.0', '2025-10-06 08:46:01'),
(64, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-06 08:51:55'),
(65, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-06 08:51:59'),
(66, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'PostmanRuntime/7.48.0', '2025-10-06 09:04:18'),
(67, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-06 09:04:31'),
(68, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-10-06 09:04:42'),
(69, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'PostmanRuntime/7.48.0', '2025-10-06 09:21:05'),
(70, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'PostmanRuntime/7.48.0', '2025-10-06 09:37:25'),
(71, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.20.13', 'PostmanRuntime/7.48.0', '2025-10-06 09:57:00'),
(72, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'login', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.50.50', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 08:27:19'),
(73, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'logout', 'auth', 'user', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', NULL, '{\"success\":true}', 'info', 0, '10.150.50.50', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 08:28:13'),
(74, '550e8400-e29b-41d4-a716-446655440003', NULL, '550e8400-e29b-41d4-a716-446655440003', 'login_failed', 'auth', 'user', '550e8400-e29b-41d4-a716-446655440003', NULL, '{\"reason\":\"invalid_password\"}', 'info', 0, '10.150.50.50', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 08:28:20'),
(75, '550e8400-e29b-41d4-a716-446655440002', NULL, '550e8400-e29b-41d4-a716-446655440002', 'login', 'auth', 'user', '550e8400-e29b-41d4-a716-446655440002', NULL, '{\"success\":true}', 'info', 0, '10.150.50.50', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 08:28:28'),
(76, '550e8400-e29b-41d4-a716-446655440002', NULL, '550e8400-e29b-41d4-a716-446655440002', 'logout', 'auth', 'user', '550e8400-e29b-41d4-a716-446655440002', NULL, '{\"success\":true}', 'info', 0, '10.150.50.50', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 08:30:52'),
(77, '550e8400-e29b-41d4-a716-446655440002', NULL, '550e8400-e29b-41d4-a716-446655440002', 'login', 'auth', 'user', '550e8400-e29b-41d4-a716-446655440002', NULL, '{\"success\":true}', 'info', 0, '10.150.50.50', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-10-10 08:31:05');

-- --------------------------------------------------------

--
-- Table structure for table `bank_connections`
--

CREATE TABLE `bank_connections` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `provider` enum('demo','teller','plaid','finicity','basiq','other') NOT NULL DEFAULT 'demo',
  `institution_id` varchar(255) NOT NULL,
  `institution_name` varchar(255) NOT NULL,
  `status` enum('pending','active','error','revoked') NOT NULL DEFAULT 'pending',
  `connection_label` varchar(255) DEFAULT '',
  `failure_reason` text DEFAULT NULL,
  `last_synced_at` timestamp NULL DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bank_connections`
--

INSERT INTO `bank_connections` (`id`, `user_id`, `provider`, `institution_id`, `institution_name`, `status`, `connection_label`, `failure_reason`, `last_synced_at`, `metadata`, `created_at`, `updated_at`, `deleted_at`) VALUES
('c50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'plaid', 'ins_1', 'Chase Bank', 'active', 'Chase Personal Banking', NULL, '2025-10-03 07:46:38', '{\"item_id\": \"item_chase_001\", \"accounts_count\": 2, \"last_webhook\": \"2025-10-03 11:46:38\"}', '2025-10-03 09:46:38', '2025-10-03 09:46:38', NULL),
('c50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'plaid', 'ins_2', 'Wells Fargo', 'active', 'Wells Fargo Primary', NULL, '2025-10-03 08:46:38', '{\"item_id\": \"item_wells_001\", \"accounts_count\": 2, \"last_webhook\": \"2025-10-03 11:46:38\"}', '2025-10-03 09:46:38', '2025-10-03 09:46:38', NULL),
('c50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'plaid', 'ins_3', 'Ally Bank', 'active', 'Ally Online Savings', NULL, '2025-10-03 06:46:38', '{\"item_id\": \"item_ally_001\", \"accounts_count\": 1, \"last_webhook\": \"2025-10-03 11:46:38\"}', '2025-10-03 09:46:38', '2025-10-03 09:46:38', NULL),
('c50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'plaid', 'ins_4', 'Vanguard', 'active', 'Vanguard Retirement', NULL, '2025-10-02 21:46:38', '{\"item_id\": \"item_vanguard_001\", \"accounts_count\": 1, \"last_webhook\": \"2025-10-03 11:46:38\"}', '2025-10-03 09:46:38', '2025-10-03 09:46:38', NULL),
('c50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'plaid', 'ins_5', 'Fidelity', 'active', 'Fidelity IRA', NULL, '2025-10-02 21:46:38', '{\"item_id\": \"item_fidelity_001\", \"accounts_count\": 1, \"last_webhook\": \"2025-10-03 11:46:38\"}', '2025-10-03 09:46:38', '2025-10-03 09:46:38', NULL),
('c50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'demo', 'demo_bank', 'Demo Bank', 'active', 'Demo Connection', NULL, NULL, '{\"demo_mode\": true, \"accounts_count\": 2}', '2025-10-03 09:46:38', '2025-10-03 09:46:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `budgets`
--

CREATE TABLE `budgets` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `category` varchar(100) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `color` char(7) DEFAULT NULL,
  `period` enum('monthly','yearly') NOT NULL DEFAULT 'monthly',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `budgets`
--

INSERT INTO `budgets` (`id`, `user_id`, `category`, `amount`, `color`, `period`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
('45fbb51c-a173-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Rent', 18000.00, '#1f77b4', 'monthly', 1, '2025-10-04 22:41:31', '2025-10-04 22:41:31', NULL),
('45fbb78a-a173-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Groceries', 6000.00, '#ff7f0e', 'monthly', 1, '2025-10-04 22:41:31', '2025-10-04 22:41:31', NULL),
('45fbb847-a173-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Transport', 2000.00, '#2ca02c', 'monthly', 1, '2025-10-04 22:41:31', '2025-10-04 22:41:31', NULL),
('45fbb931-a173-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Entertainment', 1500.00, '#d62728', 'monthly', 1, '2025-10-04 22:41:31', '2025-10-04 22:41:31', NULL),
('45fbba83-a173-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Utilities', 3500.00, '#9467bd', 'monthly', 1, '2025-10-04 22:41:31', '2025-10-04 22:41:31', NULL),
('45fbbb28-a173-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Dining Out', 2000.00, '#8c564b', 'monthly', 1, '2025-10-04 22:41:31', '2025-10-04 22:41:31', NULL),
('45fbbbb8-a173-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Subscriptions', 1200.00, '#e377c2', 'monthly', 1, '2025-10-04 22:41:31', '2025-10-04 22:41:31', NULL),
('45fbbc43-a173-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Health', 1500.00, '#7f7f7f', 'monthly', 1, '2025-10-04 22:41:31', '2025-10-04 22:41:31', NULL),
('45fbbccc-a173-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Travel', 2500.00, '#bcbd22', 'monthly', 1, '2025-10-04 22:41:31', '2025-10-04 22:41:31', NULL),
('45fbbd57-a173-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Misc', 1500.00, '#17becf', 'monthly', 1, '2025-10-04 22:41:31', '2025-10-04 22:41:31', NULL),
('b50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'groceries', 600.00, NULL, 'monthly', 1, '2025-10-03 09:44:29', '2025-10-03 09:44:29', NULL),
('b50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'dining', 300.00, NULL, 'monthly', 1, '2025-10-03 09:44:29', '2025-10-03 09:44:29', NULL),
('b50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'transportation', 200.00, NULL, 'monthly', 1, '2025-10-03 09:44:29', '2025-10-03 09:44:29', NULL),
('b50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'entertainment', 150.00, NULL, 'monthly', 1, '2025-10-03 09:44:29', '2025-10-03 09:44:29', NULL),
('bud-001-food', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Food & Dining', 4000.00, NULL, 'monthly', 1, '2025-10-04 00:43:33', '2025-10-04 00:43:33', NULL),
('bud-002-transport', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Transportation', 2500.00, NULL, 'monthly', 1, '2025-10-04 00:43:33', '2025-10-04 00:43:33', NULL),
('bud-003-entertain', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Entertainment', 1500.00, NULL, 'monthly', 1, '2025-10-04 00:43:33', '2025-10-04 00:43:33', NULL),
('bud-004-utilities', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Utilities', 2000.00, NULL, 'monthly', 1, '2025-10-04 00:43:33', '2025-10-04 00:43:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cashflow_projections`
--

CREATE TABLE `cashflow_projections` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `date` date NOT NULL,
  `projectedBalance` decimal(14,2) NOT NULL,
  `scheduledIncome` decimal(14,2) NOT NULL DEFAULT 0.00,
  `scheduledExpenses` decimal(14,2) NOT NULL DEFAULT 0.00,
  `netFlow` decimal(14,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cashflow_projections`
--

INSERT INTO `cashflow_projections` (`id`, `user_id`, `date`, `projectedBalance`, `scheduledIncome`, `scheduledExpenses`, `netFlow`, `created_at`) VALUES
('0d55c6df-a174-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-05', 100000.00, 0.00, 0.00, 0.00, '2025-10-04 22:47:06'),
('0d55c8a0-a174-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-06', 81500.00, 0.00, 18500.00, -18500.00, '2025-10-04 22:47:06'),
('0d55d52a-a174-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-07', 80000.00, 0.00, 1500.00, -1500.00, '2025-10-04 22:47:06'),
('0d55d606-a174-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-08', 78000.00, 0.00, 2000.00, -2000.00, '2025-10-04 22:47:06'),
('0d55d662-a174-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-10', 128000.00, 50000.00, 0.00, 50000.00, '2025-10-04 22:47:06'),
('0d55d69b-a174-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-11', 127601.00, 0.00, 399.00, -399.00, '2025-10-04 22:47:06'),
('0d55d6cd-a174-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-12', 125000.00, 0.00, 2601.00, -2601.00, '2025-10-04 22:47:06'),
('9142d50a-a170-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440001', '2025-10-05', 100000.00, 0.00, 0.00, 0.00, '2025-10-04 22:22:09'),
('9142d691-a170-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440001', '2025-10-06', 81500.00, 0.00, 18500.00, -18500.00, '2025-10-04 22:22:09'),
('9142d74f-a170-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440001', '2025-10-07', 80000.00, 0.00, 1500.00, -1500.00, '2025-10-04 22:22:09'),
('9142d794-a170-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440001', '2025-10-08', 78000.00, 0.00, 2000.00, -2000.00, '2025-10-04 22:22:09'),
('9142d7e9-a170-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440001', '2025-10-10', 128000.00, 50000.00, 0.00, 50000.00, '2025-10-04 22:22:09'),
('9142d829-a170-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440001', '2025-10-11', 127601.00, 0.00, 399.00, -399.00, '2025-10-04 22:22:09'),
('9142d859-a170-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440001', '2025-10-12', 125000.00, 0.00, 2601.00, -2601.00, '2025-10-04 22:22:09');

-- --------------------------------------------------------

--
-- Table structure for table `config_items`
--

CREATE TABLE `config_items` (
  `config_key` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `encrypted` tinyint(1) DEFAULT 0,
  `masked` tinyint(1) DEFAULT 0,
  `description` text NOT NULL,
  `requires_step_up` tinyint(1) DEFAULT 0,
  `last_updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_updated_by_user_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `config_items`
--

INSERT INTO `config_items` (`config_key`, `value`, `encrypted`, `masked`, `description`, `requires_step_up`, `last_updated_at`, `last_updated_by_user_id`) VALUES
('api_base_url', 'https://owncent.com/api', 0, 0, 'API base URL', 0, '2025-10-06 10:11:28', NULL),
('jwt_secret', '\"change-this-in-production-use-long-random-string\"', 1, 1, 'JWT signing secret key', 1, '2025-10-06 08:35:28', NULL),
('smtp_host', 'smtp.sendgrid.net', 0, 0, 'SMTP server hostname', 0, '2025-10-03 09:48:26', NULL),
('smtp_password', '', 1, 1, 'SMTP authentication password', 1, '2025-10-03 09:12:15', NULL),
('smtp_port', '587', 0, 0, 'SMTP server port', 0, '2025-10-03 09:12:15', NULL),
('smtp_user', 'owncent_api', 0, 1, 'SMTP authentication username', 1, '2025-10-03 09:48:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `feature_flags`
--

CREATE TABLE `feature_flags` (
  `feature_key` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `value` tinyint(1) DEFAULT 0,
  `overridable_by` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`overridable_by`)),
  `last_changed_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `overridden_by_user_id` char(36) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feature_flags`
--

INSERT INTO `feature_flags` (`feature_key`, `description`, `value`, `overridable_by`, `last_changed_at`, `overridden_by_user_id`, `notes`) VALUES
('bank_api_enabled', 'Allow direct bank data aggregation.', 1, '[\"owner\"]', '2025-10-03 09:47:34', NULL, NULL),
('debt_optimizer_enabled', 'Enable the premium debt optimization module.', 1, '[\"owner\"]', '2025-10-03 09:47:34', NULL, NULL),
('family_features_enabled', 'Unlock multi-user household planning features.', 0, '[\"owner\"]', '2025-10-03 09:11:54', NULL, NULL),
('reports_enabled', 'Enable premium reporting engine.', 1, '[\"owner\"]', '2025-10-04 21:59:35', NULL, NULL),
('strategy_simulator_enabled', 'Enable what-if strategy simulator.', 1, '[\"owner\"]', '2025-10-04 21:59:35', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `goals`
--

CREATE TABLE `goals` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `target_amount` decimal(15,2) NOT NULL,
  `current_amount` decimal(15,2) DEFAULT 0.00,
  `deadline` date DEFAULT NULL,
  `category` varchar(100) DEFAULT 'general',
  `is_completed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `goals`
--

INSERT INTO `goals` (`id`, `user_id`, `name`, `target_amount`, `current_amount`, `deadline`, `category`, `is_completed`, `created_at`, `updated_at`, `deleted_at`) VALUES
('goal-emergency', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Emergency Fund', 180000.00, 118200.00, '2026-07-04', 'safety', 0, '2025-10-04 00:43:39', '2025-10-04 00:43:39', NULL),
('goal-vacation', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'Summer Vacation', 40000.00, 12500.00, '2026-04-04', 'travel', 0, '2025-10-04 00:43:39', '2025-10-04 00:43:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `investment_holdings`
--

CREATE TABLE `investment_holdings` (
  `id` char(36) NOT NULL,
  `account_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `symbol` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `quantity` decimal(20,6) NOT NULL,
  `cost_basis` decimal(15,2) NOT NULL,
  `current_price` decimal(15,2) NOT NULL,
  `current_value` decimal(20,2) NOT NULL,
  `asset_type` enum('stock','mutual_fund','bond','crypto','other') NOT NULL,
  `sector` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `investment_holdings`
--

INSERT INTO `investment_holdings` (`id`, `account_id`, `user_id`, `symbol`, `name`, `quantity`, `cost_basis`, `current_price`, `current_value`, `asset_type`, `sector`, `created_at`, `updated_at`) VALUES
('h50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'VTSAX', 'Vanguard Total Stock Market Index Fund', 850.543200, 75.45, 102.34, 87034.78, 'mutual_fund', 'diversified', '2025-10-03 09:46:25', '2025-10-04 18:50:46'),
('h50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'VFIAX', 'Vanguard 500 Index Fund', 250.123400, 150.23, 180.89, 45245.78, 'mutual_fund', 'large_cap', '2025-10-03 09:46:25', '2025-10-04 18:51:02'),
('h50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'AAPL', 'Apple Inc.', 15.000000, 145.67, 175.23, 2628.45, 'stock', 'technology', '2025-10-03 09:46:25', '2025-10-04 18:51:03');

-- --------------------------------------------------------

--
-- Table structure for table `investment_trades`
--

CREATE TABLE `investment_trades` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `account_id` char(36) NOT NULL,
  `symbol` varchar(20) NOT NULL,
  `side` enum('buy','sell','dividend','split','fee','other') NOT NULL,
  `quantity` decimal(20,6) NOT NULL DEFAULT 0.000000,
  `price` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `fees` decimal(18,6) NOT NULL DEFAULT 0.000000,
  `trade_date` datetime NOT NULL,
  `description` text DEFAULT NULL,
  `metadata` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `licenses`
--

CREATE TABLE `licenses` (
  `id` char(36) NOT NULL,
  `license_id` varchar(255) NOT NULL,
  `tier` enum('free','advanced','premium','family') NOT NULL DEFAULT 'free',
  `status` enum('valid','expiring','expired') NOT NULL DEFAULT 'valid',
  `expires_at` timestamp NOT NULL,
  `last_validated_at` timestamp NULL DEFAULT current_timestamp(),
  `override_active` tinyint(1) DEFAULT 0,
  `override_tier` enum('free','advanced','premium','family') DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `licenses`
--

INSERT INTO `licenses` (`id`, `license_id`, `tier`, `status`, `expires_at`, `last_validated_at`, `override_active`, `override_tier`, `features`, `created_at`, `updated_at`) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'premium-license-001', 'premium', 'valid', '2026-10-03 09:23:13', '2025-10-03 09:23:13', 0, NULL, '{\"debt_optimizer\": true, \"strategy_simulator\": true}', '2025-10-03 09:23:13', '2025-10-06 08:51:52'),
('650e8400-e29b-41d4-a716-446655440002', 'family-license-001', 'family', 'valid', '2026-10-03 09:23:13', '2025-10-03 09:23:13', 0, NULL, '{\"debt_optimizer\": true, \"strategy_simulator\": true}', '2025-10-03 09:23:13', '2025-10-06 08:51:52'),
('e3393f8d-a16d-11f0-ab45-bc241172c857', 'LIC-e3399f19', 'advanced', 'valid', '2026-10-04 22:02:58', '2025-10-04 22:02:58', 0, NULL, '{\"smartInsights\": true, \"smartSuggestions\": true}', '2025-10-04 22:02:58', '2025-10-06 08:39:37'),
('erthrtfh', 'demo-license-001', 'free', 'valid', '2026-10-03 09:12:20', '2025-10-03 09:12:20', 0, NULL, '{\"debt_optimizer\": false, \"strategy_simulator\": false}', '2025-10-03 09:12:20', '2025-10-06 08:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `type` enum('mortgage','auto','personal','student','credit_card') NOT NULL,
  `principal` decimal(15,2) NOT NULL,
  `currentBalance` decimal(15,2) NOT NULL,
  `interestRate` decimal(5,2) NOT NULL,
  `monthlyPayment` decimal(15,2) NOT NULL,
  `fees` decimal(15,2) NOT NULL DEFAULT 0.00,
  `startDate` date NOT NULL,
  `termMonths` int(11) NOT NULL,
  `color` char(7) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mfa_secrets`
--

CREATE TABLE `mfa_secrets` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `secret` varchar(255) NOT NULL,
  `backup_codes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`backup_codes`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mfa_secrets`
--

INSERT INTO `mfa_secrets` (`id`, `user_id`, `secret`, `backup_codes`, `created_at`, `updated_at`) VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'JBSWY3DPEHPK3PXP', '[\"12345678\", \"23456789\", \"34567890\", \"45678901\", \"56789012\", \"67890123\", \"78901234\", \"89012345\"]', '2025-10-03 09:28:04', '2025-10-03 09:28:04');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recurring_transactions`
--

CREATE TABLE `recurring_transactions` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `account_id` char(36) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `type` enum('income','expense','transfer') NOT NULL,
  `transaction_type` varchar(50) NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `frequency` enum('daily','weekly','biweekly','monthly','yearly') NOT NULL,
  `next_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('scheduled','overdue','paid') NOT NULL DEFAULT 'scheduled',
  `priority` enum('high','medium','low') NOT NULL DEFAULT 'medium',
  `merchant_name` varchar(255) DEFAULT NULL,
  `auto_pay_enabled` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recurring_transactions`
--

INSERT INTO `recurring_transactions` (`id`, `user_id`, `account_id`, `description`, `amount`, `category`, `type`, `transaction_type`, `metadata`, `frequency`, `next_date`, `end_date`, `status`, `priority`, `merchant_name`, `auto_pay_enabled`, `is_active`, `created_at`, `updated_at`) VALUES
('rec-car-insurance', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'acct_check', 'Car Insurance', -2500.00, 'Insurance', 'expense', 'insurance', '{\"priority\": \"high\"}', 'monthly', '2025-10-24', NULL, 'scheduled', 'medium', 'Nordic Insure', 0, 1, '2025-10-04 00:44:39', '2025-10-05 08:50:47'),
('rec-income-paycheck', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'acct_check', 'Monthly Salary', 52000.00, 'Income', 'income', 'salary', '{\"expected_day\": 25}', 'monthly', '2025-10-19', NULL, 'scheduled', 'medium', 'Fjord Solutions AS', 0, 1, '2025-10-04 00:44:39', '2025-10-05 08:50:49'),
('rec-rent', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'acct_check', 'Apartment Rent', -12000.00, 'Housing', 'expense', 'rent', '{\"priority\": \"high\"}', 'monthly', '2025-10-14', NULL, 'scheduled', 'medium', 'Urban Living', 0, 1, '2025-10-04 00:44:39', '2025-10-05 08:50:52');

-- --------------------------------------------------------

--
-- Table structure for table `savings_goals`
--

CREATE TABLE `savings_goals` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `goal_name` varchar(255) NOT NULL,
  `target_amount` decimal(15,2) NOT NULL,
  `current_amount` decimal(15,2) NOT NULL,
  `target_date` date NOT NULL,
  `priority` enum('low','medium','high') NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `linked_account_id` char(36) DEFAULT NULL,
  `auto_contribute_amount` decimal(15,2) DEFAULT NULL,
  `contribution_frequency` enum('weekly','biweekly','monthly','yearly') DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `savings_goals`
--

INSERT INTO `savings_goals` (`id`, `user_id`, `goal_name`, `target_amount`, `current_amount`, `target_date`, `priority`, `category`, `linked_account_id`, `auto_contribute_amount`, `contribution_frequency`, `notes`, `created_at`, `updated_at`) VALUES
('g50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Emergency Fund', 20000.00, 8500.00, '2026-10-03', 'high', 'emergency', 'a50e8400-e29b-41d4-a716-446655440004', 500.00, 'monthly', 'Target: 6 months of expenses', '2025-10-03 09:44:44', '2025-10-03 09:44:44'),
('g50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Hawaii Vacation', 5000.00, 1200.00, '2026-06-03', 'medium', 'vacation', 'a50e8400-e29b-41d4-a716-446655440003', 200.00, 'biweekly', 'Family trip planned for summer', '2025-10-03 09:44:44', '2025-10-03 09:44:44'),
('g50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'New Car Down Payment', 15000.00, 3500.00, '2027-04-03', 'medium', 'purchase', 'a50e8400-e29b-41d4-a716-446655440003', 300.00, 'monthly', 'Target: 20% down payment', '2025-10-03 09:44:44', '2025-10-03 09:44:44'),
('g50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Home Renovation', 30000.00, 5000.00, '2027-10-03', 'low', 'home', NULL, NULL, NULL, 'Kitchen and bathroom updates', '2025-10-03 09:44:44', '2025-10-03 09:44:44');

-- --------------------------------------------------------

--
-- Table structure for table `scenarios`
--

CREATE TABLE `scenarios` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `refresh_token` text NOT NULL,
  `access_token_family` char(36) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `last_active_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `refresh_token`, `access_token_family`, `ip_address`, `user_agent`, `expires_at`, `created_at`, `last_active_at`) VALUES
('0e4ef033-8ded-488b-a52c-3ddef1b5d983', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImRlbW9Ab3duY2VudC5hcHAiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUzOTIzNCwiZXhwIjoxNzYyMTMxMjM0fQ.M-0Aayp6HJAsW8IfNjQmE3xEDFQE9LETVuev0a9tsH4', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 23:53:54', '2025-10-04 00:53:54', '2025-10-04 00:53:54'),
('108f2e76-8558-4a3a-9f15-c28c9432188c', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMjE0NywiZXhwIjoxNzYyMTA0MTQ3fQ.iEQWYWy7hJG3Zl_h3ESqx68ExFcYY7OpSx5OsA7n6fc', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 16:22:27', '2025-10-03 17:22:27', '2025-10-03 17:22:27'),
('10eee5a2-a298-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImFkbWluQG93bmNlbnQuY29tIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NTk3NDM0NDUsImV4cCI6MTc2MjMzNTQ0NX0.wYakE9bSyeK--MSKho9VKKe_s7yVNLJ0-6AmKNhju6k', NULL, '10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-05 08:37:25', '2025-10-06 09:37:25', '2025-10-06 09:37:25'),
('280f272b-0fd7-4657-9572-7be641515d79', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImRlbW9Ab3duY2VudC5hcHAiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTU0MTA1OSwiZXhwIjoxNzYyMTMzMDU5fQ.i8Nc_BSryboqCS6BuR0u_o68oEeqA5FyHymw_841J0o', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-03 00:24:19', '2025-10-04 01:24:19', '2025-10-04 01:24:19'),
('29e4f7b1-a28e-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImFkbWluQG93bmNlbnQuY29tIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NTk3MzkxOTIsImV4cCI6MTc2MjMzMTE5Mn0.NC9hX6SoHBffLvEoEPT8nJTeqMFxEY-rtsSwwYFmGr8', NULL, '::ffff:10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-05 07:26:32', '2025-10-06 08:26:32', '2025-10-06 08:26:32'),
('2bde2c71-a1d1-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImFkbWluQG93bmNlbnQuY29tIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NTk2NTgwMjAsImV4cCI6MTc2MjI1MDAyMH0.blt9rxf6WTl1RRxdjrGOuy1C13tc3YcWsOo5Vu5fgXI', NULL, '::ffff:10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-04 08:53:40', '2025-10-05 09:53:40', '2025-10-05 09:53:40'),
('366b972b-dedd-4033-be20-e059c777023f', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMzk3NSwiZXhwIjoxNzYyMTA1OTc1fQ.m5Tct1OM7iYmvCHEvC2zt1It87QE01Ay7sU0JtkNihM', NULL, '::ffff:10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-02 16:52:55', '2025-10-03 17:52:55', '2025-10-03 17:52:55'),
('3c9aabad-c61c-4b8d-a28e-dbe215f55c29', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMzY0MiwiZXhwIjoxNzYyMTA1NjQyfQ.tjC536JxEJsjVv4FgE6TsbGuPpbisQsOYjNDOjLMo20', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 16:47:22', '2025-10-03 17:47:22', '2025-10-03 17:47:22'),
('4aff5421-b02c-4417-8ae1-336b8aa918a4', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMzQxNCwiZXhwIjoxNzYyMTA1NDE0fQ.S1CaQiY_OOS_xKJixDB89udvJqvRzCghZuSW81rSfLU', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 16:43:34', '2025-10-03 17:43:34', '2025-10-03 17:43:34'),
('52035569-478d-4d84-91c6-75f2dfe3aead', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMTgyNCwiZXhwIjoxNzYyMTAzODI0fQ.772cfR9nxwHWTfsfHH98XKZ8SkxFP7OjrzD0ju3oWko', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 16:17:04', '2025-10-03 17:17:04', '2025-10-03 17:17:04'),
('66ea1a2a-b3ce-4d75-8470-e056cb3a226b', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImRlbW9Ab3duY2VudC5hcHAiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUzOTc2OSwiZXhwIjoxNzYyMTMxNzY5fQ.1i3oWRJBHFPdMhpRvIYRd9XywdA8zrrMBhQkFOZ18WI', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-03 00:02:49', '2025-10-04 01:02:49', '2025-10-04 01:02:49'),
('70a8df56-a293-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImFkbWluQG93bmNlbnQuY29tIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NTk3NDE0NTgsImV4cCI6MTc2MjMzMzQ1OH0.mMu1_YGi2faw7liq1S3mJlnELIrfTCdeqzXWo5Shqc0', NULL, '10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-05 08:04:18', '2025-10-06 09:04:18', '2025-10-06 09:04:18'),
('745e23d6-a290-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImFkbWluQG93bmNlbnQuY29tIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NTk3NDAxNzUsImV4cCI6MTc2MjMzMjE3NX0.-d4iq2-J2PF0WJOPHmKNXef8lRxExrnYvUKO35vqnFc', NULL, '::ffff:10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-05 07:42:55', '2025-10-06 08:42:55', '2025-10-06 08:42:55'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'refresh_token_premium_12345678901234567890', 'family_002', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-11-02 10:24:25', '2025-10-03 09:24:25', '2025-10-03 09:24:25'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'refresh_token_free_12345678901234567890', 'family_003', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', '2025-11-02 10:24:25', '2025-10-03 09:24:25', '2025-10-03 09:24:25'),
('7653ca7e-a5b3-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc2MDA4NTA2NSwiZXhwIjoxNzYyNjc3MDY1fQ.mszICKkHRWDIocK1S3k1hoBkwSwBEts4FNtuLmuFvVA', NULL, '10.150.50.50', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-11-09 07:31:05', '2025-10-10 08:31:05', '2025-10-10 08:31:05'),
('7f02e284-a293-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImFkbWluQG93bmNlbnQuY29tIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NTk3NDE0ODIsImV4cCI6MTc2MjMzMzQ4Mn0.NrUpKwKhonTI71MKH1ZV-IKfwk4yTIF2O1reNhIh4jw', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-05 08:04:42', '2025-10-06 09:04:42', '2025-10-06 09:04:42'),
('809985b8-75f8-4474-85cd-69bd81ae8e05', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImRlbW9Ab3duY2VudC5hcHAiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUzODkxNiwiZXhwIjoxNzYyMTMwOTE2fQ.PLCAo7X8x_qqRkphJPXMQvUQe5usWKIFY-tQTOJsAxM', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 23:48:36', '2025-10-04 00:48:36', '2025-10-04 00:48:36'),
('90baac89-088a-4c29-ad39-1e70641cd3d5', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMTgyOCwiZXhwIjoxNzYyMTAzODI4fQ.OZ_jblRudcdUNrljIr1a9Ar1QsFnsq5vaSt2ZbwYBNE', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 16:17:08', '2025-10-03 17:17:08', '2025-10-03 17:17:08'),
('bf8ad3ea-a675-4dff-81b5-684c4f9c4e98', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMTg1OSwiZXhwIjoxNzYyMTAzODU5fQ.oTfavEmSq-tbjVW09-B0eA6SPHLcGSSSEym8_JF5Eco', NULL, '::ffff:10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-02 16:17:39', '2025-10-03 17:17:39', '2025-10-03 17:17:39'),
('bfbe0ba9-a1d0-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTY1NzgzOSwiZXhwIjoxNzYyMjQ5ODM5fQ.yr-037aARzY_lvRdbka1zqYSZuSgGoKIOKLcUwRHSKg', NULL, '::ffff:10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-04 08:50:39', '2025-10-05 09:50:39', '2025-10-05 09:50:39'),
('c44e1921-d284-44bf-bf66-4f7da478281a', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMzQwNCwiZXhwIjoxNzYyMTA1NDA0fQ.lEE7ELPtS6Cpjvq6i34ZaiZEOeap4uYEW6btnf3ZQ-0', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 16:43:24', '2025-10-03 17:43:24', '2025-10-03 17:43:24'),
('c8c84e8b-a295-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImFkbWluQG93bmNlbnQuY29tIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NTk3NDI0NjUsImV4cCI6MTc2MjMzNDQ2NX0.8eTr4pgpiTrYC6I3A9JFK6zNmeC_JKSGBRprBoJyZic', NULL, '10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-05 08:21:05', '2025-10-06 09:21:05', '2025-10-06 09:21:05'),
('cd6bd986-a29a-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImFkbWluQG93bmNlbnQuY29tIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NTk3NDQ2MjAsImV4cCI6MTc2MjMzNjYyMH0.lSE30oVNt_h2kP-2LAKd1UGNfIV8W4Rr-6crcG1mCV4', NULL, '10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-05 08:57:00', '2025-10-06 09:57:00', '2025-10-06 09:57:00'),
('d39f6a64-526c-410e-9f47-2b43981de4f2', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMTc1NSwiZXhwIjoxNzYyMTAzNzU1fQ.1U-FOGEWcAYXBs0ydNsfsnd3W1qmw9iUjbhstla1Z8c', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 16:15:55', '2025-10-03 17:15:55', '2025-10-03 17:15:55'),
('e0a9e7b1-efc1-4295-8a01-1b6de71cbdcd', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMjk0MywiZXhwIjoxNzYyMTA0OTQzfQ.tBwE250SGQ3Qiwj-e0k-M9_9igfWLd8YhVxmuQEnDk0', NULL, '::ffff:10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-02 16:35:43', '2025-10-03 17:35:43', '2025-10-03 17:35:43'),
('e2c42486-a290-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImFkbWluQG93bmNlbnQuY29tIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3NTk3NDAzNjEsImV4cCI6MTc2MjMzMjM2MX0.u2p7YbfKFCyNmefk6Lu7WVQbrS4J14LkUgNeE3B9hIU', NULL, '10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-05 07:46:01', '2025-10-06 08:46:01', '2025-10-06 08:46:01'),
('e33a54f2-9c81-48ff-8fbd-ab1a79c4779c', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMzk5NCwiZXhwIjoxNzYyMTA1OTk0fQ.lSg4vWbu_eU0JCHZd5z25TT6dxUBv-0cYjoZ07T11mQ', NULL, '::ffff:10.150.20.13', 'PostmanRuntime/7.48.0', '2025-11-02 16:53:14', '2025-10-03 17:53:14', '2025-10-03 17:53:14'),
('e60e9457-f375-474c-b8ac-95be232f7a41', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImRlbW9Ab3duY2VudC5hcHAiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUzODgyOSwiZXhwIjoxNzYyMTMwODI5fQ.SYO4yj_EmOT9yAgId1tWLIdSz-tGXNUDgWtqXwdEP-c', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 23:47:09', '2025-10-04 00:47:09', '2025-10-04 00:47:09'),
('f09a38bf-2c57-4d98-9b13-fdcf6f3fa139', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTQ3YTAtOTEyMy1hYmNkZWYxMjM0NTYiLCJlbWFpbCI6ImRlbW9Ab3duY2VudC5hcHAiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUzODgzNCwiZXhwIjoxNzYyMTMwODM0fQ.N7DNCLSl8SDMRoGUFZLFycHpqBocs73e3JvvQrFc1kg', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 23:47:14', '2025-10-04 00:47:14', '2025-10-04 00:47:14'),
('f0bb6ad2-932d-4b36-bf4d-c1234f61068e', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMzQwMSwiZXhwIjoxNzYyMTA1NDAxfQ.ono6gIUEMf_BeozrpfvNI2584FnKvZOzQSZZVZ3POZE', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 16:43:21', '2025-10-03 17:43:21', '2025-10-03 17:43:21'),
('f354425a-d92e-4f62-b5c0-39a3ff7623f5', '550e8400-e29b-41d4-a716-446655440002', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDIiLCJlbWFpbCI6InByZW1pdW1AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1OTUxMzMyMSwiZXhwIjoxNzYyMTA1MzIxfQ.mQTqeKv66RPlQI_hYwcX8cybp6Pr8T8ofIdqRKdYPdk', NULL, '10.150.20.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '2025-11-02 16:42:01', '2025-10-03 17:42:01', '2025-10-03 17:42:01');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `account_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `transaction_date` date NOT NULL,
  `description` text NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `category` varchar(100) NOT NULL DEFAULT 'uncategorized',
  `type` enum('income','expense','transfer') NOT NULL,
  `transaction_type` varchar(50) NOT NULL,
  `merchant_name` varchar(255) DEFAULT NULL,
  `pending` tinyint(1) NOT NULL DEFAULT 0,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `account_id`, `user_id`, `transaction_date`, `description`, `amount`, `category`, `type`, `transaction_type`, `merchant_name`, `pending`, `tags`, `metadata`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
('7cade9a7-a173-11f0-ab45-bc241172c857', 'acct_check', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-09-28', 'Salary (partial bonus)', 15000.00, 'income', 'income', 'deposit', 'Employer AS', 0, NULL, NULL, NULL, '2025-10-04 22:43:03', '2025-10-04 22:43:03', NULL),
('7caded22-a173-11f0-ab45-bc241172c857', 'acct_check', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-09-30', 'Groceries - Rema 1000', -900.00, 'Groceries', 'expense', 'card', 'Rema 1000', 0, NULL, NULL, NULL, '2025-10-04 22:43:03', '2025-10-04 22:43:03', NULL),
('7cadeee7-a173-11f0-ab45-bc241172c857', 'acct_check', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-09-30', 'Utilities - Power', -1200.00, 'Utilities', 'expense', 'bank', 'PowerCo', 0, NULL, NULL, NULL, '2025-10-04 22:43:03', '2025-10-04 22:43:03', NULL),
('7cadf02e-a173-11f0-ab45-bc241172c857', 'acct_cc', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-02', 'Dining Out - Pizza', -350.00, 'Dining Out', 'expense', 'card', 'Pizza Oslo', 0, NULL, NULL, NULL, '2025-10-04 22:43:03', '2025-10-04 22:43:03', NULL),
('7cadf15c-a173-11f0-ab45-bc241172c857', 'acct_cc', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-03', 'Transport - Ruter', -220.00, 'Transport', 'expense', 'card', 'Ruter', 0, NULL, NULL, NULL, '2025-10-04 22:43:03', '2025-10-04 22:43:03', NULL),
('7cadf294-a173-11f0-ab45-bc241172c857', 'acct_check', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-03', 'Subscriptions - Netflix', -129.00, 'Subscriptions', 'expense', 'card', 'Netflix', 0, NULL, NULL, NULL, '2025-10-04 22:43:03', '2025-10-04 22:43:03', NULL),
('7cadf3c4-a173-11f0-ab45-bc241172c857', 'acct_cc', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-04', 'Entertainment - Cinema', -180.00, 'Entertainment', 'expense', 'card', 'Cinema City', 0, NULL, NULL, NULL, '2025-10-04 22:43:03', '2025-10-04 22:43:03', NULL),
('7cadf4aa-a173-11f0-ab45-bc241172c857', 'acct_check', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-04', 'Health - Pharmacy', -260.00, 'Health', 'expense', 'card', 'Apotek', 0, NULL, NULL, NULL, '2025-10-04 22:43:03', '2025-10-04 22:43:03', NULL),
('7cadf599-a173-11f0-ab45-bc241172c857', 'acct_check', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-05', 'Groceries - Kiwi', -640.00, 'Groceries', 'expense', 'card', 'Kiwi', 0, NULL, NULL, NULL, '2025-10-04 22:43:03', '2025-10-04 22:43:03', NULL),
('7cadf687-a173-11f0-ab45-bc241172c857', 'acct_cc', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-05', 'Travel - Train', -490.00, 'Travel', 'expense', 'card', 'Vy', 0, NULL, NULL, NULL, '2025-10-04 22:43:03', '2025-10-04 22:43:03', NULL),
('t50e8400-e29b-41d4-a716-446655440010', 'a50e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', '2025-10-02', 'Paycheck', 2800.00, 'income', 'income', '', NULL, 0, NULL, NULL, NULL, '2025-10-03 09:40:20', '2025-10-03 09:40:20', NULL),
('t50e8400-e29b-41d4-a716-446655440011', 'a50e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', '2025-10-01', 'Grocery Store', -56.43, 'groceries', 'expense', '', NULL, 0, NULL, NULL, NULL, '2025-10-03 09:40:20', '2025-10-03 09:40:20', NULL),
('t50e8400-e29b-41d4-a716-446655440012', 'a50e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', '2025-09-28', 'Electric Bill', -120.00, 'utilities', 'expense', '', NULL, 0, NULL, NULL, NULL, '2025-10-03 09:40:20', '2025-10-03 09:40:20', NULL),
('txn-2024-001', 'acc-001-demo-0001-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-09-29', 'Salary Deposit', 52000.00, 'Income', 'income', 'credit', 'Fjord Solutions AS', 0, '[\"salary\"]', '{\"external_id\": \"pay-2024-09\"}', NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-002', 'acc-001-demo-0001-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-09-30', 'Grocery Store', -1485.00, 'Food', 'income', 'debit', 'Meny', 0, '[\"food\"]', NULL, NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-003', 'acc-001-demo-0001-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-09-30', 'Gas Station', -650.00, 'Transportation', 'income', 'debit', 'Circle K', 0, '[\"transport\"]', NULL, NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-004', 'acc-001-demo-0001-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-01', 'Streaming Service', -159.00, 'Entertainment', 'income', 'debit', 'Netflix', 0, '[\"subscription\"]', NULL, NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-005', 'acc-001-demo-0001-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-02', 'Auto-save Transfer', -2500.00, 'Transfer', 'income', 'debit', 'High Yield Savings', 0, '[\"savings\"]', NULL, NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-006', 'acc-001-demo-0002-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-09-02', 'Monthly Savings Transfer', 2500.00, 'Transfer', 'income', 'credit', 'Main Checking', 0, '[\"automation\"]', NULL, NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-007', 'acc-001-demo-0004-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-09-22', 'Credit Card Payment', 3000.00, 'Debt', 'income', 'credit', 'OwnCent Bank', 0, '[\"payment\"]', NULL, NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-008', 'acc-001-demo-0004-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-10-03', 'Restaurant Dinner', -420.00, 'Food', 'income', 'debit', 'Frognerseteren', 0, '[\"dining\"]', NULL, NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-009', 'acc-001-demo-0001-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-08-05', 'Salary Deposit', 52000.00, 'Income', 'income', 'credit', 'Fjord Solutions AS', 0, '[\"salary\"]', '{\"month\": \"previous\"}', NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-010', 'acc-001-demo-0001-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-08-07', 'Rent Payment', -12000.00, 'Housing', 'income', 'debit', 'Urban Living', 0, '[\"rent\"]', NULL, NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-011', 'acc-001-demo-0001-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-07-06', 'Salary Deposit', 52000.00, 'Income', 'income', 'credit', 'Fjord Solutions AS', 0, '[\"salary\"]', '{\"month\": \"three-ago\"}', NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-012', 'acc-001-demo-0001-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-07-08', 'Rent Payment', -12000.00, 'Housing', 'income', 'debit', 'Urban Living', 0, '[\"rent\"]', NULL, NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-013', 'acc-001-demo-0001-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-06-06', 'Salary Deposit', 52000.00, 'Income', 'income', 'credit', 'Fjord Solutions AS', 0, '[\"salary\"]', '{\"month\": \"four-ago\"}', NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL),
('txn-2024-014', 'acc-001-demo-0001-000000000001', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', '2025-06-08', 'Rent Payment', -12000.00, 'Housing', 'income', 'debit', 'Urban Living', 0, '[\"rent\"]', NULL, NULL, '2025-10-04 00:45:51', '2025-10-04 00:45:51', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `upcoming_payments`
--

CREATE TABLE `upcoming_payments` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `account_id` char(36) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `dueDate` date NOT NULL,
  `category` varchar(100) NOT NULL DEFAULT 'uncategorized',
  `status` enum('scheduled','overdue','paid') NOT NULL DEFAULT 'scheduled',
  `isRecurring` tinyint(1) NOT NULL DEFAULT 0,
  `priority` enum('high','medium','low') NOT NULL DEFAULT 'medium',
  `frequency` varchar(50) DEFAULT NULL,
  `merchant` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `upcoming_payments`
--

INSERT INTO `upcoming_payments` (`id`, `user_id`, `account_id`, `description`, `amount`, `dueDate`, `category`, `status`, `isRecurring`, `priority`, `frequency`, `merchant`, `created_at`, `updated_at`) VALUES
('000a4023-a174-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'acct_check', 'Paycheck', 50000.00, '2025-10-10', 'income', 'scheduled', 0, 'medium', NULL, 'Employer AS', '2025-10-04 22:46:43', '2025-10-04 22:46:43'),
('000a420a-a174-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'acct_check', 'Rent', -18000.00, '2025-10-06', 'Rent', 'scheduled', 1, 'high', 'monthly', 'Landlord', '2025-10-04 22:46:43', '2025-10-04 22:46:43'),
('000a42bd-a174-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'acct_check', 'Utilities - Power', -1500.00, '2025-10-07', 'Utilities', 'scheduled', 1, 'medium', 'monthly', 'PowerCo', '2025-10-04 22:46:43', '2025-10-04 22:46:43'),
('000a4326-a174-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'acct_cc', 'Credit Card Minimum', -1200.00, '2025-10-02', 'Debt', 'overdue', 1, 'high', 'monthly', 'Visa', '2025-10-04 22:46:43', '2025-10-04 22:46:43'),
('000a437e-a174-11f0-ab45-bc241172c857', 'a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'acct_check', 'Gym Membership', -399.00, '2025-10-11', 'Subscriptions', 'scheduled', 1, 'low', 'monthly', 'GymCo', '2025-10-04 22:46:43', '2025-10-04 22:46:43'),
('5bbd5860-a170-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440001', '@acct_check', 'Paycheck', 50000.00, '2025-10-10', 'income', 'scheduled', 0, 'medium', NULL, 'Employer AS', '2025-10-04 22:20:39', '2025-10-04 22:20:39'),
('5bbd5a5e-a170-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440001', '@acct_check', 'Rent', -18000.00, '2025-10-06', 'Rent', 'scheduled', 1, 'high', 'monthly', 'Landlord', '2025-10-04 22:20:39', '2025-10-04 22:20:39'),
('5bbd5b0f-a170-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440001', '@acct_check', 'Utilities - Power', -1500.00, '2025-10-07', 'Utilities', 'scheduled', 1, 'medium', 'monthly', 'PowerCo', '2025-10-04 22:20:39', '2025-10-04 22:20:39'),
('5bbd5b77-a170-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440001', '@acct_cc', 'Credit Card Minimum', -1200.00, '2025-10-02', 'Debt', 'overdue', 1, 'high', 'monthly', 'Visa', '2025-10-04 22:20:39', '2025-10-04 22:20:39'),
('5bbd5bcf-a170-11f0-ab45-bc241172c857', '550e8400-e29b-41d4-a716-446655440001', '@acct_check', 'Gym Membership', -399.00, '2025-10-11', 'Subscriptions', 'scheduled', 1, 'low', 'monthly', 'GymCo', '2025-10-04 22:20:39', '2025-10-04 22:20:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `email` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT '',
  `role` enum('owner','manager','user','family','readonly') NOT NULL DEFAULT 'user',
  `license_id` char(36) NOT NULL,
  `tier` enum('free','advanced','premium','family') NOT NULL DEFAULT 'free',
  `is_premium` tinyint(1) DEFAULT 0,
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `timezone` varchar(50) DEFAULT 'UTC',
  `locale` varchar(10) DEFAULT 'en-US',
  `currency` char(3) DEFAULT 'USD',
  `monthlyIncome` decimal(12,2) DEFAULT NULL,
  `mfa_enabled` tinyint(1) DEFAULT 0,
  `profile_picture_url` text DEFAULT NULL,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password_hash`, `display_name`, `phone`, `role`, `license_id`, `tier`, `is_premium`, `email_verified`, `created_at`, `updated_at`, `first_name`, `last_name`, `timezone`, `locale`, `currency`, `monthlyIncome`, `mfa_enabled`, `profile_picture_url`, `preferences`, `deleted_at`) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'premium@example.com', 'jane.smith', '$2b$10$zRxmIpY3sY0J5UfIsYg5b.YFHUZEx5T9CGX9WWZbBxeV5zrqvG/i2', 'Jane Smith', '+1234567891', 'user', '650e8400-e29b-41d4-a716-446655440001', 'free', 0, 1, '2025-10-03 09:22:52', '2025-10-10 08:31:05', 'Jane', 'Smith', 'America/Los_Angeles', 'en-US', 'USD', NULL, 1, NULL, '{\"theme\": \"dark\", \"notifications_enabled\": 1, \"dashboard_layout\": \"compact\", \"show_tutorials\": 0}', NULL),
('550e8400-e29b-41d4-a716-446655440003', 'free@example.com', 'john.doe', '$2b$10$n32hQiOBGN5c7uDYjzUroeYUhhqgxuaQGq0aZYkV7THwDH/YFmtKC', 'John Doe', '+12345678', 'user', 'demo-license-001', 'free', 0, 1, '2025-10-03 09:22:52', '2025-10-06 09:15:05', 'John', 'Doe', 'America/Chicago', 'en-US', 'USD', NULL, 0, NULL, '{\"theme\": \"light\", \"notifications_enabled\": 1, \"dashboard_layout\": \"default\", \"show_tutorials\": 1}', NULL),
('550e8400-e29b-41d4-a716-446655440004', 'family@example.com', 'alice.johnson', '$2b$10$n32hQiOBGN5c7uDYjzUroeYUhhqgxuaQGq0aZYkV7THwDH/YFmtKC', 'Alice Johnson', '+1234567892', 'family', '650e8400-e29b-41d4-a716-446655440002', 'free', 0, 1, '2025-10-03 09:22:52', '2025-10-03 17:09:25', 'Alice', 'Johnson', 'America/New_York', 'en-US', 'USD', NULL, 0, NULL, '{\"theme\": \"light\", \"notifications_enabled\": 1, \"dashboard_layout\": \"default\", \"show_tutorials\": 0}', NULL),
('a1b2c3d4-e5f6-47a0-9123-abcdef123456', 'admin@owncent.com', 'owner_user', '$2b$10$zRxmIpY3sY0J5UfIsYg5b.YFHUZEx5T9CGX9WWZbBxeV5zrqvG/i2', 'Owner User', '+123456789', 'owner', 'premium-license-001', 'premium', 0, 1, '2025-10-04 00:43:01', '2025-10-10 08:27:19', 'Demo', 'User', 'UTC', 'en-US', 'NOK', NULL, 0, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_user_is_active` (`user_id`,`is_active`),
  ADD KEY `idx_accounts_user_id` (`user_id`),
  ADD KEY `idx_accounts_created_at` (`created_at`),
  ADD KEY `idx_accounts_is_active` (`is_active`),
  ADD KEY `idx_accounts_user_is_active` (`user_id`,`is_active`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_actor_user_id` (`actor_user_id`),
  ADD KEY `idx_impersonated_user_id` (`impersonated_user_id`),
  ADD KEY `idx_timestamp` (`timestamp`),
  ADD KEY `idx_severity` (`severity`),
  ADD KEY `idx_action` (`action`);

--
-- Indexes for table `bank_connections`
--
ALTER TABLE `bank_connections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_provider` (`provider`),
  ADD KEY `idx_institution_id` (`institution_id`),
  ADD KEY `idx_bank_connections_user_id` (`user_id`),
  ADD KEY `idx_bank_connections_status` (`status`);

--
-- Indexes for table `budgets`
--
ALTER TABLE `budgets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_period` (`period`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_budgets_user_id` (`user_id`),
  ADD KEY `idx_budgets_created_at` (`created_at`),
  ADD KEY `idx_budgets_is_active` (`is_active`);

--
-- Indexes for table `cashflow_projections`
--
ALTER TABLE `cashflow_projections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_user_date` (`user_id`,`date`),
  ADD KEY `idx_cp_date` (`date`);

--
-- Indexes for table `config_items`
--
ALTER TABLE `config_items`
  ADD PRIMARY KEY (`config_key`) USING BTREE,
  ADD KEY `idx_encrypted` (`encrypted`),
  ADD KEY `idx_masked` (`masked`),
  ADD KEY `idx_requires_step_up` (`requires_step_up`),
  ADD KEY `idx_config_items_last_updated_by_user_id` (`last_updated_by_user_id`);

--
-- Indexes for table `feature_flags`
--
ALTER TABLE `feature_flags`
  ADD PRIMARY KEY (`feature_key`) USING BTREE,
  ADD KEY `idx_value` (`value`),
  ADD KEY `idx_last_changed_at` (`last_changed_at`),
  ADD KEY `idx_feature_flags_overridden_by_user_id` (`overridden_by_user_id`);

--
-- Indexes for table `goals`
--
ALTER TABLE `goals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_is_completed` (`is_completed`),
  ADD KEY `idx_deadline` (`deadline`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_user_deadline` (`user_id`,`deadline`),
  ADD KEY `idx_goals_user_id` (`user_id`),
  ADD KEY `idx_goals_deadline` (`deadline`),
  ADD KEY `idx_goals_user_deadline` (`user_id`,`deadline`);

--
-- Indexes for table `investment_holdings`
--
ALTER TABLE `investment_holdings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investment_trades`
--
ALTER TABLE `investment_trades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_account_id` (`account_id`),
  ADD KEY `idx_symbol` (`symbol`),
  ADD KEY `idx_trade_date` (`trade_date`);

--
-- Indexes for table `licenses`
--
ALTER TABLE `licenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `license_id` (`license_id`),
  ADD KEY `idx_license_id` (`license_id`),
  ADD KEY `idx_tier` (`tier`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_expires_at` (`expires_at`),
  ADD KEY `idx_licenses_expires_at` (`expires_at`),
  ADD KEY `idx_licenses_status` (`status`);

--
-- Indexes for table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_principal` (`principal`),
  ADD KEY `idx_currentBalance` (`currentBalance`),
  ADD KEY `idx_interestRate` (`interestRate`);

--
-- Indexes for table `mfa_secrets`
--
ALTER TABLE `mfa_secrets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_expires_at` (`expires_at`),
  ADD KEY `idx_password_resets_user_id` (`user_id`),
  ADD KEY `idx_password_resets_expires_at` (`expires_at`);

--
-- Indexes for table `recurring_transactions`
--
ALTER TABLE `recurring_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `category` (`category`);

--
-- Indexes for table `savings_goals`
--
ALTER TABLE `savings_goals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scenarios`
--
ALTER TABLE `scenarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_createdAt` (`createdAt`),
  ADD KEY `idx_updatedAt` (`updatedAt`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_expires_at` (`expires_at`),
  ADD KEY `idx_token_family` (`access_token_family`),
  ADD KEY `idx_sessions_user_id` (`user_id`),
  ADD KEY `idx_sessions_expires_at` (`expires_at`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_account_id` (`account_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_date` (`transaction_date` DESC),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_user_created_at` (`user_id`,`created_at`),
  ADD KEY `idx_transactions_user_id` (`user_id`),
  ADD KEY `idx_transactions_created_at` (`created_at`),
  ADD KEY `idx_transactions_user_created` (`user_id`,`created_at`);

--
-- Indexes for table `upcoming_payments`
--
ALTER TABLE `upcoming_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_up_user` (`user_id`),
  ADD KEY `idx_up_account` (`account_id`),
  ADD KEY `idx_up_dueDate` (`dueDate`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_tier` (`tier`),
  ADD KEY `idx_users_license` (`license_id`),
  ADD KEY `idx_users_deleted_at` (`deleted_at`),
  ADD KEY `idx_users_license_id` (`license_id`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_accounts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_audit_impersonated` FOREIGN KEY (`impersonated_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_audit_logs_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_audit_logs_impersonated` FOREIGN KEY (`impersonated_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `bank_connections`
--
ALTER TABLE `bank_connections`
  ADD CONSTRAINT `bank_connections_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bank_connections_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `budgets`
--
ALTER TABLE `budgets`
  ADD CONSTRAINT `budgets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_budgets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `config_items`
--
ALTER TABLE `config_items`
  ADD CONSTRAINT `fk_config_items_user` FOREIGN KEY (`last_updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_last_updated_by_user` FOREIGN KEY (`last_updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `feature_flags`
--
ALTER TABLE `feature_flags`
  ADD CONSTRAINT `fk_feature_flags_user` FOREIGN KEY (`overridden_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_overridden_by_user` FOREIGN KEY (`overridden_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `goals`
--
ALTER TABLE `goals`
  ADD CONSTRAINT `fk_goals_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `investment_trades`
--
ALTER TABLE `investment_trades`
  ADD CONSTRAINT `investment_trades_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `investment_trades_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mfa_secrets`
--
ALTER TABLE `mfa_secrets`
  ADD CONSTRAINT `mfa_secrets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `fk_password_resets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recurring_transactions`
--
ALTER TABLE `recurring_transactions`
  ADD CONSTRAINT `fk_recurring_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_recurring_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_transactions_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
