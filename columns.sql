-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 11, 2025 at 12:57 PM
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
-- Database: `information_schema`
--

-- --------------------------------------------------------

--
-- Structure for view `columns`
--

CREATE TEMPORARY TABLE `COLUMNS` (
  `TABLE_CATALOG` varchar(512) NOT NULL,
  `TABLE_SCHEMA` varchar(64) NOT NULL,
  `TABLE_NAME` varchar(64) NOT NULL,
  `COLUMN_NAME` varchar(64) NOT NULL,
  `ORDINAL_POSITION` bigint(21) UNSIGNED NOT NULL,
  `COLUMN_DEFAULT` longtext,
  `IS_NULLABLE` varchar(3) NOT NULL,
  `DATA_TYPE` varchar(64) NOT NULL,
  `CHARACTER_MAXIMUM_LENGTH` bigint(21) UNSIGNED,
  `CHARACTER_OCTET_LENGTH` bigint(21) UNSIGNED,
  `NUMERIC_PRECISION` bigint(21) UNSIGNED,
  `NUMERIC_SCALE` bigint(21) UNSIGNED,
  `DATETIME_PRECISION` bigint(21) UNSIGNED,
  `CHARACTER_SET_NAME` varchar(32),
  `COLLATION_NAME` varchar(64),
  `COLUMN_TYPE` longtext NOT NULL,
  `COLUMN_KEY` varchar(3) NOT NULL,
  `EXTRA` varchar(80) NOT NULL,
  `PRIVILEGES` varchar(80) NOT NULL,
  `COLUMN_COMMENT` varchar(1024) NOT NULL,
  `IS_GENERATED` varchar(6) NOT NULL,
  `GENERATION_EXPRESSION` longtext
) ENGINE=Aria DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- VIEW `columns`
-- Data: None
--

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
