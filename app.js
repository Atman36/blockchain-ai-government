// START OF FILE app.js

// Глобальные переменные для локализации и данных
// Удалены объявления интерфейсов TypeScript, так как они вызывают синтаксические ошибки в браузере.
// Все свойства будут добавлены к объекту `window` динамически.

// Инициализируем глобальные переменные
window.translations = {};
window.currentLanguage = 'ru'; // Язык по умолчанию
window.externalData = null;

// App initialization
document.addEventListener('DOMContentLoaded', async function () {
    // 1. Загружаем переводы в первую очередь
    try {
        // Compute the absolute URL to translations.json relative to the current page.
        // This fixes issues when loading from file:// or nested paths where a simple
        // relative fetch may fail. Using new URL ensures the correct resolution
        // whether the page is served over HTTP or opened directly from disk.
        const translationsUrl = new URL('translations.json', window.location.href).href;
        const response = await fetch(translationsUrl);
        // Для локальных файлов response.status может быть 0. Вместо использования response.json(),
        // считываем как текст и парсим вручную, чтобы избежать ошибок при status 0.
        const text = await response.text();
        window.translations = JSON.parse(text);
    } catch (error) {
        console.error('Fatal Error: Could not load translations.json.', error);
        // If translations cannot be loaded (e.g. due to file protocol restrictions),
        // present a simple error message. Encourage users to run a local server.
        document.body.innerHTML = '<h1 style="text-align: center; margin-top: 50px; color: red;">Error loading page content.</h1>' +
            '<p style="text-align: center; color: #b00020; font-size: 14px;">Failed to load translations. Try running a local server (e.g. python3 -m http.server) or open via HTTPS.</p>';
        return;
    }

    // 2. Инициализируем локализацию
    initLocalization();

    // 3. Остальные инициализации
    initThemeToggle();
    initNavigation();
    initMobileMenu();

    // 4. Загружаем данные для графиков
    try {
        // Similarly compute the URL for govtech_data.json to avoid errors on file:// protocol.
        const govtechUrl = new URL('govtech_data.json', window.location.href).href;
        const response = await fetch(govtechUrl);
        const text = await response.text();
        // Если файл не найден или пустой, парсинг может выбросить ошибку – отлавливаем её в catch.
        window.externalData = JSON.parse(text);
    } catch (error) {
        console.warn('Could not load govtech_data.json, falling back to hard-coded datasets', error);
        window.externalData = null;
    }

    // 5. Заполняем таблицы данными
    populateFallbackTables();
    
    // 6. Инициализируем графики (или показываем запасной вариант)
    if (typeof Chart !== 'undefined') {
        initCharts();
    } else {
        console.error('Chart.js не доступен, показываем запасной вариант');
        showChartFallbacks();
    }
    
    // 7. Принудительно показываем таблицы, так как с графиками могут быть проблемы.
    // Это надежное решение, чтобы клиент всегда видел данные.
    // Небольшая задержка для завершения всех рендерингов
    setTimeout(() => {
        showChartFallbacks();
        populateFallbackTables();
    }, 200);

    // 8. Инициализируем аккордеоны для скрываемых разделов
    initAccordion();
});


// --- Localization Functions ---

function initLocalization() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.slice(0, 2);
    const initialLang = savedLang || (window.translations[browserLang] ? browserLang : 'ru');

    langButtons.forEach(button => {
        // Используем currentTarget и getAttribute, чтобы избежать проблемы, когда e.target
        // может быть вложенным элементом. Это гарантирует корректное чтение атрибута data-lang.
        button.addEventListener('click', (e) => {
            const targetButton = e.currentTarget;
            const langAttr = targetButton.getAttribute('data-lang');
            setLanguage(langAttr);
        });
    });

    setLanguage(initialLang, true); // true, чтобы избежать лишнего обновления графиков
}

