# 🩸 BloodLine – Blood Bank Management System

**Bloodline** is a centralized blood bank management solution designed to simplify and modernize blood donation workflows. From donor registration and appointment booking to blood stock tracking and donation camp scheduling, Bloodline offers a seamless and secure experience for hospitals, donors, blood camp organizers and administrators.

---

## 🌐 Live Demo

🚀 https://bloodlinesrilanka.com/

---

## 📁 Project Structure

```
bloodline/
├── frontend/    # React + TypeScript + Vite + Tailwind-based UI
└── backend/     # Node.js + Express + MongoDB API server
```

---

## 🧰 Tech Stack

### Frontend

- **Language**: TypeScript
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, Flowbite, Styled Components
- **Routing**: React Router DOM
- **Authentication**: Asgardeo Auth
- **Visualization**: Chart.js, React-Chartjs-2
- **Calendar & Forms**: React Calendar, Formik, Yup
- **Maps**: Google Maps API (`@react-google-maps/api`)
- **Misc**: Axios, React Tooltip, JSBarcode, React Datepicker

### Backend

- **Runtime**: Node.js, Express
- **Language**: TypeScript
- **Database**: Azure Cosmos DB with MongoDB API
- **Cloud**: Azure Web Apps, Azure Blob Storage
- **Authentication**: JWT, JWKS-RSA
- **Utilities**: Multer, Nodemailer, UUID, CORS
- **Testing**: Jest, Supertest

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- npm or yarn
- Azure Cosmos DB or MongoDB (local or hosted on MongoDB Atlas)
- Azure credentials (for CosmosDB & Blob Storage)
- Google Maps API Key

---

## 🖥️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/OnaliyVinukiy/bloodline.git
cd bloodline
```

### 2. Environment Variables

Create `.env` files in both `frontend/` and `backend/` directories.

#### 📦 Backend `.env`

```env
PORT=5000
COSMOS_DB_CONNECTION_STRING=your_mongodb_connection_string
ASGARDEO_TENANT=your_asgardeo_tenant
AZURE_COSMOS_DB_URI=your_cosmosdb_connection_string
AZURE_BLOB_CONNECTION_STRING=your_blob_storage_key
VITE_CLIENT_ADMIN_ID=your_asgardeo_admin_id
VITE_CLIENT_SECRET=your_asgardeo_client_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_API_VERSION=your_azure_openai_api_version
AZURE_OPENAI_DEPLOYMENT_NAME=your_openai_deployment_name
AZURE_OPENAI_ENDPOINT=https://your-openai-resource.openai.azure.com/
REACT_APP_API_URL=https://your-frontend-api-url.com/

```

#### 🌐 Frontend `.env`

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key
VITE_BASE_URL=your_asgardeo_base_url
VITE_BACKEND_URL=your_backend_url
VITE_ASGARDEO_CLIENT_ID=your_asgardeo_client_id
VITE_ASGARDEO_ORGANIZATION=your_organization_url
PORT=5173
```

---

### 3. Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd ../backend
npm install
```

---

### 4. Run the Application

#### Start the Backend Server

```bash
npm run dev
```

#### Start the Frontend App

```bash
cd ../frontend
npm run dev
```

Visit `http://localhost:5173` to view the app.

---

## 🧪 Running Tests

### Backend Tests

```bash
npm run test
```

---

## 📊 Features

- ✅ Donor & Organization Registration
- 📅 Appointment Booking
- 🩸 Blood Stock Management
- 🏥 Blood Camp Scheduling & Search
- 🩸 Blood Processing Management
- 🩸 Blood Testing Management
- 🧾 Barcode Generation for Blood Units
- 📍 Map-based Camp Locator
- 🔐 Secure JWT Authentication
- 📧 Email Notifications

---

## 🛠️ Scripts

### Frontend

| Command           | Description                      |
|------------------|----------------------------------|
| `npm run dev`     | Start Vite dev server            |
| `npm run build`   | Build for production             |
| `npm run lint`    | Lint the code                    |
| `npm run preview` | Preview production build         |

### Backend

| Command           | Description                       |
|------------------|-----------------------------------|
| `npm run dev`     | Start server with nodemon         |
| `npm run build`   | Transpile TypeScript to JavaScript |
| `npm run test`    | Run tests with Jest               |
| `npm run lint`    | Lint backend code                 |

---


## 🧑‍💻 Authors

- [Onaliy Vinukiy Jayawardana](https://github.com/OnaliyVinukiy)

---


## ❤️ Support

If you find this project useful, feel free to give it a ⭐ on GitHub or share it with others!
