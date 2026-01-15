# AF-Mart Admin Panel

A modern, production-ready admin panel for managing e-commerce operations built with React.

## Features

- 📊 **Dashboard** - Real-time analytics and overview
- 📦 **Product Management** - Full CRUD operations for products
- 🏷️ **Categories** - Hierarchical category management
- 📋 **Order Tracking** - Complete order lifecycle management
- 👥 **Customer Database** - Customer management
- ⚙️ **Site Configuration** - Banners, settings, payment & shipping
- 🔐 **Authentication** - Secure login with JWT
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- React 19
- React Router v7
- Recharts for data visualization
- Lucide React for icons
- Axios for API calls

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=AF-Mart Admin Panel
```

5. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Default Admin Credentials

After running the backend seed:
- **Email:** admin@example.com
- **Password:** admin123

## Production Build

### Local Build

```bash
# Create production build
npm run build

# The build folder contains the optimized static files
```

Serve the build folder with any static file server:
```bash
# Using npx serve
npx serve -s build

# Or using Python
python3 -m http.server 3000 -s build

# Using Node.js http-server
npx http-server build -p 3000
```

## Project Structure

```
admin/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── api/
│   │   └── api.js              # API configuration
│   ├── components/
│   │   ├── Navbar/
│   │   ├── ProtectedRoute/     # Route protection
│   │   └── Sidebar/
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Login/              # Login page
│   │   ├── OrdersCustomers/
│   │   ├── Products/
│   │   └── SiteConfig/
│   ├── App.js                  # Main app component
│   └── index.js                # Entry point
└── package.json
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm test` | Run tests |
| `npm run eject` | Eject from Create React App |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000` |
| `REACT_APP_NAME` | Application name | `AF-Mart Admin Panel` |
| `REACT_APP_ENABLE_ANALYTICS` | Enable analytics | `true` |
| `REACT_APP_ENABLE_DARK_MODE` | Enable dark mode | `true` |

## API Integration

The admin panel expects the following API endpoints from the backend:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order
- `PUT /api/orders/:id` - Update order

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/overview` - Analytics overview
- `GET /api/analytics/revenue` - Revenue data

## Customization

### Theming

Customize the appearance by modifying:
- `src/App.css` - Global styles
- `src/index.css` - Base styles
- Component-specific CSS files

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `App.js`
3. Add navigation item in `Sidebar.js`

## License

MIT