function setLanguage(lang, isInitial = false) {
    if (!lang || !window.translations[lang]) {
        lang = 'ru';
    }

    window.currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;

    const translations = window.translations[lang];
    if (!translations) {
        console.error(`Translations for language ${lang} not found!`);
        return;
    }
    
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        if (translations[key] !== undefined) {
            el.innerHTML = translations[key];
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Обновляем графики только при смене языка, а не при первоначальной загрузке
    if (!isInitial && typeof Chart !== 'undefined') {
        updateChartsLanguage();
    }

    // Обновляем таблицы при смене языка
    if (!isInitial) {
        populateFallbackTables();
    }
}

function updateChartsLanguage() {
    const lang = window.currentLanguage;
    const translations = window.translations[lang];
    if (!translations) return;

    // Обновляем adoptionChart
    if (window.adoptionChart) {
        const chart = window.adoptionChart;
        const adoptionData = getAdoptionData();
        chart.options.plugins.title.text = translations.adoptionChartTitle;
        chart.data.labels = adoptionData.country_keys.map(key => translations.countries[key]);
        chart.data.datasets[0].label = translations.adoptionChartFallbackBlockchain;
        chart.data.datasets[1].label = translations.adoptionChartFallbackAI;
        chart.data.datasets[2].label = translations.adoptionChartFallbackDigital;
        chart.data.datasets[3].label = translations.adoptionChartFallbackInvest;
        chart.options.scales.y.title.text = translations.adoptionChartFallbackBlockchain;
        chart.options.scales.y1.title.text = translations.adoptionChartFallbackInvest;
        chart.update();
    }

    // Обновляем benefitsChart
    if (window.benefitsChart) {
        const chart = window.benefitsChart;
        chart.options.plugins.title.text = translations.benefitsChartTitle;
        chart.data.labels = [
            translations.benefitsChartLabel1,
            translations.benefitsChartLabel2,
            translations.benefitsChartLabel3,
            translations.benefitsChartLabel4,
            translations.benefitsChartLabel5
        ];
        chart.data.datasets[0].label = translations.benefitsChartY1;
        chart.data.datasets[1].label = translations.benefitsChartY2;
        chart.options.scales.y.title.text = translations.benefitsChartY1;
        chart.options.scales.y1.title.text = translations.benefitsChartY2;
        chart.update();
    }

    // Обновляем daoTreasuryChart
    if (window.daoTreasuryChart) {
        const chart = window.daoTreasuryChart;
        chart.options.plugins.title.text = translations.daoTreasuryChartTitle;
        chart.data.labels = [translations.daoTreasuryChartLabelTop100, translations.daoTreasuryChartLabelOther];
        chart.update();
    }
}


// --- Chart Functions (Modified for Localization) ---

function initCharts() {
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.font.size = 12;

    setTimeout(() => {
        try {
            createAdoptionChart();
            createBenefitsChart();
            createDaoTreasuryChart();
        } catch (error) {
            console.error('Error in chart initialization:', error);
            showChartFallbacks();
        }
    }, 50);
}

function getAdoptionData() {
    // Используем ключи для последующего перевода
    return (window.externalData && window.externalData.adoption_data) ? window.externalData.adoption_data : {
        country_keys: ["estonia", "singapore", "dubai", "uk", "china", "india", "australia", "switzerland", "usa", "russia"],
        blockchain_adoption: [85, 75, 70, 45, 60, 40, 25, 40, 55, 45],
        ai_in_gov: [80, 90, 75, 65, 85, 55, 35, 50, 92, 75],
        digital_services: [99, 95, 80, 85, 75, 65, 60, 65, 85, 88],
        investments: [0.3, 12.0, 8.5, 4.2, 30.0, 30.0, 2.1, 1.8, 1800.0, null]
    };
}

function createAdoptionChart() {
    const ctx = document.getElementById('adoptionChart');
    if (!ctx) return;

    const colors = getChartColors();
    const translations = window.translations[window.currentLanguage];
    const adoptionData = getAdoptionData();

    window.adoptionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: adoptionData.country_keys.map(key => translations.countries[key]),
            datasets: [
                { label: translations.adoptionChartFallbackBlockchain, data: adoptionData.blockchain_adoption, backgroundColor: colors.chart1, yAxisID: 'y' },
                { label: translations.adoptionChartFallbackAI, data: adoptionData.ai_in_gov, backgroundColor: colors.chart2, yAxisID: 'y' },
                { label: translations.adoptionChartFallbackDigital, data: adoptionData.digital_services, backgroundColor: colors.chart3, yAxisID: 'y' },
                { label: translations.adoptionChartFallbackInvest, data: adoptionData.investments, backgroundColor: colors.chart4, type: 'line', yAxisID: 'y1', pointRadius: 6 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: colors.textColor, padding: 20 } },
                title: { display: true, text: translations.adoptionChartTitle, color: colors.textColor, font: { size: 14, weight: 'bold' } }
            },
            scales: {
                y: { beginAtZero: true, max: 100, position: 'left', ticks: { color: colors.secondaryColor }, grid: { color: colors.borderColor }, title: { display: true, text: translations.adoptionChartFallbackBlockchain, color: colors.textColor } },
                y1: { beginAtZero: true, position: 'right', ticks: { color: colors.secondaryColor }, grid: { drawOnChartArea: false }, title: { display: true, text: translations.adoptionChartFallbackInvest, color: colors.textColor } },
                x: { ticks: { color: colors.secondaryColor }, grid: { color: colors.borderColor } }
            }
        }
    });
}

