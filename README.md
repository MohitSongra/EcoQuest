# Gamified E-Waste Challenge Platform

A modern, interactive web application that gamifies e-waste recycling through challenges, quizzes, and rewards. Built with Next.js, TypeScript, Tailwind CSS, and Firebase.

## 🌟 Features

- **Interactive Dashboard**: Track progress, view statistics, and manage recycling activities
- **Challenges System**: Join various e-waste recycling missions with different difficulty levels
- **Knowledge Quizzes**: Test your knowledge about e-waste and earn bonus points
- **Admin Panel**: Comprehensive management interface for administrators
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **Real-time Updates**: Firebase integration for live data synchronization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gamified-ewaste-full
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   └── Navigation.tsx  # Navigation component
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper
│   ├── index.tsx       # Home page
│   ├── dashboard/      # User dashboard
│   ├── challenges/     # Challenges listing
│   ├── quizzes/        # Knowledge quizzes
│   └── admin/          # Admin panel
├── lib/                # Utility libraries
│   └── firebase.ts     # Firebase configuration
├── services/           # Service layer
│   └── firebase.ts     # Firebase services
└── styles/             # Global styles
    └── globals.css     # Tailwind CSS imports
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Firebase (Firestore, Authentication)
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS v4 with PostCSS. Configuration files:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS plugins

### TypeScript
TypeScript configuration in `tsconfig.json` includes:
- Path aliases (`@/*` for `src/*`)
- Strict type checking
- Modern ES features

## 📱 Pages Overview

1. **Home** (`/`) - Landing page with features and call-to-action
2. **Dashboard** (`/dashboard`) - User progress tracking and statistics
3. **Challenges** (`/challenges`) - Browse and join recycling challenges
4. **Quizzes** (`/quizzes`) - Take knowledge tests and earn points
5. **Admin** (`/admin`) - Administrative controls and analytics

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
1. Build the project: `npm run build`
2. Start production server: `npm run start`
3. Deploy the `.next` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🌱 Environmental Impact

This platform encourages responsible e-waste disposal and recycling, contributing to a more sustainable future. Every challenge completed helps reduce electronic waste in landfills and promotes environmental awareness.

---

**Built with ❤️ for a greener planet**
