# Employee Management Dashboard

> **College Assignment Web Application**  
> A modern, responsive, beginner-friendly **Employee Dashboard** web application built with **React.js**, **Vite**, **React Router DOM**, and **Bootstrap 5**.

---

## 📌 Project Overview

This web application was developed as a college project to demonstrate modern frontend React development principles, including:
- Client-side Single Page Application (SPA) routing with `react-router-dom`.
- External API consumption using React hooks (`useEffect`, `useState`, `fetch`).
- Handling loading indicators, error boundaries, and empty states.
- Interactive client-side form validation and state management.
- Responsive modern UI design using Bootstrap 5 and custom CSS styling.

---

## 🚀 Key Features

### 1. Navigation Bar (`Navbar.jsx`)
- **Sticky Responsive Navigation Bar**: Adapts cleanly across desktop, tablet, and mobile screens.
- **Brand Identity**: Features the application title **"Employee Management Dashboard"** with a custom employee badge icon.
- **Navigation Links**:
  - **Home**: Navigates to `/` (Employee Dashboard).
  - **Employee Form**: Navigates to `/employee-form` (Employee Registration Form).
- **Active Route Highlighting**: Highlights the currently active navigation link using React Router's `NavLink`.
- **Mobile Menu**: Responsive hamburger toggle menu powered by React state.

### 2. Home Page – Employee Dashboard (`Dashboard.jsx`)
- **Live API Integration**: Fetches real employee data from the external REST API:  
  `https://jsonplaceholder.typicode.com/users`
- **Hook-Based Data Fetching**: Employs React's `useEffect` and `useState` hooks with cleanups to avoid memory leaks.
- **Clean Responsive Table**: Displays **strictly the three required fields**:
  1. **ID** (Formatted badge e.g. `#01`)
  2. **Name** (Bold text with auto-generated initial avatar badge)
  3. **Email** (Clickable `mailto:` link with icon)
- **Loading State**: Displays an animated Bootstrap spinner and loading message while fetching.
- **Error State**: Displays a friendly, clear alert box with a **"Try Again"** button to retry the network request if it fails.
- **Empty State**: Displays an illustrated empty state when no employee records are found.
- **Interactive Search Filter**: Allows instant filtering of employees by Name, Email, or ID.
- **Summary Metric Cards**: Displays total employee count, API connection status (with live pulsing indicator), and data source info.

### 3. Employee Registration Form (`EmployeeForm.jsx`)
- **Four Required Fields**:
  1. **Name** (Text input) – Must be non-empty and at least 2 characters.
  2. **Designation** (Text input) – Must be non-empty and at least 2 characters.
  3. **Location** (Text input) – Must be non-empty.
  4. **Salary** (Number input) – Must be a positive numeric value greater than 0.
- **Input Validation**: Validates inputs upon submission, displaying descriptive Bootstrap `is-invalid` messages under offending fields and clearing errors as the user types.
- **Action Buttons**:
  - **Submit Button**: Validates inputs and presents a success summary.
  - **Reset Button**: Clears all input fields, resets validation errors, and dismisses alerts.
- **Success Notification**: Displays a prominent success banner and a **Registered Details Preview Card** displaying the submitted information formatted cleanly (including currency formatting).
- **Frontend Demonstration Only**: As specified, does not send POST requests, use a backend, or require a database.

### 4. Routing & Architecture (`App.jsx`)
- Configured routes:
  - `/` &rarr; Employee Dashboard (Home)
  - `/employee-form` &rarr; Employee Registration Form
  - `*` &rarr; Custom 404 Not Found Page
- Client-side navigation ensures seamless page transitions without full page reloads.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React.js (v19)** | Component-based UI library |
| **Vite** | Next-generation frontend build tool and dev server |
| **React Router DOM (v7)** | Client-side declarative routing and navigation |
| **Bootstrap 5** | Responsive grid system, components, and layout styling |
| **Bootstrap Icons** | Scalable vector icons for dashboard UI |
| **CSS3 & Inter Font** | Custom themes, soft shadows, rounded corners, and animations |
| **JSONPlaceholder API** | External mock REST API for employee data fetching |

---

## 📂 Project Structure