function createBenefitsChart() {
    const ctx = document.getElementById('benefitsChart');
    if (!ctx) return;

    const colors = getChartColors();
    const translations = window.translations[window.currentLanguage];

    window.benefitsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                translations.benefitsChartLabel1, translations.benefitsChartLabel2, translations.benefitsChartLabel3,
                translations.benefitsChartLabel4, translations.benefitsChartLabel5
            ],
            datasets: [
                { label: translations.benefitsChartY1, data: [70, 80, 90, 85, 80], backgroundColor: colors.chart1, yAxisID: 'y' },
                { label: translations.benefitsChartY2, data: [15.0, 2.3, 1.8, 3.2, 4.5], backgroundColor: colors.chart2, yAxisID: 'y1' }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: colors.textColor, padding: 20 } },
                title: { display: true, text: translations.benefitsChartTitle, color: colors.textColor, font: { size: 14, weight: 'bold' } }
            },
            scales: {
                x: { ticks: { color: colors.secondaryColor }, grid: { color: colors.borderColor } },
                y: { type: 'linear', display: true, position: 'left', title: { display: true, text: translations.benefitsChartY1, color: colors.textColor }, ticks: { color: colors.secondaryColor }, grid: { color: colors.borderColor } },
                y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: translations.benefitsChartY2, color: colors.textColor }, ticks: { color: colors.secondaryColor }, grid: { drawOnChartArea: false } }
            }
        }
    });
}

function createDaoTreasuryChart() {
    const ctx = document.getElementById('daoTreasury');
    if (!ctx) return;

    const colors = getChartColors();
    const translations = window.translations[window.currentLanguage];

    window.daoTreasuryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [translations.daoTreasuryChartLabelTop100, translations.daoTreasuryChartLabelOther],
            datasets: [{ data: [18700, 22000], backgroundColor: [colors.chart1, colors.chart2], borderWidth: 1 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: colors.textColor, padding: 20 } },
                title: { display: true, text: translations.daoTreasuryChartTitle, color: colors.textColor, font: { size: 14, weight: 'bold' } }
            },
            cutout: '60%'
        }
    });
}


// --- Unchanged Functions (Theme, Navigation, etc.) ---

