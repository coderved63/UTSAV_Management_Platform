# 🚀 Deployment Guide: UTSAV Platform

This guide outlines the professional steps to deploy the **UTSAV** platform to production. 

---

## 🏗️ Deployment Architecture
- **Frontend/API**: [Vercel](https://vercel.com) (Optimized for Next.js)
- **Database**: [Railway](https://railway.app) or [Supabase](https://supabase.com) (PostgreSQL)
- **Authentication**: NextAuth.js (Requires `NEXTAUTH_SECRET`)

---

## 1. Prepare the Database (Railway/Supabase)
Since UTSAV uses PostgreSQL with Prisma, you need a live database URL.

### Options:
1. **Railway (Recommended for speed)**:
   - Create a new project.
   - Add **PostgreSQL**.
   - Copy the `DATABASE_URL` (Connection String).
2. **Supabase**:
   - Create a new project.
   - Go to **Project Settings > Database**.
   - Copy the **Connection string** (URI mode).

---

## 2. Prepare the Codebase
Make sure all recent changes are committed and pushed to your GitHub repository.

```bash
git add .
git commit -m "Final production-ready build and verified architectural fixes"
git push origin main
```

---

## 3. Deploy to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New > Project**.
3. Import your **UTSAV** GitHub repository.
4. **Environment Variables**: This is the most critical step. Add the following variables:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Your PostgreSQL connection string (from Step 1) |
| `NEXTAUTH_SECRET` | A long random string (Generate via `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your production domain (e.g., `https://your-app.vercel.app`) |

5. **Build Settings**:
   - Framework: **Next.js**
   - Root Directory: `./`
   - Build Command: `npx prisma generate && next build`
   - Install Command: `npm install`

6. Click **Deploy**.

---

## 4. Post-Deployment: Database Migration & Seeding
Once Vercel finishes the build, your schema needs to be applied to the live database.

### Run Migrations:
```bash
npx prisma migrate deploy
```

### Seed Initial Data (Optional - for Demo):
```bash
npx prisma db seed
```

---

## 🛡️ Important Security Checklist
- [ ] **NEXTAUTH_URL**: Ensure this matches your final domain.
- [ ] **CORS**: If using external assets, update your Next.js config.
- [ ] **Prisma Accelerate**: For high-traffic, consider using Prisma Accelerate to pool connections.

---

## 🏁 Success!
Your application will be live at the `.vercel.app` URL provided by Vercel. You can now connect your custom domain in the Vercel Dashboard.
