# GovTech 3.0 — Blockchain & AI for Public Administration / Блокчейн и ИИ для государства

## About / О проекте

This repository contains a single–page, bilingual website exploring how **blockchain**, **decentralised autonomous organisations (DAOs)** and **artificial intelligence** can reshape the institutions of government.  The content synthesises research on digital identity, tokenised voting, legal wrappers for DAOs, ethics and regulation of AI, and presents it in an accessible, scrollable narrative.

В этом репозитории лежит одностраничный двуязычный сайт, посвящённый тому, как **блокчейн**, **децентрализованные автономные организации (DAO)** и **искусственный интеллект** могут изменить институты государства.  Сайт обобщает исследования о цифровой идентификации, токенизированном голосовании, юридических оболочках для DAO, регулировании и этике ИИ и представляет их в удобном виде.

### Key Features / Основные разделы

* **Overview & Big Picture.**  An opening section asks whether DAOs and AI will replace the nation–state or augment it, summarising the drivers of change and why modern governance needs an upgrade.
* **Harsh Reality of DAO & Problems vs. Solutions.**  An accordion summarises concentration of power, low participation and legal uncertainties in DAOs, paired with design strategies like democratic governance, legal wrappers, incentives and agile adjustments.
* **AI Governance & Ethics.**  A dedicated section summarises the potential of AI for public services (automation, predictive analysis, better service delivery) and the associated risks (bias, opacity), with a call for verifiable AI and human oversight.
* **Practical Applications in Government.**  Three columns map blockchain and AI use cases to the executive, legislative and judicial branches: self–sovereign identity, asset registries, voting and treasury management, verifiable AI for lawmaking, evidence management and smart courts.
* **Roadmap & Recommendations.**  A roadmap lists actionable steps, such as passing DAO legislation, piloting blockchain identity, enforcing AI audits and investing in education, providing a to‑do list for policymakers.
* **Bilingual & Theme toggle.**  All headings, paragraphs and list items have `data‑key` attributes.  The texts are defined in `translations.json` for Russian and English.  A language switch and a light/dark theme switch are in the header.
* **Responsive design.**  Built mobile‑first, the layout uses CSS custom properties, flexbox and grid.  It adapts to screens from phones to wide desktops, with the navigation collapsing into a hamburger menu on small devices.
* **Interactive charts.**  The site uses Chart.js to visualise adoption trends for blockchain, AI, digital services and government investments.  Data lives in `govtech_data.json` and can be extended.

### Project Structure / Структура проекта

```
├── index.html           — main HTML (single‑page application) / главный HTML файл (SPA)
├── style.css            — styles following the design‑system guidelines / стили в соответствии с дизайн‑системой
├── app.js               — client‑side logic: localisation, charts, theme toggles / клиентская логика
├── translations.json    — localisation strings for RU and EN / переводы на русский и английский
├── govtech_data.json    — dataset for charts / данные для диаграмм
├── recommendations.md   — AI‑generated recommendations used for new sections / рекомендации
└── README.md            — this document / этот файл
```

### Running Locally / Локальный запуск

1. **Clone or download** this repository to your computer.
2. **Start a local server**.  Do **not** open `index.html` directly with a `file://` URL, because browsers block `fetch()` on local files.  Instead run:

   ```bash
   python3 -m http.server 8000
   ```

   or, if Node.js is available:

   ```bash
   npx http-server -p 8000
   ```

3. **Open your browser** at <http://localhost:8000/index.html>.

4. **Switch languages and theme** using the toggles in the header.  The content will update on the fly based on `translations.json`.

1. **Склонируйте или скачайте** репозиторий на свой компьютер.
2. **Запустите локальный сервер**.  Не открывайте `index.html` напрямую через `file://`: браузеры блокируют `fetch()` для локальных файлов.  Вместо этого выполните:

   ```bash
   python3 -m http.server 8000
   ```

   либо при наличии Node.js:

   ```bash
   npx http-server -p 8000
   ```

3. **Откройте браузер** по адресу <http://localhost:8000/index.html>.
4. **Переключайте язык и тему** с помощью переключателей в шапке.  Содержимое автоматически подгружается из `translations.json`.

### Deployment on GitHub Pages / Публикация на GitHub Pages

1. Commit all files to a GitHub repository (e.g. `username/govtech-3.0`).
2. In repository settings, open **Pages** and choose the branch (e.g. `main` or `gh‑pages`) and folder (`/`).
3. Save the settings.  GitHub Pages will publish the site at `https://username.github.io/repo-name/`.
4. For a separate `gh‑pages` branch, create the branch and push the contents there.  GitHub will auto‑detect `index.html` at root.

1. Зафиксируйте все файлы в репозитории GitHub (например, `username/govtech-3.0`).
2. В настройках репозитория зайдите в раздел **Pages** и выберите ветку (`main` или `gh‑pages`) и папку (`/`).
3. Сохраните — GitHub опубликует сайт по адресу `https://username.github.io/имя-репозитория/`.
4. Если нужен отдельный бранч `gh‑pages`, создайте его и залейте туда содержимое проекта.  GitHub автоматически найдёт `index.html` в корне.

### Extending the Site / Как расширять

* **Adding content:**  Follow the existing semantic markup.  Use `data‑key` on each element and define corresponding strings in both languages inside `translations.json`.  For long paragraphs, consider using accordions or pop‑ups for better readability.
* **Adding charts:**  Append new fields to `govtech_data.json` and modify the `initCharts()` function in `app.js`.  Use Chart.js only; do not hard‑code colours.  Charts should always have titles and axis labels for accessibility.
* **Customising design:**  Adjust the CSS variables at the top of `style.css` to tweak colours and spacing.  The design system guidelines are documented in `design-system-css.md`.

### Contributing / Вклад

Pull requests and issues are welcome.  If you discover bugs, translation errors or have ideas for new sections, feel free to open an issue or a PR.  When adding features, please keep both languages in sync and adhere to the design system.

**Спасибо / Thank you** for exploring the future of governance!  May this project inspire informed discussions on how technology can serve society.