/**
 * Принудительно показывает все таблицы-фоллбэки и скрывает канвасы графиков.
 * Это надежный способ отобразить данные, если с Chart.js есть проблемы.
 */
function showChartFallbacks() {
    document.querySelectorAll('.chart-container').forEach(container => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }

        // Try to find a fallback table: it might be a sibling of the container or
        // nested elsewhere in the parent section. First check the next sibling.
        let fallback = container.nextElementSibling;
        if (!(fallback && fallback.classList && fallback.classList.contains('chart-fallback'))) {
            // If not a direct sibling, search within the parent section
            fallback = container.parentElement.querySelector('.chart-fallback');
        }
        if (fallback) {
            fallback.style.display = 'block';
            fallback.style.visibility = 'visible';
            fallback.style.opacity = '1';
        }
    });
}

/**
 * Заполняет все таблицы-фоллбэки данными.
 * Функция централизована для всех таблиц.
 */
function populateFallbackTables() {
    const translations = window.translations[window.currentLanguage];
    if (!translations || !translations.countries) {
        // Если переводы еще не загрузились, попробуем позже
        setTimeout(populateFallbackTables, 100);
        return;
    }

    // Заполняем таблицу adoptionChart
    const adoptionTable = document.querySelector('#adoptionChart + .chart-fallback tbody');
    if (adoptionTable) {
        const adoptionData = getAdoptionData();
        adoptionTable.innerHTML = ''; // Очищаем перед заполнением

        adoptionData.country_keys.forEach((countryKey, index) => {
            const row = document.createElement('tr');
            // Определяем единицу измерения для инвестиций в зависимости от выбранного языка
            const investUnit = window.currentLanguage === 'ru' ? 'млрд' : 'B';
            const investValue = adoptionData.investments[index];
            const investFormatted = investValue !== null
                ? `${investValue}\u00A0${investUnit}`
                : 'N/A';
            row.innerHTML = `
                <td>${translations.countries[countryKey] || countryKey}</td>
                <td>${adoptionData.blockchain_adoption[index]}%</td>
                <td>${adoptionData.ai_in_gov[index]}%</td>
                <td>${adoptionData.digital_services[index]}%</td>
                <td>${investFormatted}</td>
            `;
            adoptionTable.appendChild(row);
        });
    }

    // Заполняем таблицу benefitsChart
    const benefitsTable = document.querySelector('#benefitsChart + .chart-fallback tbody');
    if (benefitsTable) {
        const benefitsLabels = [
            translations.benefitsChartLabel1,
            translations.benefitsChartLabel2,
            translations.benefitsChartLabel3,
            translations.benefitsChartLabel4,
            translations.benefitsChartLabel5
        ];
        const timeSavings = [70, 80, 90, 85, 80];
        const costSavings = [15.0, 2.3, 1.8, 3.2, 4.5];

        benefitsTable.innerHTML = ''; // Очищаем перед заполнением

        benefitsLabels.forEach((label, index) => {
            const row = document.createElement('tr');
            // Единица измерения для экономии средств
            const costUnit = window.currentLanguage === 'ru' ? 'млрд' : 'B';
            const costFormatted = `$${costSavings[index]}\u00A0${costUnit}`;
            row.innerHTML = `
                <td>${label}</td>
                <td>${timeSavings[index]}%</td>
                <td>${costFormatted}</td>
            `;
            benefitsTable.appendChild(row);
        });
    }

    // Заполняем таблицу daoTreasury
    (function() {
        const daoCanvas = document.getElementById('daoTreasury');
        if (!daoCanvas) return;
        // Находим таблицу-фоллбэк, используя ближайшую секцию или соседа
        let daoSection = daoCanvas.closest('.dao-treasury-section');
        let daoTable;
        if (daoSection) {
            const fallbackDiv = daoSection.querySelector('.chart-fallback');
            if (fallbackDiv) {
                daoTable = fallbackDiv.querySelector('tbody');
            }
        }
        // Резервный поиск: ищем первый фоллбэк после контейнера канваса
        if (!daoTable) {
            const containerDiv = daoCanvas.parentElement;
            let next = containerDiv.nextElementSibling;
            while (next && !next.classList.contains('chart-fallback')) {
                next = next.nextElementSibling;
            }
            if (next) {
                daoTable = next.querySelector('tbody');
            }
        }
        if (!daoTable) return;
        const daoData = {
            labels: [translations.daoTreasuryChartLabelTop100, translations.daoTreasuryChartLabelOther],
            values: [18700, 22000]
        };
        daoTable.innerHTML = '';
        daoData.labels.forEach((label, index) => {
            const row = document.createElement('tr');
            const daoUnit = window.currentLanguage === 'ru' ? 'млн' : 'M';
            const valueFormatted = `${daoData.values[index]}\u00A0${daoUnit}\u00A0$`;
            row.innerHTML = `
                <td>${label}</td>
                <td>${valueFormatted}</td>
            `;
            daoTable.appendChild(row);
        });
    })();
}

