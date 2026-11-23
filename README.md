# Reenz Organic

A custom Next.js storefront and admin dashboard, styled with the supplied Reenz Organic design and assets. Product catalog, product images, customer orders, and contact messages are stored in MongoDB Atlas. The storefront does not use a third-party commerce platform.

## Local setup

Use Node.js 22.13 or newer. Create `.env.local` in the project root and configure:

- `MONGODB_URI`: the MongoDB Atlas connection string. Keep it private and do not commit it.
- `MONGODB_DB`: the database name; defaults to `reenzorganic`.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: the private admin sign-in credentials. Use a unique password with at least 12 characters.
- `ADMIN_SESSION_SECRET`: a random secret with at least 32 characters. Generate one with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

- `GEMINI_API_KEY` (or `GOOGLE_API_KEY`): a server-only Google Gemini API key for generating product descriptions with Gemini 3.5 Flash-Lite. Google offers this model on its free tier subject to current quotas and terms.

Keep `.env.local` private; it is ignored by Git.

Then run:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. On the first request, the app creates the required MongoDB indexes. The catalog starts empty; add products and optional images through the admin dashboard. Prices are stored as integer minor units to avoid floating-point rounding. Existing data in another database is not copied automatically.

## Admin dashboard

Open `/admin/login` and sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`. The dashboard supports creating, editing, publishing, unpublishing, and deleting catalog products. When a product name or category is entered, the editor automatically suggests an editable two-line description in simple, conversational English with Gemini 3.5 Flash-Lite. It focuses on the product, avoids repeating its category, and excludes weight and size details. The admin can also request a suggestion manually. Product images are optional; JPEG, PNG, and WebP uploads (up to 4 MB) are stored in the product document in MongoDB, served dynamically, and can be replaced or removed in the dashboard. No catalog image is written to the public folder or an external blob store. The admin can also review customer orders and update their status.

Admin sessions use signed, HTTP-only, same-site cookies and expire after eight hours. Mutating admin requests require a same-origin request. Admin credentials are supplied only through server environment variables; there is no default password or public registration.

## Orders and contact

The store has its own checkout flow with cash on delivery. The server verifies that every selected option is currently published, recalculates the total using the latest database prices, and saves an order snapshot in MongoDB. Customers receive an order confirmation and the admin can track it as pending, confirmed, shipped, completed, or cancelled. No online card processor is configured.

The contact form stores messages in MongoDB. It does not submit data to an external storefront or commerce provider.

## Vercel deployment

1. Create a MongoDB Atlas database and set `MONGODB_URI` and (optionally) `MONGODB_DB` in the Vercel deployment environment. Allow the deployment to connect to the Atlas cluster using its network-access settings.
2. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and `GEMINI_API_KEY` in Vercel project settings. Keep the values private and use separate credentials for production.
3. Deploy the app. Required indexes are initialized idempotently on first use; product and image data are read from MongoDB in both local and production environments.

## Validation

```powershell
npm run lint
npm run typecheck
npm run build
```
