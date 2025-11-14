<h1><b>Culture Bites</b></h1>
<h3>Meet, Greet, Eat, Repeat — A Social Dining Platform Connecting Cultures Through Food</h3>

<p>
Finding authentic cultural connection in a new place is hard — but sharing a meal shouldn't be.<br>
Culture Bites introduces a modern three-sided marketplace that brings together <b>Guests</b>, <b>Hosts</b>, and <b>Cooks</b> for unforgettable culinary experiences, powered by <b>AI-driven recommendations</b>, <b>collaborative event management</b>, and a <b>culture-first design philosophy</b>.
</p>

<p>
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"/>
  <img src="https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel"/>
</p>

---

## Overview

Culture Bites answers a crucial social question:

> **"How do we reconnect humanity through the universal language of food?"**

Built with Next.js 15 and powered by Supabase, this platform:

- Enables **Guests** to discover and book authentic cultural dining experiences
- Empowers **Hosts** to share their spaces for memorable gatherings
- Celebrates **Cooks** who bring their heritage and stories to life through food
- Uses **AI-powered recommendations** (Groq LLaMA 3.3 70B) for personalized event discovery
- Facilitates **collaborative event creation** between Hosts and Cooks
- Provides **real-time seat booking** and availability management

This project is **fully deployed**, **production-ready**, and built with modern web development best practices.

---

## Key Features

| Category                    | Description                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------- |
| **Three-Tier Marketplace**  | Unique platform connecting Guests, Hosts, and Cooks in a collaborative ecosystem     |
| **AI Recommendations**      | Groq-powered personalized event suggestions based on location and preferences         |
| **Role-Based Dashboards**   | Customized interfaces for Guests, Hosts, and Cooks with role-specific functionality  |
| **Event Management**        | Create, browse, and manage cultural dining events with rich media and details        |
| **Collaboration System**    | Two-way request workflow for Cook-Host partnerships                                  |
| **Seat Booking**            | Real-time availability tracking with request approval workflow                        |
| **Profile Wizards**         | Multi-step guided flows for creating Host and Cook profiles                          |
| **Image Integration**       | Pexels API for royalty-free images + direct upload functionality                     |
| **Glass-Morphism Design**   | Modern, aesthetic UI with semi-transparent cards and backdrop blur effects           |
| **Authentication & Auth**   | Supabase-powered email/password auth with role-based access control                  |

---

## Live Deployment

<p>
<a href="https://vercel.com/vishallakshminarayanans-projects/v0-melting-pot-app">
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel" />
</a>
<a href="https://v0.app/chat/projects/7IA1ZeCO7h3">
  <img src="https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge" />
</a>
</p>

