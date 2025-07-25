# GovTech 3.0 — Blockchain & AI for Public Administration

This repository contains a bilingual (Russian / English) static website that explores how blockchain and artificial intelligence will transform public administration. It integrates up‑to‑date research on digital identity, blockchain voting, DAOs, AI regulation and ethics. The project follows a modern design system with responsive layouts, light/dark themes and a fully localised interface.

## ✨ Features

- **Bilingual Content:** All sections support Russian and English. Use the language toggle in the header to switch.
- **Modern Design:** Built with CSS custom properties, flexbox/grid layouts and a dark/light theme. A theme toggle in the header allows you to pick your preferred colour scheme.
- **Research Integration:** New sections on digital identity & elections and AI in government & ethics summarise the latest research (Estonian e‑ID adoption, blockchain voting pilots, AI regulation, etc.).
- **Improved Diagram:** The Verifiable AI diagram has been redesigned using semantic HTML and CSS for better readability and accessibility. Labels are translated via `translations.json`.
- **Reduced Navigation:** Navigation has been streamlined to eight items: Home, Technologies, Implementation, DAO & Governance, AI & Ethics, Trends, Challenges and Sources.
- **Responsive:** The layout adapts from mobile to desktop, with a collapsible hamburger menu on small screens.

## 📁 Project Structure

```
├── index.html           — main HTML page (single‑page app)
├── style.css           — styles following the design‑system guidelines
├── app.js              — client‑side logic for localisation, charts and theme toggling
├── translations.json   — Russian/English localisation strings
├── govtech_data.json   — dataset for charts (can be extended)
├── favicon.png         — site favicon
├── current_content.md  — original content snapshot (for reference)
├── research.md         — research notes integrated into the site
└── README.md           — this file
```

## 🧑‍💻 Local Development

No build step is required; everything runs in the browser. To preview locally:

1. **Clone** the repository or copy the contents to your machine.
2. **Start a local server**. You can use Python’s built‑in server:

   ```bash
   python3 -m http.server 8000
   ```

   or, if you have Node.js installed:

   ```bash
   npx http-server -p 8000
   ```

3. Open your browser at `http://localhost:8000/index.html`.

> **Note:** Opening `index.html` directly from the file system (using a `file://` URL) will not work because modern browsers restrict JavaScript `fetch()` calls for local files. Always use a local HTTP server or deploy the site to GitHub Pages.

The site will load translations from `translations.json` and dataset from `govtech_data.json`. If you add new translation keys, ensure they exist in both language objects.

## 🚀 Deployment on GitHub Pages

1. **Commit** all files to a repository on GitHub (e.g. `username/blockchain‑ai‑government`).
2. In the repository settings, navigate to **Pages** and choose the branch (e.g. `main` or `gh‑pages`) and the root folder (`/`).
3. Save—GitHub Pages will publish your site at `https://username.github.io/blockchain‑ai‑government/`.

If you prefer a separate `gh‑pages` branch, you can create one and push the contents of this project there. GitHub Pages automatically detects an `index.html` in the branch root.

## 💡 Extending the Site

- **Adding Sections:** Follow the existing markup structure. Use `data‑key` attributes on elements and define corresponding keys in both language objects in `translations.json`.
- **Adding Charts:** Place your datasets in `govtech_data.json` and extend `initCharts()` in `app.js`.
- **Customising Colours:** Tweak the CSS variables at the top of `style.css` or extend the dark‑theme declarations under `[data‑color‑scheme="dark"]`.

## 💰 Support the Project

If you find this project useful and would like to support its development, consider sending a donation to one of the following addresses (also displayed in the footer of the site):

- **Bitcoin:** `1FEvqUr9fhx9z8jZQ3ympj19QaKG4sfe1u`
- **Ethereum:** `0x6b8d7137b60a6f3ee8869dc6c53ab989937e3462`
- **USDT (TRC20):** `TBYiX5jAZ38qSHvkuyL3QMTytMf5P671VJ`

Thank you for exploring the future of public administration with blockchain and AI! Feel free to open issues or submit pull requests if you have suggestions or improvements.