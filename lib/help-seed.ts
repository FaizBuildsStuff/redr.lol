export interface HelpArticle {
  slug: string;
  title: string;
  category: string;
  category_icon: string;
  excerpt: string;
  content: string;
  read_time: number;
  popular: boolean;
  published: boolean;
}

export const HELP_SEED_ARTICLES: HelpArticle[] = [
  // ── Getting Started ──────────────────────────────────────────
  {
    slug: "creating-your-account",
    title: "Creating Your Account",
    category: "Getting Started",
    category_icon: "🚀",
    excerpt: "Learn how to sign up for redr.lol and get your profile live in minutes.",
    read_time: 3,
    popular: true,
    published: true,
    content: `<h2>Creating Your Account</h2>
<p>Getting started with redr.lol is fast and free. Follow these steps to create your account and launch your digital identity.</p>

<h3>Step 1 — Navigate to Sign Up</h3>
<p>Visit <strong>redr.lol</strong> and click the <em>Get Started</em> button in the top navigation. You'll be taken to the sign-up page.</p>

<h3>Step 2 — Choose Your Username</h3>
<p>Pick a unique username. This will become your public profile URL at <code>redr.lol/yourusername</code>. Usernames are:</p>
<ul>
  <li>Case-insensitive (stored in lowercase)</li>
  <li>3–30 characters long</li>
  <li>Letters, numbers, underscores, and hyphens only</li>
</ul>

<h3>Step 3 — Enter Your Email &amp; Password</h3>
<p>Use a valid email address and choose a strong password. Your password is hashed with bcrypt — we never store it in plain text.</p>

<h3>Step 4 — Complete Onboarding</h3>
<p>After signing up you'll be guided through a short onboarding flow to connect Discord, set up your first links, and configure your profile preferences.</p>

<blockquote>
  <p><strong>Tip:</strong> Connect your Discord account during onboarding to unlock the live presence card and connection badges on your profile.</p>
</blockquote>`,
  },
  {
    slug: "setting-up-your-profile",
    title: "Setting Up Your Profile",
    category: "Getting Started",
    category_icon: "🚀",
    excerpt: "A quick guide to filling in your profile details, links, and customization options.",
    read_time: 4,
    popular: true,
    published: true,
    content: `<h2>Setting Up Your Profile</h2>
<p>Your profile at <code>redr.lol/username</code> is your digital home. Here's how to make it yours.</p>

<h3>Dashboard Overview</h3>
<p>Once logged in, your dashboard gives you access to every aspect of your profile:</p>
<ul>
  <li><strong>Customize</strong> — Typewriter text, quotes, theme, background, Discord card</li>
  <li><strong>Links</strong> — Add social links and custom URLs</li>
  <li><strong>Badges</strong> — Show off your earned badges</li>
  <li><strong>Audio</strong> — Add background music to your profile</li>
</ul>

<h3>Typewriter Text</h3>
<p>Go to <strong>Dashboard → Customize</strong> and set your <em>Typewriter Heading</em>. This animates across your profile with rotating quotes beneath it.</p>

<h3>Adding Links</h3>
<p>Navigate to <strong>Dashboard → Links</strong>. Click <em>Add Link</em> and fill in the title, URL, and optional icon. Drag to reorder your links.</p>

<h3>Choosing a Theme</h3>
<p>redr.lol profiles support multiple visual themes. Select your preferred aesthetic in the Customize panel.</p>`,
  },
  {
    slug: "completing-onboarding",
    title: "Completing the Onboarding Flow",
    category: "Getting Started",
    category_icon: "🚀",
    excerpt: "What happens after you sign up — the four-step onboarding wizard explained.",
    read_time: 2,
    popular: false,
    published: true,
    content: `<h2>The Onboarding Flow</h2>
<p>After creating your account you'll be taken through a four-step onboarding wizard. Here's what each step covers.</p>

<h3>Step 1 — Connect Discord</h3>
<p>Linking your Discord account enables the live presence card, connection badges, and activity display on your public profile. You can skip this and connect later from Settings.</p>

<h3>Step 2 — Add Your Links</h3>
<p>Enter your social links. You can always add more from <strong>Dashboard → Links</strong> later.</p>

<h3>Step 3 — Media Preferences</h3>
<p>Decide whether you want music on your profile and choose any initial audio settings.</p>

<h3>Step 4 — Premium Prompt</h3>
<p>Learn about redr.lol Premium features. This step is optional — you can upgrade at any time from <strong>Dashboard → Premium</strong>.</p>

<blockquote>
  <p>Onboarding only runs once. After completion you go directly to the main dashboard on every subsequent login.</p>
</blockquote>`,
  },

  // ── Profile & Customization ──────────────────────────────────
  {
    slug: "typewriter-text-and-quotes",
    title: "Typewriter Text & Quotes",
    category: "Profile & Customization",
    category_icon: "✏️",
    excerpt: "Set up animated typewriter headings and rotating quote lines on your profile.",
    read_time: 3,
    popular: true,
    published: true,
    content: `<h2>Typewriter Text &amp; Quotes</h2>
<p>The typewriter effect is one of the most eye-catching elements on your profile. It animates your heading and cycles through a list of custom quotes.</p>

<h3>Setting the Heading</h3>
<p>Go to <strong>Dashboard → Customize</strong>. Under <em>Typewriter Heading</em>, enter the text you want animated at the top of your profile. Keep it concise — under 40 characters works best.</p>

<h3>Adding Quotes</h3>
<p>Below the heading, you'll find the <em>Quotes</em> field. Add one quote per line. The profile will cycle through all quotes automatically.</p>

<h3>Best Practices</h3>
<ul>
  <li>Use short, punchy phrases</li>
  <li>3–5 quotes give a great rhythm</li>
  <li>Mix personal mottos, humor, and links to your work</li>
</ul>

<h3>Saving Changes</h3>
<p>Hit <em>Save</em> at the bottom of the Customize panel. Changes are reflected on your public profile instantly.</p>`,
  },
  {
    slug: "custom-links",
    title: "Managing Custom Links",
    category: "Profile & Customization",
    category_icon: "✏️",
    excerpt: "Add, edit, reorder, and delete the links that appear on your public profile.",
    read_time: 3,
    popular: true,
    published: true,
    content: `<h2>Managing Custom Links</h2>
<p>Links are the core of any bio page. redr.lol lets you add unlimited links and style them freely.</p>

<h3>Adding a Link</h3>
<ol>
  <li>Go to <strong>Dashboard → Links</strong></li>
  <li>Click <em>Add Link</em></li>
  <li>Enter the <strong>Title</strong> (displayed text) and <strong>URL</strong></li>
  <li>Click <em>Save</em></li>
</ol>

<h3>Editing a Link</h3>
<p>Click the pencil icon next to any link. Make your changes and hit <em>Save</em>.</p>

<h3>Reordering Links</h3>
<p>Drag the handle icon on the left of each link row to reorder. The order shown in the editor matches your public profile.</p>

<h3>Deleting a Link</h3>
<p>Click the trash icon next to the link and confirm the deletion. This action is irreversible.</p>

<blockquote>
  <p><strong>Tip:</strong> You can add links to any URL — social profiles, portfolios, storefronts, YouTube channels, and more.</p>
</blockquote>`,
  },
  {
    slug: "badges",
    title: "Badges — Earning &amp; Displaying",
    category: "Profile & Customization",
    category_icon: "✏️",
    excerpt: "How to earn badges and activate them on your public profile.",
    read_time: 3,
    popular: false,
    published: true,
    content: `<h2>Badges</h2>
<p>Badges are collectible profile decorations that showcase your status, milestones, and achievements on redr.lol.</p>

<h3>Viewing Your Badges</h3>
<p>Go to <strong>Dashboard → Badges</strong>. You'll see two sections: <em>Owned Badges</em> and <em>Active Badges</em>.</p>

<h3>Activating Badges</h3>
<p>Click any badge in your owned collection to toggle it active. Active badges appear on your public profile. You can have multiple badges active simultaneously.</p>

<h3>How to Earn Badges</h3>
<ul>
  <li><strong>Early Adopter</strong> — Signed up during the beta period</li>
  <li><strong>Premium</strong> — Activated a Premium subscription</li>
  <li><strong>Verified</strong> — Account has been manually verified by the redr.lol team</li>
  <li>More badges are awarded for milestones, events, and community activity</li>
</ul>

<h3>Badge Display</h3>
<p>Active badges appear near the top of your public profile card. Hovering over a badge shows its name and description.</p>`,
  },

  // ── Background & Audio ───────────────────────────────────────
  {
    slug: "uploading-a-background",
    title: "Uploading a Background Image or Video",
    category: "Background & Audio",
    category_icon: "🎨",
    excerpt: "Set a custom image or video background on your profile and configure display options.",
    read_time: 4,
    popular: true,
    published: true,
    content: `<h2>Uploading a Background</h2>
<p>A custom background transforms your profile from a plain page into an immersive experience.</p>

<h3>Supported Formats</h3>
<table>
  <thead><tr><th>Type</th><th>Formats</th><th>Max Size</th></tr></thead>
  <tbody>
    <tr><td>Image</td><td>PNG, JPEG, WebP, GIF</td><td>32 MB</td></tr>
    <tr><td>Video</td><td>MP4, WebM</td><td>128 MB</td></tr>
  </tbody>
</table>

<h3>How to Upload</h3>
<ol>
  <li>Navigate to <strong>Dashboard → Customize</strong></li>
  <li>Scroll to the <em>Background</em> section</li>
  <li>Click <em>Upload Background</em></li>
  <li>Select your file — it uploads via UploadThing and is saved to your profile</li>
</ol>

<h3>Background Audio</h3>
<p>If you upload a video background that includes audio, you can toggle <em>Background Audio</em> to let that audio play on your profile. This is separate from the music player audio tracks.</p>

<h3>Removing a Background</h3>
<p>Click <em>Remove Background</em> in the Customize panel to revert to the default dark gradient.</p>`,
  },
  {
    slug: "adding-audio-tracks",
    title: "Adding Audio Tracks",
    category: "Background & Audio",
    category_icon: "🎨",
    excerpt: "Upload up to four music tracks to power the audio player on your profile.",
    read_time: 3,
    popular: false,
    published: true,
    content: `<h2>Adding Audio Tracks</h2>
<p>redr.lol supports up to four audio tracks that visitors can listen to while browsing your profile.</p>

<h3>Uploading a Track</h3>
<ol>
  <li>Go to <strong>Dashboard → Customize</strong></li>
  <li>Scroll to the <em>Audio</em> section</li>
  <li>Click <em>Add Track</em></li>
  <li>Select an audio file (MP3, WAV, OGG — up to 32 MB)</li>
  <li>Enter a track name and hit <em>Save</em></li>
</ol>

<h3>Reordering &amp; Removing Tracks</h3>
<p>Drag tracks to reorder them. Click the trash icon to remove a track permanently.</p>

<h3>Player Settings</h3>
<ul>
  <li><strong>Enable Player</strong> — Shows/hides the audio player widget on your profile</li>
  <li><strong>Shuffle</strong> — Randomizes track order each time someone visits</li>
</ul>`,
  },

  // ── Discord Integration ──────────────────────────────────────
  {
    slug: "connecting-discord",
    title: "Connecting Your Discord Account",
    category: "Discord Integration",
    category_icon: "💬",
    excerpt: "Link your Discord account to unlock the presence card, connections, and activity on your profile.",
    read_time: 3,
    popular: true,
    published: true,
    content: `<h2>Connecting Discord</h2>
<p>Linking Discord enables several powerful features on your public profile.</p>

<h3>How to Connect</h3>
<ol>
  <li>Go to <strong>Dashboard → Home</strong></li>
  <li>Click <em>Connect Discord</em> in the Discord surface</li>
  <li>You'll be redirected to Discord's OAuth authorization page</li>
  <li>Authorize redr.lol — you'll be redirected back to your dashboard</li>
</ol>

<h3>What Gets Unlocked</h3>
<ul>
  <li><strong>Live Presence Card</strong> — Shows what you're currently doing (playing, listening, streaming) via Lanyard</li>
  <li><strong>Connection Badges</strong> — Displays your linked services (Spotify, YouTube, Twitch, etc.)</li>
  <li><strong>Profile Info</strong> — Discord avatar, banner, pronouns, and bio on your redr profile</li>
</ul>

<h3>Disconnecting Discord</h3>
<p>Go to <strong>Dashboard → Settings</strong> and click <em>Disconnect Discord</em>. This removes Discord data from your profile display.</p>

<blockquote>
  <p><strong>Note:</strong> For the live presence card to work, you need to be in the <strong>Lanyard Discord server</strong>. Join at <a href="https://discord.gg/lanyard">discord.gg/lanyard</a>.</p>
</blockquote>`,
  },
  {
    slug: "discord-presence-card",
    title: "Discord Presence Card",
    category: "Discord Integration",
    category_icon: "💬",
    excerpt: "Understand what the Discord presence card shows and how to configure its appearance.",
    read_time: 3,
    popular: false,
    published: true,
    content: `<h2>Discord Presence Card</h2>
<p>The Discord presence card is a real-time widget on your profile that shows your current Discord activity.</p>

<h3>What It Displays</h3>
<ul>
  <li>Your Discord avatar and username</li>
  <li>Online/idle/do-not-disturb/offline status</li>
  <li>Current activity (game, music, streaming, custom status)</li>
  <li>Rich presence details (song name, game name, elapsed time)</li>
</ul>

<h3>Adjusting Transparency</h3>
<p>In <strong>Dashboard → Customize</strong>, find the <em>Discord Card Transparency</em> slider. Drag it to set how transparent the card background appears (0 = opaque, 1 = fully transparent).</p>

<h3>Presence Data Source</h3>
<p>Presence data is powered by <strong>Lanyard</strong> — a WebSocket-based Discord presence API. Your redr.lol profile connects to Lanyard in real time. There is no polling delay; updates are pushed instantly.</p>

<h3>Requirements</h3>
<p>You must be a member of the Lanyard Discord server for presence to work. Join at <a href="https://discord.gg/lanyard">discord.gg/lanyard</a>.</p>`,
  },

  // ── Analytics ────────────────────────────────────────────────
  {
    slug: "understanding-your-analytics",
    title: "Understanding Your Analytics",
    category: "Analytics",
    category_icon: "📊",
    excerpt: "A breakdown of every metric in the Analytics dashboard — views, clicks, CTR, and more.",
    read_time: 4,
    popular: true,
    published: true,
    content: `<h2>Understanding Your Analytics</h2>
<p>The Analytics dashboard gives you a clear picture of how your profile is performing.</p>

<h3>Key Metrics</h3>
<table>
  <thead><tr><th>Metric</th><th>What it means</th></tr></thead>
  <tbody>
    <tr><td>Total Views</td><td>Number of times your profile page was loaded</td></tr>
    <tr><td>Profile Clicks</td><td>Clicks on your profile avatar/name</td></tr>
    <tr><td>Link Clicks</td><td>Total clicks across all your custom links</td></tr>
    <tr><td>CTR</td><td>Click-through rate (link clicks ÷ views × 100)</td></tr>
  </tbody>
</table>

<h3>12-Day Graph</h3>
<p>The line chart shows your daily views, profile clicks, and link clicks over the past 12 days. Use this to spot trends — days after posting content usually spike.</p>

<h3>Device Breakdown</h3>
<p>See the split between Desktop, Mobile, and Tablet visitors. Most creator profiles see 60–70% mobile traffic.</p>

<h3>Referrer Breakdown</h3>
<p>Referrers show where your visitors are coming from — Twitter, Instagram direct links, search engines, etc.</p>`,
  },
  {
    slug: "tracking-views-and-clicks",
    title: "How Views &amp; Clicks Are Tracked",
    category: "Analytics",
    category_icon: "📊",
    excerpt: "Technical details on how redr.lol counts profile views and link clicks.",
    read_time: 2,
    popular: false,
    published: true,
    content: `<h2>How Views &amp; Clicks Are Tracked</h2>

<h3>Profile Views</h3>
<p>A view is recorded every time someone loads your public profile page (<code>redr.lol/username</code>). The tracking is server-side, so ad-blockers don't affect it. Duplicate visits from the same IP within a short window are still counted individually.</p>

<h3>Link Clicks</h3>
<p>Each time a visitor clicks one of your custom links, a click event is sent to the analytics API. This increments your <em>Link Clicks</em> counter and updates the daily analytics row for today.</p>

<h3>Profile Clicks</h3>
<p>Profile clicks are tracked when visitors interact with the profile action button (e.g., clicking your avatar or name area).</p>

<h3>Data Freshness</h3>
<p>Analytics data updates in real time. The dashboard fetches fresh data each time you visit <strong>Dashboard → Analytics</strong>.</p>`,
  },

  // ── Premium ──────────────────────────────────────────────────
  {
    slug: "what-is-premium",
    title: "What's Included in Premium",
    category: "Premium",
    category_icon: "⭐",
    excerpt: "Everything you get with a redr.lol Premium subscription.",
    read_time: 3,
    popular: true,
    published: true,
    content: `<h2>redr.lol Premium</h2>
<p>Premium unlocks the full redr.lol experience — exclusive visual effects, priority support, and unique badges.</p>

<h3>Premium Features</h3>
<ul>
  <li>🏅 <strong>Exclusive Premium Badge</strong> — Displayed prominently on your profile</li>
  <li>🎨 <strong>Premium Themes</strong> — Access to rare visual themes not available on free accounts</li>
  <li>🎵 <strong>Extended Audio</strong> — Higher track upload limits</li>
  <li>📊 <strong>Extended Analytics</strong> — More historical data and export options</li>
  <li>⚡ <strong>Priority Support</strong> — Get help faster through the support channel</li>
  <li>✨ <strong>Early Access</strong> — Try new features before anyone else</li>
</ul>

<h3>Pricing</h3>
<p>Visit <strong>Dashboard → Premium</strong> to see current pricing and payment options.</p>`,
  },
  {
    slug: "how-to-upgrade-to-premium",
    title: "How to Upgrade to Premium",
    category: "Premium",
    category_icon: "⭐",
    excerpt: "Step-by-step guide to subscribing to redr.lol Premium.",
    read_time: 2,
    popular: false,
    published: true,
    content: `<h2>Upgrading to Premium</h2>
<ol>
  <li>Log in and go to <strong>Dashboard → Premium</strong></li>
  <li>Review the plan details and click <em>Upgrade Now</em></li>
  <li>Complete payment through the secure checkout</li>
  <li>Your account is upgraded immediately — the Premium badge appears on your profile within seconds</li>
</ol>

<h3>Cancellation</h3>
<p>You can cancel your subscription at any time from <strong>Dashboard → Settings</strong>. You'll retain Premium features until the end of your billing period.</p>

<h3>Need Help?</h3>
<p>If you have any issues with payment or activation, join our <a href="https://discord.gg/ECvnDYQQFx">Discord server</a> and open a support ticket.</p>`,
  },

  // ── Image Host ───────────────────────────────────────────────
  {
    slug: "uploading-images",
    title: "Uploading Images to the Image Host",
    category: "Image Host",
    category_icon: "🖼️",
    excerpt: "Use redr.lol's built-in image hosting to store and share images from your dashboard.",
    read_time: 3,
    popular: false,
    published: true,
    content: `<h2>Image Hosting</h2>
<p>redr.lol includes a built-in image host accessible from <strong>Dashboard → Image Host</strong>.</p>

<h3>Uploading an Image</h3>
<ol>
  <li>Go to <strong>Dashboard → Image Host</strong></li>
  <li>Click <em>Upload Image</em> or drag and drop a file</li>
  <li>Your image is uploaded and a shareable URL is generated instantly</li>
</ol>

<h3>Supported Formats</h3>
<ul>
  <li>PNG, JPEG, WebP, GIF</li>
  <li>Maximum file size: 32 MB per upload</li>
</ul>

<h3>Using Hosted Images</h3>
<p>Copy the generated URL and use it anywhere — in your profile links, as an embed in Discord, or shared on social media. Images are served through a fast CDN.</p>`,
  },

  // ── Account & Security ───────────────────────────────────────
  {
    slug: "changing-your-password",
    title: "Changing Your Password",
    category: "Account & Security",
    category_icon: "🔒",
    excerpt: "How to update your password and keep your redr.lol account secure.",
    read_time: 2,
    popular: false,
    published: true,
    content: `<h2>Changing Your Password</h2>
<ol>
  <li>Go to <strong>Dashboard → Settings</strong></li>
  <li>Scroll to the <em>Security</em> section</li>
  <li>Enter your current password and your new password</li>
  <li>Click <em>Update Password</em></li>
</ol>

<h3>Password Requirements</h3>
<ul>
  <li>Minimum 8 characters</li>
  <li>At least one uppercase letter, one number</li>
  <li>Avoid reusing recent passwords</li>
</ul>

<h3>Forgot Your Password?</h3>
<p>Password reset is currently handled through our support team. Join our <a href="https://discord.gg/ECvnDYQQFx">Discord server</a> and open a support ticket with your account email.</p>`,
  },
  {
    slug: "deleting-your-account",
    title: "Deleting Your Account",
    category: "Account & Security",
    category_icon: "🔒",
    excerpt: "How to permanently delete your redr.lol account and all associated data.",
    read_time: 2,
    popular: false,
    published: true,
    content: `<h2>Deleting Your Account</h2>
<blockquote>
  <p><strong>Warning:</strong> Account deletion is permanent and cannot be undone. All your profile data, links, analytics, uploads, and badges will be erased.</p>
</blockquote>

<h3>How to Delete</h3>
<ol>
  <li>Go to <strong>Dashboard → Settings</strong></li>
  <li>Scroll to the bottom and find the <em>Danger Zone</em> section</li>
  <li>Click <em>Delete Account</em></li>
  <li>Type your username to confirm and click <em>Permanently Delete</em></li>
</ol>

<h3>What Gets Deleted</h3>
<ul>
  <li>Your account and all profile data</li>
  <li>All custom links, badges, and settings</li>
  <li>Analytics history</li>
  <li>Uploaded background images, videos, and audio tracks</li>
</ul>

<h3>Changed Your Mind?</h3>
<p>If you just want a break, consider keeping your account — your profile can be set to private from Settings. If you still want to delete, contact us on <a href="https://discord.gg/ECvnDYQQFx">Discord</a> for assistance.</p>`,
  },
];
