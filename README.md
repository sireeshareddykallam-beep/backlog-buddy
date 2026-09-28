# Backlog Buddy

A dependency-free, responsive working UI prototype for an engineering backlog preparation platform.

## Live deployments

- Vercel: https://backlog-buddy.vercel.app
- Render: https://backlog-buddy-kc5k.onrender.com
- Repository: https://github.com/sireeshareddykallam-beep/backlog-buddy

## Run

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Open `http://localhost:4173`.

## Included

- Responsive homepage and guided 7-step subject finder
- Subject catalog, course view and detailed subject page
- Filterable previous-paper library with licensing notice
- Interactive MCQ practice with explanations/progress
- Study-plan generator using exam date, subject count and daily hours
- Student dashboard, search, dark mode and admin UI
- Scalable normalized PostgreSQL schema (`schema.sql`)
- Sample content for DBMS, OS, Computer Networks, DSA, Mathematics and more

## Production integration

The prototype uses local in-browser sample data. To launch, connect it to an authenticated backend (Supabase/PostgreSQL, Firebase, or a custom API), object storage for authorized resources, and role-based admin access.

No API key is needed to preview this prototype. For production, provide your chosen backend's public URL/key and storage configuration through environment variables—never hard-code service-role secrets in browser code.
