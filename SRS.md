# Software Requirements Specification (SRS) - BMI Web Application

## 1. Introduction
The BMI Web Application is a tool designed to help users calculate their Body Mass Index (BMI), track their history, and view statistical reports.

## 2. Technical Stack
- **Framework**: Next.js (Latest)
- **Database**: SQLite
- **ORM**: Prisma
- **Styling**: Tailwind CSS

## 3. Functional Requirements

### 3.1 User Management
- The system shall support multiple users.
- Users shall be able to maintain their own separate history of BMI calculations.
- *Note: Current implementation uses a shared database for demonstration.*

### 3.2 BMI Calculator
- Users shall be able to input their height (in cm) and weight (in kg).
- The system shall calculate the BMI value using the standard formula: `weight / (height/100)^2`.
- The system shall categorize the BMI into:
  - Underweight (< 18.5)
  - Normal weight (18.5 - 24.9)
  - Overweight (25 - 29.9)
  - Obesity (>= 30)

### 3.3 History Tracking
- The system shall save every calculation with a timestamp.
- Users shall be able to view a list of their past calculations.

### 3.4 MIS Reports
The system shall provide Management Information System (MIS) reports summarizing BMI data over different time periods:
- **Daily Report**: Aggregated data grouped by day.
- **Weekly Report**: Aggregated data grouped by week number.
- **Monthly Report**: Aggregated data grouped by month.
- **Yearly Report**: Aggregated data grouped by year.

Each report shall include:
- Total number of calculations (Count).
- Average BMI for the period.

## 4. Non-Functional Requirements
- **Performance**: The application should load quickly and handle reports efficiently.
- **Usability**: The interface should be responsive and mobile-friendly.
- **Data Integrity**: All calculations must be stored accurately in the SQLite database.
