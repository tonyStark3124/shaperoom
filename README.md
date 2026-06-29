# Shaperoom 🏋️

Workout builder app — create custom interval training sessions (exercise / rest cycles) and run them in real time.

> Originally built as a web app. Next step: add an AI agent that builds the workout for you based on a natural language request.

## What it does

- Build a custom workout: pick exercises, set duration per exercise, set rest time
- Run the workout with a live timer — alternates between exercise and rest
- Auth via Firebase (login / signup / password reset)
- Hebrew and English UI (language toggle)

## Planned

- [ ] AI agent: describe your goal ("20 min full body, no equipment") → get a generated workout
- [ ] Save and reuse workout templates
- [ ] Mobile app version

## Tech

| | |
|---|---|
| Framework | React + Vite |
| Auth | Firebase |
| Styling | CSS |
| Deploy | Netlify |
| Languages | Hebrew / English |

## Run it

```bash
cd my-fitness-app
npm install
npm run dev
```

