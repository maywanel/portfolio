# Mohamed El Messaadi · Portfolio

A responsive single-page portfolio for Mohamed El Messaadi featuring a Spring Boot backend, dynamically loaded projects, light/dark themes, and polished UI components.

## Getting Started

Run the backend and it will serve the portfolio UI and APIs from the same origin:

```bash
cd backend
./mvnw spring-boot:run
```

Once the server starts, visit <http://localhost:8080/> for the main site or <http://localhost:8080/contacts.html> for the inbox view.

## Highlights

- Animated hero background powered by Three.js with graceful reduced-motion fallback.
- Spring Boot backend proxies GitHub to serve curated repositories and accepts contact form submissions.
- Contact form with server-side validation and in-memory message queue ready for email/SaaS integration.
- Accessible, responsive layout with light/dark theme toggle and reduced-motion support.
- Modular structure with separate CSS and JavaScript files for easy customization.
- Editable fallback project data to personalize featured work.

## Backend Setup (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

The custom `mvnw` script bundles Maven 3.9.6 locally on first run (no system Maven required). Set `PORTFOLIO_USE_SYSTEM_MAVEN=1` to use an existing installation instead. The API listens on `http://localhost:8080` by default and exposes:

- `GET /api/projects` — Returns cached GitHub repositories (fallbacks if GitHub is unreachable).
- `POST /api/contact` — Accepts `{ name, email, message }` JSON payloads and stores them in memory.
- `GET /api/contact` — Lists in-memory contact submissions captured since the backend started.

Messages are kept in memory only; wire up your preferred email/SaaS provider inside `ContactService` for persistence or notifications.

## Frontend Setup

If you prefer to decouple the frontend for development, you can still serve `backend/src/main/resources/static` with any static file server. When the frontend runs on a different port from the backend, the script automatically targets `http://localhost:8080`; override this by setting `window.PORTFOLIO_API_BASE` or `data-api-base` on the `<html>` element.

### Contact Inbox

- Guard the backend and this page behind proper auth before deploying.
- With the backend running, open <http://localhost:8080/contacts.html> to view submissions in a sortable table.

## Customization Tips

- Update fallback project cards in `index.html` (`data-fallback` attribute) to highlight specific repositories.
- Replace the contact email, social links, and experience timeline with your latest details.
- Tweak the visual design via `styles/main.css`; key theme variables live at the top of the file.
- Adjust backend behavior through `backend/src/main/resources/application.yaml` (GitHub username, cache TTL, fallback data path).
