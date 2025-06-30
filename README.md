# ConfessBot
Confession websites have always intrigued me. People are more honest when they’re anonymous — especially online. I wanted to reimagine that idea with a celebrity twist meaning what if you get a response from Morgan Freeman, Donald Trump, Elon Musk and other celebrities. What if users could get raw, anonymous confessions from the people they admire?

## What it does
ConfessBot lets users receive anonymous confessions through a unique link with a fun twist: it includes a Roast Mode for users who want brutally honest feedback or jokes. Whether it’s heartfelt confessions or savage roasts, ConfessBot keeps things anonymous and entertaining.

## How we built it
- **Frontend**: React + TypeScript, styled using Tailwind CSS
- **Backend**: Supabase for real-time database and anonymous data handling
- **Build Tool**: Vite for fast development
- **Deployment**: Hosted on Netlify
- **Structure**:
  - `src/components`: Reusable UI elements
  - `src/services`: Supabase integration
  - `public/`: Static assets and metadata
  - `index.html`: App shell

## Challenges we ran into
- Designing Roast Mode to be fun but not offensive
- Managing two modes with clear UI indicators and different tone
- Handling anonymous submissions without auth or abuse
- Keeping the scope tight, avoiding feature creep
- Styling interactions without overcomplicating the UX

## Accomplishments that we're proud of
- Fully working MVP with unique confession links
- Roast Mode toggle with themed styling and copy
- Clean, minimal, mobile-first design
- Built and deployed quickly with modern tools
- Realtime, anonymous data handling with no backend code

## What we learned
- Supabase is perfect for small projects and MVPs
- Tailwind speeds up styling and UI prototyping
- React + TypeScript + Vite is a dream combo for fast dev
- Anonymous features need clear UX guardrails
- Humor-based features (like Roast Mode) need tone control

## What's next for ConfessBot
- **Replies**: Let users respond to confessions/roasts anonymously
- **Moderation**: Basic filters, flag/report buttons
- **Public Feed**: A scrollable list of top roasts or confessions
- **Analytics**: Show how many confessions/roasts a user received
- **More Modes**: “Truth or Dare”, “Ask Me Anything”, “Fan Mail”, etc.

