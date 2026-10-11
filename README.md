
<div align="center">

# 🛒 আজকের বাজার দর | Ajker Bazar Dor

### Everyday market prices in Bangladesh, made easier to explore.

A responsive, Bengali-first grocery price dashboard for browsing essential products, comparing daily price changes, and checking market-wise prices.

[🌐 Live Website](https://ajker-bazar-dor-fawn.vercel.app) · [💻 GitHub Repository](https://github.com/say33eed/ajker-bazar-dor)

</div>

---

## 📖 About the Project

**Ajker Bazar Dor (BazarDor)** helps users explore the prices of everyday essentials in Bangladesh. The interface displays product names, units, prices, and price movements in Bangla, with category navigation and detailed market comparisons.

The project was built as **Programming Hero — Batch 14, Assignment 07**.

## ✨ Key Features

- **📈 Daily price movements:** Separate sections highlight products whose prices have increased or decreased, alongside the complete product catalog.
- **🔁 Live-style price ticker:** A continuously moving, right-to-left strip displays product names, units, current prices, and percentage changes. It respects reduced-motion preferences.
- **🗂️ Category browsing:** Explore essential goods by category, with a responsive grid and a category-specific product count.
- **↕️ Price sorting:** Sort category products by default order, lowest price first, or highest price first.
- **📊 Product details:** View today's price, change from yesterday, minimum, maximum, average, and a market-wise price comparison table when data is available.
- **🔐 Authentication:** Email/password sign-up and sign-in, plus Google and GitHub OAuth using Better Auth.
- **👤 Profile management:** View account information and update the user's display name.
- **🇧🇩 Bengali-friendly interface:** Bangla product names, Bengali numerals, localized units, and price-change indicators.
- **📱 Responsive design:** Layouts designed for mobile, tablet, and desktop screens, with loading states and helpful empty/error pages.

## 🧰 Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS 4, DaisyUI 5 |
| Authentication | Better Auth (email/password, Google, GitHub) |
| Database | MongoDB Atlas, Better Auth MongoDB adapter |
| Notifications | React Hot Toast |
| Hosting | Vercel |
| Data | BazarDor products and categories API |

## 🗺️ Pages & Routes

| Route | Description |
| --- | --- |
| `/` | Homepage with hero, price risers, price fallers, and all products |
| `/category/[slug]` | Category products and sorting |
| `/product/[slug]` | Product price details and market comparison |
| `/signin` | Email/password and social sign-in |
| `/signup` | Account registration |
| `/profile` | User profile |
| `/profile/update` | Update profile information |

## 🚀 Run Locally

**Prerequisites:** Node.js and npm, a MongoDB Atlas database, and OAuth credentials if you want Google/GitHub sign-in.

### 1. Clone the repository

```bash
git clone https://github.com/say33eed/ajker-bazar-dor.git
cd ajker-bazar-dor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```dotenv
MONGODB_URI=your_mongodb_atlas_connection_string
BETTER_AUTH_SECRET=your_secure_random_secret
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** Never commit `.env.local` or actual credentials. Google and GitHub sign-in require valid provider credentials and correctly configured OAuth callback URLs. The server requires `MONGODB_URI`.

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Visit **http://localhost:3000** in your browser.

## 🛠️ Available Scripts

```bash
npm run dev     # Start the development server
npm run build   # Create a production build
npm run start   # Start the production server
npm run lint    # Run ESLint
```

## 🔌 Data API

The source snapshot fetches product and category information from:

```text
https://openapi.programming-hero.com/api/bazardor
```

### API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/products` | Fetch all products |
| GET | `/products?category=chal` | Fetch products by category |
| GET | `/products/:id` | Fetch individual product details |
| GET | `/categories` | Fetch product categories |

The assignment also documents alternative BazarDor API hosts. Product prices depend on the external API and may vary by market and over time.

## 📁 Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/       # Better Auth handler
│   ├── category/
│   │   └── [slug]/            # Category pages
│   ├── product/
│   │   └── [slug]/            # Product details
│   ├── profile/
│   │   ├── update/            # Profile update
│   │   └── page.tsx           # Profile page
│   ├── signin/                # Sign in
│   ├── signup/                # Sign up
│   ├── globals.css            # Global styles and ticker animation
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── components/                # Navbar, ticker, cards, sections, etc.
├── lib/
│   ├── auth.ts                # Server-side auth configuration
│   ├── auth-client.ts         # Client-side auth helpers
│   └── utils.ts               # Types and formatting helpers
└── proxy.ts                   # Profile route protection
```

## ☁️ Deployment

The project is deployed on **Vercel**.

To deploy your own copy:

1. Push your project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain.
5. Register the corresponding OAuth callback URLs with Google and GitHub.
6. Deploy the application.
7. Verify authentication, category navigation, sorting, and product details.

**Live deployment:** https://ajker-bazar-dor-fawn.vercel.app

## 🎨 Design & Accessibility

The interface follows the assignment's Figma-inspired visual direction.

### Design Highlights

- Soft green backgrounds and a clean visual layout
- Rounded product cards with subtle borders
- Bengali typography and localized price formatting
- Responsive grids for desktop, tablet, and mobile
- Green indicators for price decreases
- Red indicators for price increases
- Custom category sorting dropdown
- Animated horizontal price ticker
- Loading skeletons and helpful empty states

### Accessibility

The application includes semantic HTML, keyboard-friendly controls, and responsive layouts. The animated ticker respects the system's `prefers-reduced-motion` preference.

## ⚠️ Price Disclaimer

Prices are provided for informational purposes and may change depending on market conditions and the availability of external API data.

---

<div align="center">

Built for **Programming Hero — Batch 14, Assignment 07**.

**[🌐 Visit Ajker Bazar Dor](https://ajker-bazar-dor-fawn.vercel.app)**

</div>
