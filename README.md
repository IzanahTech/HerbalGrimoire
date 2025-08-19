# 🌿 The A to Z Herbal Grimoire

A modern, full-stack herbal knowledge management system built with Next.js 14, featuring a beautiful interface for browsing, searching, and managing herbal information.

![Herbal Grimoire](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.14.0-2D3748?style=for-the-badge&logo=prisma)

## ✨ Features

### 🌱 **Herb Management**
- **Comprehensive Herb Database**: Store detailed information about herbs including properties, uses, contraindications, and more
- **Flexible Content Structure**: Support for custom sections and standardized herb properties
- **Image Management**: Multiple images per herb with drag-and-drop reordering and primary image selection
- **Rich Content Support**: Markdown support for detailed descriptions and notes

### 🔍 **Search & Navigation**
- **Alphabetical Navigation**: Browse herbs by letter ranges (A-E, F-J, K-O, P-T, U-Z)
- **Real-time Search**: Instant search across herb names, scientific names, and descriptions
- **Smart Filtering**: Combine search terms with alphabetical navigation
- **Responsive Grid Layout**: Beautiful card-based interface that works on all devices

### 🛡️ **Admin Features**
- **Secure Authentication**: Protected admin panel for content management
- **CRUD Operations**: Create, read, update, and delete herbs with validation
- **Bulk Operations**: Import/export herbs in JSON and CSV formats
- **Image Upload**: Drag-and-drop image uploads with automatic optimization

### ⌨️ **User Experience**
- **Keyboard Shortcuts**: Quick navigation with keyboard commands
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation
- **Modern UI**: Clean, intuitive interface built with shadcn/ui components

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Prisma ORM with SQLite
- **Authentication**: Custom admin authentication system
- **Testing**: Vitest with happy-dom for UI tests, supertest for API tests
- **Build Tools**: Next.js built-in bundling and optimization
- **Package Manager**: pnpm (with npm fallback support)

## 📋 Prerequisites

- **Node.js**: 20+ (LTS recommended)
- **pnpm**: 8+ (or npm 10+)
- **SQLite**: Bundled with the application

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/herbal-grimoire.git
cd herbal-grimoire
```

### 2. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
```

### 4. Database Setup
```bash
pnpm db:push
```

### 5. Seed Database (Optional)
```bash
pnpm seed
```

### 6. Start Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run test suite |
| `pnpm db:push` | Sync database schema |
| `pnpm seed` | Seed database with sample data |
| `pnpm studio` | Open Prisma Studio |

## 🗄️ Database Schema

### Herb Model
```typescript
model Herb {
  id                String   @id @default(cuid())
  slug              String   @unique
  name              String
  scientificName    String?
  description       String?
  properties        String?  // JSON array
  uses              String?  // JSON array
  contraindications String?
  family            String?
  location          String?
  energetics        String?
  partsUsed         String?  // JSON array
  constituents      String?  // JSON array
  dosage            String?
  notesOnUse        String?
  harvesting        String?
  recipes           String?  // JSON array
  customSections    String?  // JSON object
  images            Image[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### Image Model
```typescript
model Image {
  id        String   @id @default(cuid())
  url       String
  alt       String?
  herbId    String
  position  Int      @default(0)
  isPrimary Boolean  @default(false)
  createdAt DateTime @default(now())
  herb      Herb     @relation(fields: [herbId], references: [id], onDelete: Cascade)
}
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `n` | Navigate to new herb page |
| `/` | Focus search bar |
| `e` | Edit herb (on detail page) |
| `Ctrl+Delete` | Delete herb with confirmation |

## 🔐 Admin Authentication

The admin panel is protected by a simple authentication system. To access admin features:

1. Navigate to `/admin/login`
2. Enter your credentials
3. Access herb management features

## 📱 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/herbs` - List herbs (with search and filtering)
- `GET /api/herbs/[slug]` - Get herb details

### Admin Endpoints (Authentication Required)
- `POST /api/herbs` - Create new herb
- `PATCH /api/herbs/[slug]` - Update herb
- `DELETE /api/herbs/[slug]` - Delete herb
- `POST /api/herbs/[slug]/images` - Upload herb images
- `PATCH /api/herbs/[slug]/images/reorder` - Reorder images
- `PATCH /api/herbs/[slug]/images/primary` - Set primary image

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

The project includes:
- **Unit Tests**: Component and utility function tests
- **API Tests**: Endpoint testing with supertest
- **Integration Tests**: Full workflow testing

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `DATABASE_URL`
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js App Router
- **Railway**: Great for full-stack deployments
- **Self-hosted**: Docker support available

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **shadcn/ui** for the beautiful component library
- **Prisma** for the excellent ORM
- **Herbal Community** for inspiration and knowledge

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/herbal-grimoire/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/herbal-grimoire/discussions)
- **Wiki**: [Project Wiki](https://github.com/yourusername/herbal-grimoire/wiki)

---

<div align="center">
  <p>Made with 🌿 by the Herbal Grimoire Team</p>
  <p>Star this repository if you found it helpful!</p>
</div>
