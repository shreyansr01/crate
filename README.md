# Crate

> A minimal inventory management app and REST API built with FastAPI, PostgreSQL, and React.

---

### Dashboard
![Dashboard](frontend/public/home_page.png)

### Inventory
![Inventory](frontend/public/all_product_page.png)

### Product Details
![Product Details](frontend/public/product_details_card.png)

### Add / Edit Product
![Add / Edit Product](frontend/public/add_product_page.png)

---

## Features

- **Dashboard Metrics**: Live overview of total products, low-stock alerts, and out-of-stock items.
- **Product Management**: Instant search, stock status filtering, and quick in-table restocking (+10 units).
- **Safe Session Lifecycle**: Centralized `get_db` generator with clean session teardown and startup database seeding.
- **Interactive API Docs**: Built-in Swagger UI at `/docs` for exploring and testing endpoints.

---

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL, Pydantic v2, Uvicorn
- **Frontend**: React 19, Vite, Lucide Icons

---

## API Reference

Interactive documentation available at `http://localhost:8000/docs`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check |
| `GET` | `/products` | List all products |
| `GET` | `/products/{id}` | Get product by ID |
| `POST` | `/products` | Create product |
| `PUT` | `/products/{id}` | Update product |
| `DELETE` | `/products/{id}` | Delete product |
| `POST` | `/products/{id}/restock?amount=10` | Restock product quantity |

---

## Getting Started

### 1. Database

Create a PostgreSQL database:
```sql
CREATE DATABASE inventory_db;
```

Configure `backend/.env` (refer to `backend/.env.example`):
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/inventory_db
```

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv
uvicorn main:app --reload
```
API runs at `http://localhost:8000` (docs at `http://localhost:8000/docs`).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`.

---

## Author

**Shreyan Sardar** — [Portfolio](https://shreyansr.vercel.app/) · [GitHub](https://github.com/shreyansr01) · [LinkedIn](https://www.linkedin.com/in/shreyansardar/)
