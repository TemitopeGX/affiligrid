export interface HelpArticle {
    slug: string;
    title: string;
    description: string;
    category: string;
    iconName: string; // Lucide icon name
    content: string;
}

export interface HelpCategory {
    id: string;
    name: string;
    iconName: string;
    description: string;
}

export const helpCategories: HelpCategory[] = [
    { id: 'getting-started', name: 'Getting Started', iconName: 'Rocket', description: 'Learn the basics and set up your store' },
    { id: 'products', name: 'Products & Store', iconName: 'ShoppingBag', description: 'Add and manage your digital products' },
    { id: 'marketing', name: 'Marketing & Email', iconName: 'Mail', description: 'Grow your audience and send campaigns' },
    { id: 'analytics', name: 'Analytics & Tracking', iconName: 'BarChart3', description: 'Understand your traffic and conversions' },
    { id: 'customization', name: 'Customization', iconName: 'Palette', description: 'Make your store look amazing' },
    { id: 'account', name: 'Account & Settings', iconName: 'Settings', description: 'Manage your account and security' },
];

export const helpArticles: HelpArticle[] = [
    // ── Getting Started ──────────────────────────────
    {
        slug: 'create-your-store',
        title: 'Create Your AffiliGrid Store',
        description: 'Set up your personalized affiliate store in under 2 minutes.',
        category: 'getting-started',
        iconName: 'Store',
        content: `
## Create Your AffiliGrid Store

Welcome to AffiliGrid! Follow these steps to get your store up and running.

### Step 1: Sign Up

1. Go to the [AffiliGrid homepage](/) and click **Get Started**
2. Enter your **username**, **email**, and **password**
3. Click **Register**

### Step 2: Complete Your Profile

1. Navigate to **Dashboard > Settings**
2. Upload a **profile picture** (recommended: 400x400px)
3. Write a short **bio** that describes what you do
4. Click **Save**

### Step 3: Choose Your Username

Your username becomes your public store URL:

\`\`\`
https://affiligrid.com/your-username
\`\`\`

> Choose something memorable and brand-friendly. You can change it later in Settings.

### Step 4: Add Your First Product

1. Go to **Dashboard > Products**
2. Click **Add Product**
3. Fill in the title, description, price, and affiliate link
4. Click **Create**

Your product is now live on your public store.

### Next Steps

- [Customize your store appearance](/help/customize-store-theme)
- [Set up email marketing](/help/setup-email-campaigns)
- [Add tracking pixels](/help/setup-tracking-pixels)
        `.trim(),
    },
    {
        slug: 'dashboard-overview',
        title: 'Dashboard Overview',
        description: 'A complete tour of your AffiliGrid dashboard and all its sections.',
        category: 'getting-started',
        iconName: 'LayoutDashboard',
        content: `
## Dashboard Overview

Your dashboard is the command center for your AffiliGrid store.

### Overview Page

The main dashboard shows at a glance:

- **Total clicks** across all products
- **Total products** in your store
- **Recent activity** and trends
- **Quick actions** to add products or view your store

### Products

Manage your catalog:

- Add, edit, or delete products
- Upload product images
- Set prices and affiliate links
- Toggle product visibility
- Reorder products by dragging

### Categories

Organize products into groups:

- Create themed categories (e.g., "Tools", "Courses", "Templates")
- Assign products to categories
- Drag to reorder

### Analytics

Track performance:

- Click counts per product
- Traffic trends over time
- Export analytics data as CSV

### Audience

Manage subscribers:

- View all newsletter subscribers
- Search by email
- Export subscriber list as CSV

### Campaigns

Email marketing:

- Compose and send emails to your audience
- Track sent campaigns and recipient counts

### Appearance

Customize your store:

- Change colors, fonts, and layout
- Real-time preview
- Choose card styles (bordered, shadow, minimal)

### Settings

Account management:

| Tab | What It Controls |
|-----|-----------------|
| **General** | Profile info, bio, profile picture |
| **Marketing** | Tracking pixels, announcement banner, email SMTP |
| **Security** | Password management |
| **Notifications** | Email notification preferences |
| **Billing** | Subscription and payment info |
        `.trim(),
    },

    // ── Products & Store ─────────────────────────────
    {
        slug: 'add-products',
        title: 'Add and Manage Products',
        description: 'How to add affiliate products, set prices, and manage your catalog.',
        category: 'products',
        iconName: 'Package',
        content: `
## Add and Manage Products

Products are the core of your AffiliGrid store. Each product is a digital item with an affiliate link.

### Adding a New Product

1. Go to **Dashboard > Products**
2. Click **Add Product**
3. Fill in the required fields:

| Field | Description |
|-------|-------------|
| **Title** | The product name visitors will see |
| **Description** | Detailed info about the product |
| **Price** | The product price |
| **URL / Affiliate Link** | Where the customer goes when they click Buy |
| **Images** | Upload up to 5 product images |
| **Category** | Assign to an existing category |
| **Visibility** | Toggle if the product is shown publicly |

4. Click **Create**

### Editing a Product

1. Find the product in your Products list
2. Click the **Edit** icon
3. Make your changes
4. Click **Update**

### Product Types

AffiliGrid supports two product types:

- **Standard Products** — One-time purchase affiliate items
- **Membership Products** — Recurring subscription items with billing cycle information

### Best Practices

- Use **high-quality images** (recommended: 1200x800px)
- Write detailed descriptions with **bullet points**
- Set competitive prices
- Organize products into **categories** for easy browsing
        `.trim(),
    },
    {
        slug: 'manage-categories',
        title: 'Organize with Categories',
        description: 'Create categories to group and organize your products for visitors.',
        category: 'products',
        iconName: 'FolderOpen',
        content: `
## Organize with Categories

Categories help visitors find products quickly by grouping related items together.

### Creating a Category

1. Go to **Dashboard > Categories**
2. Click **Add Category**
3. Enter the category name (e.g., "Design Tools", "Online Courses")
4. Click **Create**

### Assigning Products

When creating or editing a product, select a category from the dropdown menu. Each product can belong to one category.

### Reordering

Drag and drop categories to change the order they appear on your public store page.

### Recommendations

- Keep category names **short and clear**
- Use **3-7 categories** for the best browsing experience
- Place your most popular category first
- Review and consolidate categories periodically
        `.trim(),
    },
    {
        slug: 'product-reviews',
        title: 'Product Reviews and Ratings',
        description: 'How customer reviews and star ratings work on your product pages.',
        category: 'products',
        iconName: 'Star',
        content: `
## Product Reviews and Ratings

Reviews provide social proof and help build trust with potential customers.

### How Reviews Work

- Visitors can leave a **star rating** (1-5) and a **written review**
- Reviews appear on the public product page
- The **average rating** is shown on product cards
- Reviews are tied to specific products

### Impact on Conversions

Products with reviews tend to have higher conversion rates. Each review adds credibility and SEO value to your product pages.

### Best Practices

- Encourage satisfied customers to leave feedback
- Products with **4+ star ratings** convert significantly better
- Respond to feedback when possible (coming soon)
        `.trim(),
    },

    // ── Marketing & Email ────────────────────────────
    {
        slug: 'setup-email-campaigns',
        title: 'Set Up Email Campaigns',
        description: 'How to compose and send email campaigns to your subscriber list.',
        category: 'marketing',
        iconName: 'Send',
        content: `
## Set Up Email Campaigns

Send email campaigns directly to your subscribers from the AffiliGrid dashboard.

### Step 1: Build Your Subscriber List

Subscribers come from the **newsletter signup form** on your public profile page. Every visitor who enters their email is automatically added to your audience.

### Step 2: Configure Your Email

By default, campaigns are sent from AffiliGrid's system email. To send from **your own email address**:

1. Go to **Settings > Marketing**
2. Scroll to **Email Configuration**
3. Choose your provider (Gmail, Outlook, or Custom SMTP)
4. Enter your credentials
5. Click **Save**, then **Send Test Email** to verify

> See the full guide: [How to Set Up Gmail App Password](/help/setup-gmail-app-password)

### Step 3: Create a Campaign

1. Go to **Dashboard > Campaigns**
2. Click **New Campaign**
3. Write your **subject line**
4. Write your **email body** (supports HTML formatting)
5. Click **Create Campaign**

The campaign is saved as a **draft**.

### Step 4: Send

1. Review the campaign in the Drafts section
2. Click the **Send** button
3. The email is delivered to all your subscribers

### HTML Formatting

Use HTML tags in the email body for rich formatting:

\`\`\`html
<h2>Big Announcement</h2>
<p>We just launched something amazing.</p>
<a href="https://your-link.com">Check it out</a>
<br>
<b>Bold text</b> and <i>italic text</i>
\`\`\`
        `.trim(),
    },
    {
        slug: 'setup-gmail-app-password',
        title: 'Set Up Gmail App Password',
        description: 'Step-by-step guide to create a Gmail App Password for sending campaigns.',
        category: 'marketing',
        iconName: 'KeyRound',
        content: `
## Set Up Gmail App Password

To send email campaigns from your Gmail address, you need an **App Password**. Google does not allow regular passwords for third-party SMTP access.

### Prerequisites

- A Gmail account
- **2-Step Verification** must be enabled

### Step 1: Enable 2-Step Verification

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left sidebar
3. Under "How you sign in to Google", click **2-Step Verification**
4. Follow the prompts to enable it

### Step 2: Generate an App Password

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Sign in if prompted
3. In the "App name" field, type \`AffiliGrid\`
4. Click **Create**
5. Google will display a **16-character password**
6. Copy this password immediately

> This password is shown only once. If you lose it, you'll need to generate a new one.

### Step 3: Enter in AffiliGrid

1. Go to **Dashboard > Settings > Marketing**
2. Scroll to **Email Configuration**
3. Select the **Gmail / Google** tab
4. Enter your Gmail address in **Email / Username**
5. Paste the 16-character App Password in **Password**
6. Set your **From Name** and **From Email**
7. Click **Save**
8. Click **Send Test Email** to verify

### Troubleshooting

| Issue | Solution |
|-------|----------|
| App Passwords option not visible | Enable 2-Step Verification first |
| Authentication failed | Ensure you copied the password without spaces |
| Test email not received | Check your spam folder |
| Less secure apps warning | App Passwords bypass this requirement |
        `.trim(),
    },
    {
        slug: 'setup-outlook-email',
        title: 'Set Up Outlook / Microsoft 365 Email',
        description: 'Configure Outlook or Microsoft 365 for sending email campaigns.',
        category: 'marketing',
        iconName: 'Mail',
        content: `
## Set Up Outlook / Microsoft 365 Email

Use your Outlook or Microsoft 365 email to send campaigns.

### Configuration

1. Go to **Dashboard > Settings > Marketing**
2. Scroll to **Email Configuration**
3. Select the **Outlook / 365** tab
4. Enter your Outlook email in **Email / Username**
5. Enter your password in **Password**
6. Set your **From Name** and **From Email**
7. Click **Save**
8. Click **Send Test Email** to verify

### SMTP Details

These are auto-filled when you select the Outlook tab:

| Setting | Value |
|---------|-------|
| **Host** | smtp.office365.com |
| **Port** | 587 |
| **Encryption** | TLS |

### Requirements

- SMTP must be enabled in your Microsoft 365 admin settings
- If using multi-factor authentication, you may need an App Password
- Organization accounts may require admin approval for SMTP

### Troubleshooting

If authentication fails:

1. Verify SMTP is enabled for your account
2. Check if your organization blocks SMTP relay
3. Try creating an App Password in your Microsoft account security settings
        `.trim(),
    },
    {
        slug: 'announcement-banner',
        title: 'Announcement Banner',
        description: 'Display a promotional banner at the top of your store page.',
        category: 'marketing',
        iconName: 'Megaphone',
        content: `
## Announcement Banner

The announcement banner is a prominent bar displayed at the top of your public store page. Use it for promotions, launches, or important messages.

### Enable the Banner

1. Go to **Dashboard > Settings > Marketing**
2. Find the **Announcement Banner** section
3. Toggle **Enable Banner** to on
4. Type your message
5. Click **Save**

### Example Messages

- "New product just dropped — check it out"
- "Use code WELCOME for 10% off"
- "Free shipping on all orders this week"

### Behavior

- Displayed at the **top of your public profile page**
- Uses your store's **theme colors** automatically
- Visitors can **dismiss** it with the close button
- Reappears on the next page visit

### Best Practices

- Keep messages **under 80 characters**
- Include a **call to action**
- Update regularly to keep your store feeling fresh
- Use concise, action-oriented language
        `.trim(),
    },
    {
        slug: 'manage-subscribers',
        title: 'Manage Your Subscribers',
        description: 'View, search, and export your newsletter subscriber list.',
        category: 'marketing',
        iconName: 'Users',
        content: `
## Manage Your Subscribers

Your subscriber list is your most valuable marketing asset.

### Viewing Subscribers

1. Go to **Dashboard > Audience**
2. The table shows:
   - Email address
   - Date subscribed
   - Total subscriber count

### Searching

Use the search bar to filter by email address. Results update in real-time.

### Exporting

1. Click **Export CSV**
2. A \`.csv\` file downloads to your computer
3. Contains: Email, Subscribed At

You can import this CSV into other platforms:

- **Mailchimp** for advanced email automation
- **Google Sheets** for analysis
- **ConvertKit** for creator-focused email marketing

### How Subscribers Join

Visitors subscribe through the **newsletter signup form** on your public profile page. The process is automatic — no manual approval required.
        `.trim(),
    },

    // ── Analytics & Tracking ─────────────────────────
    {
        slug: 'setup-tracking-pixels',
        title: 'Facebook Pixel and Google Analytics',
        description: 'Add tracking pixels to your store for retargeting and analytics.',
        category: 'analytics',
        iconName: 'Target',
        content: `
## Facebook Pixel and Google Analytics

Tracking pixels help you understand visitors and run retargeting campaigns.

### Facebook Pixel

#### Getting Your Pixel ID

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Click **Data Sources** in the sidebar
3. Select your Pixel or create a new one
4. Copy the **Pixel ID** (e.g., \`1234567890123456\`)

#### Adding to AffiliGrid

1. Go to **Dashboard > Settings > Marketing**
2. Paste your Pixel ID in **Facebook Pixel ID**
3. Click **Save**

### Google Analytics

#### Getting Your Measurement ID

1. Go to [Google Analytics](https://analytics.google.com)
2. Click **Admin** (gear icon)
3. Under your property, click **Data Streams**
4. Click your web stream
5. Copy the **Measurement ID** (starts with \`G-\`)

#### Adding to AffiliGrid

1. Go to **Dashboard > Settings > Marketing**
2. Paste your ID in **Google Analytics ID**
3. Click **Save**

### Verification

After saving, visit your public profile page and verify:

1. Open DevTools (\`F12\`)
2. Go to the **Elements** tab
3. Search for \`fbevents\` — Facebook Pixel script should be present
4. Search for \`gtag\` — Google Analytics script should be present

### What Gets Tracked

- Page views on your public profile
- Page views on individual product pages
- User interactions based on your pixel configuration
        `.trim(),
    },
    {
        slug: 'understanding-analytics',
        title: 'Understanding Analytics',
        description: 'How to read your analytics dashboard and track store performance.',
        category: 'analytics',
        iconName: 'TrendingUp',
        content: `
## Understanding Analytics

The Analytics section provides insights into your store's performance.

### Available Metrics

| Metric | Description |
|--------|-------------|
| **Clicks** | Number of times a product link was clicked |
| **Views** | Page visits to your store (via Google Analytics) |
| **Subscribers** | Number of newsletter signups |

### Analytics Dashboard

Go to **Dashboard > Analytics** to see:

- **Total clicks** across all products
- **Trend charts** showing activity over time
- **Per-product breakdown** of click performance

### Exporting Data

1. Click **Export CSV** on the Analytics page
2. Download your data for offline analysis
3. Import into Google Sheets or Excel

### Improving Performance

- Products with high clicks but low conversions may need better descriptions
- Share top-performing products on social media
- Use **UTM parameters** on shared links to track traffic sources
- A/B test different product titles and descriptions
        `.trim(),
    },

    // ── Customization ────────────────────────────────
    {
        slug: 'customize-store-theme',
        title: 'Customize Your Store Theme',
        description: 'Change colors, fonts, layout, and card styles for your public store.',
        category: 'customization',
        iconName: 'Paintbrush',
        content: `
## Customize Your Store Theme

Make your store match your personal brand with the appearance settings.

### Accessing Theme Settings

1. Go to **Dashboard > Appearance**
2. Changes are previewed in real-time

### Colors

| Setting | Controls |
|---------|----------|
| **Background Color** | Main page background |
| **Text Color** | All text on the page |
| **Button Color** | CTA buttons and accents |
| **Button Text Color** | Text inside buttons |

### Typography

Choose from popular Google Fonts:

- **Inter** — Clean and modern
- **Roboto** — Friendly and readable
- **Poppins** — Rounded and playful
- **Space Grotesk** — Tech-forward
- And more

### Layout Options

- **Grid** — Products displayed in a card grid (2-3 columns)
- **List** — Products displayed in a vertical list

### Card Styles

- **Bordered** — Subtle border around each card
- **Shadow** — Elevated cards with drop shadow
- **Minimal** — Clean, no border or shadow

### Branding

Toggle **Show AffiliGrid Branding** on or off at the bottom of your store.

### Tips

- Use **contrasting colors** for text and background
- Dark backgrounds with light text look professional
- Test your store on **mobile** — it's automatically responsive
- Match your theme to your **brand colors**
        `.trim(),
    },
    {
        slug: 'add-social-links',
        title: 'Add Social Media Links',
        description: 'Connect your social media profiles to your store page.',
        category: 'customization',
        iconName: 'Link',
        content: `
## Add Social Media Links

Display your social media presence on your public store page.

### Adding Links

1. Go to **Dashboard > Appearance** or **Settings**
2. Find the **Social Links** section
3. Click **Add Social Link**
4. Select the platform:
   - Twitter / X
   - Instagram
   - Facebook
   - LinkedIn
   - GitHub
   - Website
5. Enter your profile URL
6. Click **Save**

### Display

Social links appear as **icons** on your public profile page, typically below your bio. Visitors can click them to visit your profiles.

### Recommendations

- Only add platforms where you are **actively posting**
- Use **verified or official** profile URLs
- Social links build **trust** with visitors
- Keep the list focused — 3-5 platforms is ideal
        `.trim(),
    },

    // ── Account & Settings ───────────────────────────
    {
        slug: 'change-password',
        title: 'Change Your Password',
        description: 'How to update your account password for security.',
        category: 'account',
        iconName: 'Lock',
        content: `
## Change Your Password

Keep your account secure by updating your password regularly.

### Steps

1. Go to **Dashboard > Settings**
2. Click the **Security** tab
3. Enter your **current password**
4. Enter your **new password** (minimum 8 characters)
5. Confirm the new password
6. Click **Update Password**

### Password Requirements

- Minimum **8 characters**
- Recommended: mix of letters, numbers, and symbols
- Do not reuse passwords from other services

### Forgot Your Password

If you cannot log in, use the **Forgot Password** link on the login page. A reset link will be sent to your registered email address.
        `.trim(),
    },
    {
        slug: 'update-profile',
        title: 'Update Your Profile',
        description: 'How to edit your username, email, bio, and profile picture.',
        category: 'account',
        iconName: 'UserCircle',
        content: `
## Update Your Profile

Your profile information appears on your public store page and in email campaigns.

### Editing

1. Go to **Dashboard > Settings > General**
2. Update any of the following:

| Field | Details |
|-------|---------|
| **Username** | Your unique store URL slug |
| **Email** | Account email for login and notifications |
| **Bio** | Short description, max 500 characters |
| **Profile Picture** | Square image, max 2MB |

3. Click **Save**

### Tips

- Your **bio** appears on your public profile — make it compelling
- Use a **professional headshot** or brand logo
- Your username determines your store URL: \`affiligrid.com/username\`
        `.trim(),
    },
    {
        slug: 'custom-smtp-setup',
        title: 'Custom SMTP Configuration',
        description: 'Set up a custom SMTP server for sending email campaigns.',
        category: 'account',
        iconName: 'Server',
        content: `
## Custom SMTP Configuration

If you have your own domain or mail server, you can configure custom SMTP to send campaigns from your business email.

### Configuration

1. Go to **Dashboard > Settings > Marketing**
2. Scroll to **Email Configuration**
3. Select the **Custom SMTP** tab
4. Enter your server details:

| Field | Example |
|-------|---------|
| **SMTP Host** | smtp.yourdomain.com |
| **Port** | 587 |
| **Username** | hello@yourdomain.com |
| **Password** | Your email password |
| **Encryption** | TLS (recommended) or SSL |

5. Set your **From Name** and **From Email**
6. Click **Save**
7. Click **Send Test Email** to verify

### Common SMTP Providers

| Provider | Host | Port |
|----------|------|------|
| **Zoho Mail** | smtp.zoho.com | 587 |
| **SendGrid** | smtp.sendgrid.net | 587 |
| **Mailgun** | smtp.mailgun.org | 587 |
| **Amazon SES** | email-smtp.us-east-1.amazonaws.com | 587 |

### Security

- SMTP passwords are **encrypted at rest** in our database
- Passwords are never included in API responses
- Use TLS encryption whenever possible

### Troubleshooting

- Verify your SMTP credentials are correct
- Check if your email provider requires App Passwords
- Ensure your server allows SMTP relay from external applications
- Check firewall settings for port 587 or 465
        `.trim(),
    },
];

export function getArticlesByCategory(categoryId: string): HelpArticle[] {
    return helpArticles.filter(a => a.category === categoryId);
}

export function getArticleBySlug(slug: string): HelpArticle | undefined {
    return helpArticles.find(a => a.slug === slug);
}
