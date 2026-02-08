# E-Waste Challenge Platform

A gamified platform for promoting e-waste recycling through challenges, quizzes, and community engagement.

## Features

### 🔐 Authentication System
- **Separate Login Pages**: Different login interfaces for admin and customers
- **Role-Based Access Control**: Admin and customer roles with appropriate permissions
- **Protected Routes**: Secure access to admin panel and customer features

### 👥 User Management
- **Customer Registration**: Sign up for recycling challenges and quizzes
- **Admin Panel**: Manage users, challenges, quizzes, and view statistics
- **User Profiles**: Track progress, points, and achievements

### 🎯 Challenges
- **Recycling Missions**: Various e-waste recycling challenges
- **Difficulty Levels**: Easy, medium, and hard challenges
- **Point System**: Earn points for completing challenges
- **Categories**: Mobile, computers, batteries, appliances, etc.

### 🧠 Quizzes
- **Knowledge Tests**: Educational quizzes about e-waste and recycling
- **Multiple Categories**: Basics, recycling, environment, technology
- **Difficulty Levels**: Beginner, intermediate, and advanced
- **Learning Rewards**: Earn points while learning

### 📊 Admin Panel
- **Dashboard Overview**: Platform statistics and metrics
- **User Management**: View, suspend, and manage user accounts
- **Challenge Management**: Approve, reject, and manage challenges
- **Quiz Management**: Control quiz availability and settings
- **Reports & Analytics**: Platform performance insights

## 🔒 Security Features

### Database Security
- **Firestore Security Rules**: Comprehensive access controls at database level
- **Role-Based Authorization**: Admin and customer role enforcement
- **Data Validation**: Server-side validation for all operations
- **Ownership Verification**: Users can only access their own data

### Application Security
- **Input Validation**: Client and server-side validation using ValidationService
- **Authentication Protection**: Secure auth flow with race condition prevention
- **Admin Access Control**: All admin tools protected with authorization checks
- **Audit Logging**: Tracking of sensitive operations

### Security Best Practices
- **Principle of Least Privilege**: Minimal permissions for each role
- **Defense in Depth**: Multiple layers of security validation
- **Error Handling**: Secure error messages without information leakage
- **Regular Security Reviews**: Ongoing security monitoring and updates

📖 **Detailed security guidelines available in [SECURITY.md](./SECURITY.md)**

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Set up security rules for Firestore

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

## Usage

### For Customers
1. **Sign Up**: Visit `/login` and create a new account
2. **Dashboard**: View progress, available challenges, and quizzes
3. **Challenges**: Browse and participate in recycling challenges
4. **Quizzes**: Take educational quizzes to earn points
5. **Progress**: Track your recycling impact and achievements

### For Admins
1. **Admin Login**: Visit `/admin/login` with admin credentials
2. **Dashboard**: View platform overview and statistics
3. **User Management**: Monitor and manage user accounts
4. **Content Management**: Approve challenges and manage quizzes
5. **Analytics**: Review platform performance and user engagement

## Database Structure

### Collections

#### userRoles
```typescript
{
  uid: string;
  email: string;
  role: 'admin' | 'customer';
  displayName?: string;
  createdAt: Date;
  status: 'active' | 'suspended';
}
```

#### challenges
```typescript
{
  title: string;
  description: string;
  points: number;
  status: 'active' | 'pending' | 'inactive';
  creator: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  requirements: string[];
  createdAt: Date;
}
```

#### quizzes
```typescript
{
  title: string;
  description: string;
  questions: number;
  status: 'active' | 'draft' | 'inactive';
  category: string;
  points: number;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
}
```

## Security Features

- **Protected Routes**: Role-based access control
- **Authentication Required**: All sensitive pages require login
- **Admin Verification**: Admin panel only accessible to admin users
- **Data Validation**: Input validation and sanitization
- **Secure API Calls**: Firebase security rules enforcement

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
