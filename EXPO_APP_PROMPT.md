# HabitCapsule - Expo React Native App Prompt

Build **HabitCapsule**, a premium habit tracking mobile app using **Expo (React Native)**, **Clerk** for authentication, and **Convex** as the real-time database backend.

---

## 🎨 Design System

### Color Palette (Dark Theme)
- **Background**: `#09090B` (zinc-950)
- **Cards**: `#18181B` (zinc-900) with 50% opacity
- **Borders**: `#27272A` (zinc-800)
- **Text Primary**: `#FFFFFF`
- **Text Muted**: `#71717A` (zinc-500)
- **Accent Colors**: 
  - Red: `#F87171`, Orange: `#FB923C`, Yellow: `#FBBF24`
  - Green: `#4ADE80`, Cyan: `#22D3EE`, Blue: `#60A5FA`
  - Purple: `#A78BFA`, Pink: `#F472B6`

### Typography
- **Headings**: Bold, white
- **Body**: Regular, zinc-300
- **Muted**: zinc-500

### UI Components
- Rounded cards with subtle borders
- Glassmorphism effects (blur + transparency)
- Smooth animations and transitions
- Haptic feedback on interactions

---

## 🔐 Authentication (Clerk)

Use **Clerk Expo SDK** for authentication:
- Sign In / Sign Up screens with email/password
- OAuth providers (Google, Apple)
- Protected routes for dashboard screens
- User profile management

---

## 📊 Database Schema (Convex)

### `users` table
```typescript
{
  clerkId: string,           // Clerk user ID
  email?: string,
  name?: string,
  timezone: string,
  isActive: boolean,
  createdAt: number,
  updatedAt: number
}
// Indexes: by_clerk_id, by_email
```

### `habits` table
```typescript
{
  userId: Id<"users">,
  clerkId: string,
  title: string,
  description?: string,
  category?: string,         // Health, Fitness, Productivity, Learning, Mindfulness, Social, Finance, Other
  color: string,             // Hex color code
  goalType: "binary" | "duration" | "quantity",
  goalTarget?: number,       // e.g., 30 for 30 minutes
  unit?: string,             // e.g., "minutes", "pages", "glasses"
  active: boolean,
  createdAt: number,
  updatedAt: number
}
// Indexes: by_user, by_clerk_id, by_user_active
```

### `habitEntries` table
```typescript
{
  habitId: Id<"habits">,
  userId: Id<"users">,
  clerkId: string,
  entryDate: string,         // ISO format YYYY-MM-DD
  completed: boolean,
  value?: number,            // For duration/quantity goals
  notes?: string,
  createdAt: number,
  updatedAt: number
}
// Indexes: by_habit, by_user, by_clerk_id, by_habit_date, by_user_date, by_clerk_date
```

### `badges` table
```typescript
{
  userId: Id<"users">,
  clerkId: string,
  name: string,
  description?: string,
  icon?: string,
  metadata?: any,
  awardedAt: number
}
// Indexes: by_user, by_clerk_id
```

---

## 📱 App Screens

### 1. Dashboard (Home)
**Main screen showing today's habits and stats**

- **Header**: Greeting with user name, current date
- **Stats Cards** (horizontal scroll):
  - Active Habits count
  - Today's Completion (X/Y completed)
  - Current Streak (days)
  - 7-Day Average (%)
- **Today's Habits List**:
  - Habit card with color indicator, title, goal info
  - Tap to toggle completion (with animation)
  - Only today and past 2 days are editable
- **Quick Actions**: Add new habit button

### 2. Habits Screen
**Calendar-grid view for habit tracking**

- **Month Navigation**: Previous/Next month buttons with month name
- **Calendar Grid**:
  - Rows = Habits (with color dot and title)
  - Columns = Days of month
  - Cells = Tap to toggle completion (colored when completed)
  - Today column highlighted
- **Restrictions**: Can only edit today and past 2 days
- **Weekly Completion** footer showing progress bars per week
- **Actions**: Edit/Delete habits via swipe or long-press menu