**Live Application:** [https://vercel.com/vishallakshminarayanans-projects/v0-melting-pot-app](https://vercel.com/vishallakshminarayanans-projects/v0-melting-pot-app)

---

## Platform Capabilities

<table>
<tr>
<td width="33%" valign="top">

### **For Guests**
- Browse events by cuisine type
- Filter by date and location
- AI-powered event recommendations
- "Surprise Me" random discovery
- Request seats with dietary notes
- Track booking status

</td>
<td width="33%" valign="top">

### **For Hosts**
- Create detailed space profiles
- Upload venue photos
- Manage event calendars
- Request Cook collaborations
- Approve/decline seat requests
- Track capacity and availability

</td>
<td width="34%" valign="top">

### **For Cooks**
- Build culinary profiles
- Share heritage and stories
- Showcase specialties and dishes
- Request Host collaborations
- Manage event assignments
- Upload cuisine images

</td>
</tr>
</table>

---

## Architecture Overview

### **Technology Stack**

<table>
<tr>
<td width="50%" valign="top">

**Frontend Framework**
- Next.js 15.2.4 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4.1.9

**Backend & Database**
- Supabase (PostgreSQL)
- Next.js API Routes
- Groq AI (LLaMA 3.3 70B)

</td>
<td width="50%" valign="top">

**UI Components**
- shadcn/ui (40+ components)
- Radix UI Primitives
- Framer Motion
- Lucide React Icons

**Form & Validation**
- React Hook Form 7.60
- Zod 3.25.76
- Custom validation schemas

</td>
</tr>
</table>

---

## Project Structure

```
CultureBites/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication flows
│   │   ├── login/               # Login page
│   │   ├── signup/              # Role-based signup
│   │   └── onboarding/          # User onboarding
│   ├── api/                     # API routes
│   │   ├── pexels/             # Image search API
│   │   ├── recommend/          # AI recommendations
│   │   └── recommendations/    # Groq integration
│   ├── dashboard/              # Main dashboard hub
│   ├── events/[id]/            # Event details
│   ├── bookings/               # User bookings
│   └── page.tsx                # Home/redirect
├── components/                  # Reusable components
│   ├── dashboards/             # Role dashboards
│   │   ├── user-dashboard.tsx
│   │   ├── host-dashboard.tsx
│   │   └── cook-dashboard.tsx
│   ├── tabs/                   # Dashboard tabs
│   │   ├── mission-tab.tsx
│   │   ├── terms-tab.tsx
│   │   ├── guide-tab.tsx
│   │   ├── users-tab.tsx
│   │   ├── hosts-tab.tsx
│   │   └── cooks-tab.tsx
│   ├── ui/                     # shadcn/ui components
│   └── ...                     # Event, Host, Cook components
├── lib/                         # Utilities & config
│   ├── supabase/               # Supabase setup
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── database.ts
│   │   └── middleware.ts
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Utility functions
├── public/                      # Static assets
└── data/                        # Mock data
```

---

## Core Features Deep Dive

### 1. **AI-Powered Recommendations**

Using **Groq's LLaMA 3.3 70B**, Culture Bites provides personalized event suggestions:

```typescript
// Sample AI recommendation flow
POST /api/recommendations
{
  userId: "user-123",
  preferences: {
    location: "San Francisco",
    cuisines: ["Italian", "Mexican"],
    dietaryRestrictions: ["vegetarian"]
  }
}

// Returns top 3 AI-recommended events with reasoning
```

**Key Benefits:**
- Context-aware suggestions based on user location
- Considers dietary preferences and restrictions
- Explains reasoning behind recommendations
- Real-time filtering from available events

---

### 2. **Collaboration Request System**

Two-way marketplace enabling Cooks and Hosts to partner:

| Request Type | Flow | Status Tracking |
|--------------|------|----------------|
| **Cook → Host** | Cook proposes dishes for Host's space | Pending → Accepted/Declined |
| **Host → Cook** | Host invites Cook for specific event | Pending → Accepted/Declined |

**Features:**
- Proposed dish lists
- Custom messages
- Request history tracking
- Real-time status updates

---

### 3. **Event Management System**

Comprehensive event lifecycle management:

**Event Properties:**
- Title, cuisine type, description
- Date, start/end time, location
- Seat capacity and availability
- Host and Cook assignments
- Rich media (multiple images)

**Guest Interaction:**
- Seat request submission
- Dietary restrictions/notes
- Request status: Pending → Approved/Waitlist/Declined
- Real-time availability updates

---

### 4. **Multi-Step Profile Wizards**

Guided profile creation with validation:

**Host Profile Wizard:**
1. Space title and description
2. Location and capacity
3. Venue photos (upload or Pexels search)
4. Review and submit

**Cook Profile Wizard:**
1. Name and origin country
2. Specialties and cuisine types
3. Personal story
4. Cuisine images
5. Review and submit

---

## Tech Stack Details

<p>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" height="45" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" height="45" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" height="45" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" height="45" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/supabase/supabase-original.svg" height="45" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" height="45" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg" height="45" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" height="45" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" height="45" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg" height="45" />
</p>

### **Complete Dependency List**

**Core Framework:**
- `next`: 15.2.4
- `react`: 19.0.0
- `react-dom`: 19.0.0
- `typescript`: 5.x

**Backend & Database:**
- `@supabase/supabase-js`: Latest
- `@supabase/ssr`: Latest
- `groq-sdk`: For AI recommendations

**UI & Styling:**
- `tailwindcss`: 4.1.9
- `@radix-ui/*`: 20+ primitives
- `framer-motion`: Animation library
- `lucide-react`: 454+ icons
- `class-variance-authority`: Type-safe variants

**Forms & Validation:**
- `react-hook-form`: 7.60.0
- `@hookform/resolvers`: Validation resolvers
- `zod`: 3.25.76

**Additional UI:**
- `embla-carousel-react`: Carousels
- `react-day-picker`: Date selection
- `recharts`: 2.15.4 (charts/analytics)
- `sonner`: Toast notifications
- `vaul`: Drawer components

**Utilities:**
- `date-fns`: 4.1.0
- `uuid`: ID generation
- `clsx` & `tailwind-merge`: CSS utilities

---

## Platform Statistics

### **Project Metrics**

| Metric | Count |
|--------|-------|
| **Total Components** | 40+ React components |
| **API Endpoints** | 3 route handlers + server actions |
| **User Roles** | 3 (Guest, Host, Cook) |
| **Database Tables** | 6 core tables |
| **UI Components** | 20+ shadcn/ui + Radix UI |
| **Lines of Code** | ~5,000 lines |
| **npm Packages** | 30+ dependencies |

---

## Database Schema

**Core Tables:**

```typescript
// Events
{
  id: string
  title: string
  cuisine: string
  hostId: string
  cookId?: string
  dateISO: string
  startTime: string
  endTime: string
  location: string
  images: string[]
  seatsTotal: number
  seatsLeft: number
}

// Hosts
{
  id: string
  name: string
  spaceTitle: string
  spaceDesc: string
  location: string
  capacity: number
  photos: string[]
  userEmail?: string
}

// Cooks
{
  id: string
  name: string
  originCountry: string
  specialties: string[]
  story: string
  cuisineImages: string[]
  userEmail?: string
}

// Collaboration Requests
{
  id: string
  fromCookId: string
  toHostId: string
  eventId?: string
  message: string
  proposedDishes: string[]
  status: "pending" | "accepted" | "declined"
}

// Seat Requests
{
  id: string
  eventId: string
  guestName: string
  note?: string
  status: "pending" | "approved" | "waitlist" | "declined"
}
```

---

## Design Philosophy

### **Mission**

Culture Bites embodies four core values:

- **Compassion:** Caring for those far from home
- **Empathy:** Listening to stories behind every dish
- **Kindness:** Sharing meals and moments
- **Respect:** Valuing every culture, ingredient, and person

### **Vision**

> "To build a world where food reconnects humanity — one shared meal, one story, one friendship at a time."

### **Safe Space Pledge**

Every Culture Bites experience is built on:
- Mutual respect and cultural sensitivity
- Open-mindedness and curiosity
- Dietary accommodation and transparency
- Inclusive, judgment-free environments

---

## Getting Started

### **Prerequisites**

- Node.js 18+ and npm
- Supabase account
- Pexels API key (free)
- Groq API key (free tier available)

### **Installation**

```bash
# Clone the repository
git clone https://github.com/VishalLakshmiNarayanan/CultureBites.git
cd CultureBites

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase, Pexels, and Groq credentials

# Run the development server
npm run dev

# Open http://localhost:3000
```

### **Environment Variables**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PEXELS_API_KEY=your_pexels_key
GROQ_API_KEY=your_groq_key
```

---

## Deployment

This project is optimized for **Vercel** deployment:

```bash
# Deploy to Vercel
vercel deploy

# Or push to GitHub and connect to Vercel
git push origin main
```

**Deployment Configuration:**
- Framework Preset: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`

---

## Future Roadmap

### **Planned Features**

- **Payment Integration:** Stripe for event ticketing and Cook/Host payouts
- **Messaging System:** In-app chat between Guests, Hosts, and Cooks
- **Review & Ratings:** Post-event feedback and reputation system
- **Calendar Sync:** iCal/Google Calendar integration
- **Mobile App:** React Native iOS/Android companion
- **Advanced Filters:** Dietary tags, price ranges, distance radius
- **Social Sharing:** Share events on social media
- **Multi-Language Support:** i18n for global accessibility

### **Technical Enhancements**

- WebSocket integration for real-time notifications
- Redis caching for improved performance
- Image optimization and CDN integration
- Enhanced analytics dashboard
- A/B testing framework
- Improved SEO and metadata

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

**Built With:**
- [Next.js](https://nextjs.org/) - React meta-framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vercel](https://vercel.com/) - Deployment platform
- [v0.app](https://v0.app/) - AI-powered UI generation
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Groq](https://groq.com/) - AI inference
- [Pexels](https://www.pexels.com/) - Free stock photos

**Inspiration:**
- The global community of immigrants and food lovers
- Airbnb's sharing economy model
- Traditional potluck and supper club culture

---
