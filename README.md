<div align="center">
  <img src="public/logo.png" alt="UTSAV Logo" width="200" />
  <h1>🏛️ UTSAV</h1>
  <p><strong>Organization Governance & Pavilion Intelligence</strong></p>
</div>

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-green)](https://www.prisma.io/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

**UTSAV** is a production-grade, multi-tenant governance platform designed to digitize the operations of large-scale cultural organizations and festivals. It replaces chaotic manual ledgers and messaging groups with a high-integrity, digital twin of the organization.

Originally conceived as a *Festival Management System*, UTSAV has evolved into a comprehensive **Organization Governance Platform**, capable of managing multiple events, hundreds of members, and complex financial engines with strict data isolation.

---

## ✨ Key Features

###  Multi-Tenant Security & Isolation
Built from the ground up for scale, UTSAV uses a robust multi-tenant architecture.
- **Virtual Pavilions:** Create and manage diverse organizations (Festivals, Clubs, Committees).
- **Hard Limits & Governance:** Enforced limit of 3 organizations per user to maintain ecosystem integrity.
- **Organization Deletion:** Full control over the lifecycle with a secure "Danger Zone" for permanent organization deletion.
- **Architectural Isolation:** Custom Prisma Extensions (`getTenantPrisma`) ensure data never leaks between organizations.
- **Role-Based Access Control (RBAC):** Granular permissions for Admins, Treasurers, Members, and Volunteers.

###  High-Integrity Financial Engine
A "Zero-Trust" financial system designed for radical transparency.
- **Double-Entry Operations:** Every expense and donation is tracked with atomic precision.
- **Approval Workflows:** Expenses require digital sign-off before impacting the ledger.
- **Real-time Analytics:** Dashboard aggregations for target vs. utilized funds.

### Intelligent Event Governance
- **Lifecycle Management:** Plan, Activate, and Archive events.
- **Soft-Delete Architecture:** Historical data (attendees, finances) is preserved even after event deletion for audit purposes.
- **Smart Rostering:** Automated team assignments that filter out archived or suspended members.

- **Shielded Invitations:** High-security, token-based system with strict email matching to prevent account hijacking.
- **Omnichannel Sharing:** Generate instant invitation links for direct sharing via WhatsApp or personal messaging.
- **Instant Onboarding:** Ability to skip automated emails for faster, link-based member onboarding.
- **Profile Centricity:** Members maintain a unified identity across multiple organizations while preserving role-specific data.

---

##  System Architecture

UTSAV follows a modular, service-oriented architecture ensuring separation of concerns and scalability.

```mermaid
graph TD
    User((User)) -->|Auth via NextAuth| WebApp[Next.js Web App]
    
    subgraph "Application Layer"
        WebApp -->|Server Actions| OrgService[Organization Service]
        WebApp -->|Server Actions| FinService[Financial Service]
        WebApp -->|Server Actions| EventService[Event Service]
    end

    subgraph "Data Access Layer"
        OrgService -->|getTenantPrisma| Prisma[Prisma ORM]
        FinService -->|getTenantPrisma| Prisma
        EventService -->|getTenantPrisma| Prisma
    end

    subgraph "Infrastructure"
        Prisma -->|Query| DB[(PostgreSQL Database)]
        WebApp -->|SendGrid/SMTP| Email[Email Service]
    end

    style WebApp fill:#f9f,stroke:#333,stroke-width:2px
    style DB fill:#bbf,stroke:#333,stroke-width:2px
```

---

## 📸 Interface Preview

<!-- [PLACEHOLDER: Dashboard Screenshot] -->
<!-- Caption: The Command Center showing real-time financial stats and active events. -->

<!-- [PLACEHOLDER: Financial Table Screenshot] -->
<!-- Caption: Granular expense tracking with approval status indicators. -->

<!-- [PLACEHOLDER: Member Management Screenshot] -->
<!-- Caption: Role management and invitation status board. -->

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL Database (Local or Neon/Supabase)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/coderved63/UTSAV_Management_Platform.git
   cd UTSAV_Management_Platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Duplicate `.env.example` to `.env` and fill in your secrets.
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure `NEXTAUTH_URL` is set to `http://localhost:3000` for local development.*

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## � Project Structure

```bash
src/
├── actions/        # Server Actions (Mutations)
├── app/            # Next.js App Router Pages
├── components/     # Shadcn UI & Custom Components
│   ├── dashboard/  # Feature-specific widgets
│   ├── layout/     # Shell, Sidebar, Navbar
│   └── ui/         # Primitives (Buttons, Cards)
├── lib/            # Utilities (Auth, Email, Prisma)
├── modules/        # Business Logic Domain Services
│   ├── core/       # Org, Member, Invitation Logic
│   ├── festival/   # Event & Financial Logic
│   └── public/     # Public-facing interactions
└── types/          # TypeScript Definitions
```

---

## 🛡️ Security & Privacy

- **Authentication:** Powered by `next-auth` with secure session handling.
- **Safety:** Stale sessions are automatically invalidated.
- **Data Protection:** All organization data is logically isolated via tenant IDs.

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ by Vedant Mehta*