### 3. Calendar Screen
**Monthly calendar showing completion heatmap**

- **Month Navigation**
- **Calendar View**:
  - Each day shows completion percentage as color intensity
  - Tap a day to see list of habits and their status
- **Color Legend**: 0%, 25%, 50%, 75%, 100% completion

### 4. Insights Screen
**Analytics and statistics**

- **Overview Stats Cards**:
  - Total Habits, Active Habits, 7-Day Average, Best Streak
- **Charts** (use `react-native-chart-kit` or `victory-native`):
  - **30-Day Trend**: Area chart of completion rate
  - **Weekly Performance**: Bar chart of daily completions
  - **Habit Streaks**: Horizontal bar chart (current vs best streak)
  - **Category Distribution**: Pie/Donut chart
- **Top Performers Table**: Ranked list of habits by streak

### 5. Settings Screen
- **Profile Section**: Name, email, timezone
- **App Settings**: Notifications, theme
- **Danger Zone**: Logout, Delete Account
- **About**: App version, privacy policy, terms

### 6. Export Screen
- **Date Range Picker**: Start and end date
- **Habit Selection**: Multi-select list
- **Export Options**:
  - CSV Export (share sheet)
  - PDF Report (with statistics and charts)

---

## 🔧 Key Features

### Habit Management
- Create habits with: title, description, category, color, goal type
- Goal Types:
  - **Binary**: Yes/No completion
  - **Duration**: Track minutes (e.g., meditate for 30 min)
  - **Quantity**: Track count (e.g., drink 8 glasses of water)
- Edit and delete habits
- Archive (deactivate) habits without deleting data

### Entry Tracking
- Toggle completion with single tap
- Only allow edits for today and past 2 days
- Show visual feedback (checkmark, color fill)
- Optimistic UI updates with loading states

### Analytics
- Real-time stats calculation
- Streak tracking (current and best)
- Weekly and monthly trends
- Category breakdown

### Export
- CSV with summary statistics
- PDF report with embedded charts

---

## 🛠 Tech Stack

```
- Expo SDK 50+
- React Native
- TypeScript
- Clerk Expo SDK (Authentication)
- Convex React Native (Database)
- Expo Router (Navigation)
- NativeWind or StyleSheet (Styling)
- React Native Reanimated (Animations)
- React Native Chart Kit / Victory Native (Charts)
- Expo Haptics (Haptic feedback)
- Expo Sharing (Export)
```

---

## 📁 Project Structure

```
/app
  /(auth)
    sign-in.tsx
    sign-up.tsx
  /(tabs)
    index.tsx           # Dashboard
    habits.tsx          # Calendar grid
    calendar.tsx        # Monthly view
    insights.tsx        # Analytics
    settings.tsx        # Settings
  /modals
    create-habit.tsx
    edit-habit.tsx
    export.tsx
/components
  /ui                   # Reusable components (Button, Card, etc.)
  HabitCard.tsx
  StatsCard.tsx
  CalendarGrid.tsx
  Charts/
/convex
  schema.ts
  habits.ts
  entries.ts
  analytics.ts
  users.ts
/lib
  utils.ts
  constants.ts
```

---

## ✨ UX Guidelines

1. **Haptic Feedback**: On habit completion toggle
2. **Animations**: 
   - Checkmark appears with scale animation
   - Cards have subtle press animation
   - Charts animate on load
3. **Loading States**: Skeleton screens while data loads
4. **Empty States**: Friendly illustrations when no data
5. **Error Handling**: Toast notifications for errors
6. **Offline Support**: Queue actions when offline

---

## 🚀 Getting Started

1. Initialize Expo project with TypeScript
2. Set up Clerk with Expo SDK
3. Set up Convex with React Native
4. Create database schema and API functions
5. Build authentication flow
6. Implement tab navigation with Expo Router
7. Build each screen following the design specs
8. Add animations and polish
9. Test on iOS and Android

---

**Target**: A beautiful, performant habit tracker that feels native and premium, with real-time sync across devices.