```text
employee-dashboard/
├── node_modules/             # Installed dependencies
├── public/                   # Static assets & favicon
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/               # Brand assets
│   ├── components/
│   │   ├── Navbar.jsx        # Responsive navigation bar with active links
│   │   └── Footer.jsx        # Project footer with attribution
│   ├── pages/
│   │   ├── Dashboard.jsx     # Home page displaying fetched API employee table
│   │   ├── EmployeeForm.jsx  # Employee registration form with validation
│   │   └── NotFound.jsx      # Fallback 404 page
│   ├── App.jsx               # Route definitions and main layout shell
│   ├── main.jsx              # Application bootstrap & CSS imports
│   └── index.css             # Global styles, theme variables, and card shadows
├── .gitignore                # Git ignore rules (node_modules, dist, etc.)
├── index.html                # HTML template with Google Fonts (Inter)
├── package.json              # Project dependencies and npm scripts
├── vite.config.js            # Vite configuration
└── README.md                 # Complete documentation & run instructions
```

---

## 💻 Local Setup & Execution Instructions

Follow these exact steps to run the application on your local machine using **Visual Studio Code** or any terminal:

### Prerequisites
- Make sure [Node.js](https://nodejs.org/) (version 18 or higher) is installed on your computer.

### Step 1: Open the Project in VS Code
1. Open Visual Studio Code.
2. Click **File > Open Folder...** and select the `employee-dashboard` folder.
3. Open the integrated terminal in VS Code:
   - Shortcut: ``Ctrl + ` `` (backtick) or go to **Terminal > New Terminal**.

### Step 2: Install Dependencies
In the terminal, run:
```bash
npm install
```
> **Note for Windows PowerShell Users:** If PowerShell shows a script execution policy error with `npm`, you can run:
> ```powershell
> npm.cmd install
> ```

### Step 3: Start the Development Server
Run the following command to start Vite's local dev server:
```bash
npm run dev
```
*(or `npm.cmd run dev`)*

The terminal will output a local URL (typically `http://localhost:5173/`).

### Step 4: Open in Your Browser
- Press `Ctrl + Click` on the link in your terminal, or open your web browser and navigate to:
  ```text
  http://localhost:5173/
  ```
- Test both pages:
  - **Dashboard (Home)**: `http://localhost:5173/`
  - **Employee Form**: `http://localhost:5173/employee-form`

### Step 5: Build for Production (Optional)
To verify the production build:
```bash
npm run build
npm run preview
```

---

## 🌐 External API Reference

The dashboard consumes real employee records from JSONPlaceholder:
- **Endpoint URL**: `https://jsonplaceholder.typicode.com/users`
- **Method**: `GET`
- **Data Extracted & Displayed**:
  - `id`: Unique employee numeric identifier.
  - `name`: Full name of the employee.
  - `email`: Official email address of the employee.

---

## 📤 GitHub Submission Guide

Follow these steps to upload this project to your GitHub account:

### 1. Initialize Git in the Project Folder
In the `employee-dashboard` terminal:
```bash
git init
```

### 2. Stage and Commit All Files
```bash
git add .
git commit -m "Initial commit: Complete Employee Management Dashboard React App"
```

### 3. Create a New Repository on GitHub
1. Log into your account at [GitHub.com](https://github.com/).
2. Click the **+** (plus) icon in the top right corner and select **New repository**.
3. Name your repository (e.g., `employee-management-dashboard`).
4. Keep it **Public**.
5. Leave "Add a README file" **unchecked** (we already created a complete one).
6. Click **Create repository**.

### 4. Link and Push to GitHub
Copy the commands shown on GitHub under **"…or push an existing repository from the command line"**:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/employee-management-dashboard.git
git push -u origin main
```
*(Replace `<YOUR_GITHUB_USERNAME>` with your actual GitHub username).*

### 5. Submit Your Project
Once pushed, copy the repository link:
```text
https://github.com/<YOUR_GITHUB_USERNAME>/employee-management-dashboard
```
and submit it as your college assignment link!

---

## 🎓 Academic Compliance Checklist

- [x] Responsive navigation bar with application title and employee icon.
- [x] Navigation links for **Home** and **Employee Form** with active link highlighting.
- [x] Live data fetched from `https://jsonplaceholder.typicode.com/users` via React hooks.
- [x] Displays strictly the required 3 fields: **ID**, **Name**, and **Email**.
- [x] Loading spinner and error handling with retry capability.
- [x] Clean empty state when no employees match.
- [x] Employee Form with 4 required fields: **Name**, **Designation**, **Location**, and **Salary**.
- [x] Input validation with positive salary enforcement.
- [x] Functional **Submit** and **Reset** buttons.
- [x] Prominent success message with submitted details preview card.
- [x] Clean client-side implementation with zero backend/database dependencies.
- [x] Professional blue, white, and light-grey color palette with modern typography and card shadows.
- [x] Complete `package.json`, `.gitignore`, and detailed `README.md`.
