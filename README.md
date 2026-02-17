# UTSAV: Organization Governance & Pavilion Intelligence

UTSAV is a production-grade, multi-tenant governance platform designed to manage large-scale organizations and their events (specifically tailored for Indian festivals like Sarvajanik Ganeshotsav) with radical financial transparency and operational efficiency.

Originally conceived as a **Festival Management System**, UTSAV has evolved into a comprehensive **Organization Governance Platform**, allowing institutions to manage multiple events, hundreds of members, and complex financial engines under one unified ecosystem.

## 🚀 Vision
To digitize the coordination of community festivals and organizations, replacing chaotic messaging groups and manual ledgers with a high-integrity digital twin of their operations.

## ✨ Key Features

### 🏛️ Multi-Tenant Organization Structure
- **Virtual Pavilions:** Create and manage unique organizations (Clubs, Festival Committees, etc.) with strict data isolation.
- **Tenant Scoping:** Implementation of custom Prisma Extensions ensures that data leakage between organizations is architecturally impossible.

### 🛡️ Governance & RBAC
- **Strict Access Control:** Granular Role-Based Access Control (Admin, Treasurer, Committee Member, Volunteer).
- **Member Lifecycle:** Secure invitation system with token-based joining and unarchiving logic for returning members.
- **Revocation:** Total control over pending invites with real-time revocation capabilities.

### 💰 High-Integrity Financial Engine
- **Donation Management:** Systematic tracking of donations with categorized reporting (Bhog, General, Decoration).
- **Expense Control:** Sophisticated approval workflow for expenses to prevent unauthorized spending and double-counting.
- **Atomic Summations:** Real-time financial dashboards with target-utilization analytics.

### 📋 Event Intelligence
- **Team Rosing:** Dynamic event assignment with automatic filtering of archived personnel.
- **Task Management:** Volunteer task allocation and tracking.
- **Historical Preservation:** Soft-delete architecture for events, ensuring that attendee and financial history remain intact for audit purposes.

### 🎨 Premium User Experience
- **Modern UI:** Built with Next.js 14, Tailwind CSS, and Shadcn UI.
- **Interactive Dashboards:** Real-time feedback and glassmorphic design elements.
- **Personalized Profiles:** Dedicated user profile centers showing memberships and activity across all platforms.

## 🛠️ Technical Stack
- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Database:** [PostgreSQL (Prisma ORM)](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)

## 📜 Development Philosophy: From Festival to Organization
UTSAV began as a tool for managing individual festival events. During development, it became clear that festivals aren't just events; they are **Organizations**. 

We rebuilt the architecture to support:
1. **Persistent Membership:** Members stay within the organization even when events end.
2. **Global Financials:** An organization-wide audit trail that spans multiple years and events.
3. **Operational Robustness:** Transitioned from hard-deletes to professional soft-deletes and state-driven filtering.

---
Built with ❤️ for community coordination.