function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-color-scheme') === 'dark';
    return {
        textColor: isDark ? 'oklch(0.9288 0.0126 255.5078)' : 'oklch(0.2795 0.0368 260.0310)',
        secondaryColor: isDark ? 'oklch(0.7137 0.0192 261.3246)' : 'oklch(0.5510 0.0234 264.3637)',
        borderColor: isDark ? 'oklch(0.4461 0.0263 256.8018 / 0.3)' : 'oklch(0.8717 0.0093 258.3382 / 0.2)',
        chart1: 'oklch(0.5854 0.2041 277.1173)',
        chart2: 'oklch(0.5106 0.2301 276.9656)',
        chart3: 'oklch(0.4568 0.2146 277.0229)',
        chart4: 'oklch(0.3984 0.1773 277.3662)',
        chart5: 'oklch(0.3588 0.1354 278.6973)'
    };
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);
    updateThemeIcon(initialTheme);

    // Handle user click to toggle theme
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            updateChartsTheme();
        });
    }

    // Listen to system preference changes only when user hasn't chosen a theme
    if (!savedTheme) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
            updateThemeIcon(newTheme);
            setTimeout(() => updateChartsTheme(), 100);
        });
    }
}

// Update the icon on the theme toggle button based on the current theme
function updateThemeIcon(theme) {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    // Use a sun icon for light mode and a moon icon for dark mode
    btn.textContent = theme === 'dark' ? '🌙' : '☀️';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
}

function updateChartsTheme() {
    const colors = getChartColors();
    const charts = [window.adoptionChart, window.benefitsChart, window.daoTreasuryChart];
    charts.forEach(chart => {
        if (chart) {
            chart.options.plugins.legend.labels.color = colors.textColor;
            chart.options.plugins.title.color = colors.textColor;
            Object.keys(chart.options.scales).forEach(scaleKey => {
                const scale = chart.options.scales[scaleKey];
                if (scale.ticks) scale.ticks.color = colors.secondaryColor;
                if (scale.grid) scale.grid.color = colors.borderColor;
                if (scale.title) scale.title.color = colors.textColor;
            });
            chart.update();
        }
    });
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    // Кнопка закрытия мобильного меню
    const mobileNavClose = document.getElementById('mobileNavClose');

    if (hamburgerMenu && mobileNav) {
        // Переключение открытия/закрытия при клике на бургер
        hamburgerMenu.addEventListener('click', function () {
            hamburgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Закрываем меню при клике по любой ссылке внутри
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Закрываем меню при клике на кнопку закрытия
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', function () {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        }
    }
}

/**
 * Инициализирует аккордеоны: при клике на заголовок переключает видимость содержимого.
 */
function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            const content = this.nextElementSibling;
            if (content) {
                content.hidden = expanded;
            }
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}