-- Vridhi Database Schema
-- Run this file in MySQL to create the database and tables
-- Command: mysql -u root -p < db/schema.sql

CREATE DATABASE IF NOT EXISTS vridhi;
USE vridhi;

-- Users table: stores registered user accounts
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  age INT,
  mobile VARCHAR(15),
  category ENUM('Student','Employee','Business','Housewife','Farmer'),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255) DEFAULT NULL,
  email_verification_expires DATETIME DEFAULT NULL,
  reset_password_token VARCHAR(255) DEFAULT NULL,
  reset_password_expires DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial profiles: one-to-one with users, stores financial data
CREATE TABLE IF NOT EXISTS financial_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  monthly_income DECIMAL(12,2) DEFAULT 0,
  essential_expenses DECIMAL(12,2) DEFAULT 0,
  current_savings DECIMAL(12,2) DEFAULT 0,
  existing_debt DECIMAL(12,2) DEFAULT 0,
  risk_preference ENUM('Low','Medium','High') DEFAULT 'Medium',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Goals: each user can have many financial goals
CREATE TABLE IF NOT EXISTS goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  saved_amount DECIMAL(12,2) DEFAULT 0,
  monthly_allocation DECIMAL(12,2) DEFAULT 0,
  deadline DATE,
  completion_email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Email Preferences
CREATE TABLE IF NOT EXISTS user_email_preferences (
  user_id INT PRIMARY KEY,
  goal_notifications BOOLEAN DEFAULT TRUE,
  milestone_emails BOOLEAN DEFAULT TRUE,
  deadline_reminders BOOLEAN DEFAULT TRUE,
  monthly_reports BOOLEAN DEFAULT TRUE,
  quiz_emails BOOLEAN DEFAULT TRUE,
  financial_alerts BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Goal Milestones (Tracks 25%, 50%, 75% progress emails)
CREATE TABLE IF NOT EXISTS goal_milestones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  goal_id INT NOT NULL,
  milestone_pct INT NOT NULL,
  email_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_goal_milestone (goal_id, milestone_pct),
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

-- Goal Deadline Reminders (Tracks ~7-day reminders)
CREATE TABLE IF NOT EXISTS goal_deadline_reminders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  goal_id INT NOT NULL,
  reminder_type VARCHAR(50) DEFAULT '7_days',
  email_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_goal_reminder (goal_id, reminder_type),
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

-- Financial Alerts Log (Tracks user alerts to prevent duplicate notifications)
CREATE TABLE IF NOT EXISTS financial_alerts_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_alert (user_id, alert_type, sent_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Community surveys & quiz results: financial awareness responses
CREATE TABLE IF NOT EXISTS community_surveys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  maintains_budget BOOLEAN,
  saves_regularly BOOLEAN,
  has_emergency_fund BOOLEAN,
  has_financial_goal BOOLEAN,
  understands_investing BOOLEAN,
  biggest_difficulty TEXT,
  awareness_rating INT,
  survey_type ENUM('before','after') DEFAULT 'before',
  quiz_score INT DEFAULT NULL,
  quiz_total INT DEFAULT 10,
  score_percentage DECIMAL(5,2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Quiz Historical Attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quiz_type ENUM('before', 'after') NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL DEFAULT 10,
  percentage DECIMAL(5,2) NOT NULL,
  attempt_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_quiz (user_id, quiz_type, created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Feedback: user experience feedback after using Vridhi
CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  ease_of_use INT,
  usefulness INT,
  most_useful_feature VARCHAR(255),
  suggestions TEXT,
  problems TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
