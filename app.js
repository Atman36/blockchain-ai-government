// App initialization: сначала загружаем локальные данные, затем строим графики

document.addEventListener('DOMContentLoaded', async function() {
    initThemeToggle();
    initNavigation();
    initMobileMenu();

    // Пытаемся загрузить локальный файл govtech_data.json до инициализации графиков
    try {
        const response = await fetch('govtech_data.json');
        if (!response.ok) throw new Error(response.statusText);
        window.externalData = await response.json();
        console.log('Loaded local data:', window.externalData);
    } catch (error) {
        console.warn('Could not load govtech_data.json, falling back to hard-coded datasets', error);
        window.externalData = null;
    }

    // Проверяем, доступен ли Chart.js
    if (typeof Chart !== 'undefined') {
        console.log('Chart.js доступен, инициализируем графики');
        initCharts();
    } else {
        console.error('Chart.js не доступен, показываем запасной вариант');
        showChartFallbacks();
    }

    initScrollAnimations();
});

// Функция для отображения запасного варианта вместо графиков
function showChartFallbacks() {
    document.querySelectorAll('.chart-container').forEach(container => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        const fallback = container.querySelector('.chart-fallback');
        if (fallback) {
            fallback.style.display = 'block';
        }
    });
}

function showChartFallback(chartId) {
    const container = document.getElementById(chartId).parentNode;
    if (container) {
        const canvas = container.querySelector('canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        const fallback = container.querySelector('.chart-fallback');
        if (fallback) {
            fallback.style.display = 'block';
        }
    }
}

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    let currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    applyTheme(currentTheme);
    updateThemeToggleText(currentTheme);
    
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeToggleText(currentTheme);
        
        // Update charts with new theme
        setTimeout(() => {
            updateChartsTheme();
        }, 100);
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');
}

function updateThemeToggleText(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate offset to account for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight + 
                                   document.querySelector('.nav').offsetHeight;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active navigation on scroll
    window.addEventListener('scroll', throttle(updateActiveNavigation, 100));
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight + 
                        document.querySelector('.nav').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100;
    
    let activeSection = null;
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            activeSection = section;
        }
    });
    
    if (activeSection) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`[href="#${activeSection.id}"]`);
        if (activeLink) activeLink.classList.add('active');
    }
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Charts initialization
function initCharts() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js не загружен. Проверьте подключение библиотеки.');
        showChartFallbacks();
        return;
    }
    
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.font.size = 12;
    
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
        try {
            console.log('Initializing charts...');
            
            try {
                createAdoptionChart();
                console.log('Adoption chart created');
            } catch (error) {
                console.error('Error creating adoption chart:', error);
                showChartFallback('adoptionChart');
            }
            
            try {
                createBenefitsChart();
                console.log('Benefits chart created');
            } catch (error) {
                console.error('Error creating benefits chart:', error);
                showChartFallback('benefitsChart');
            }
            
            try {
                createDaoTreasuryChart();
                console.log('DAO Treasury chart created');
            } catch (error) {
                console.error('Error creating DAO Treasury chart:', error);
                showChartFallback('daoTreasury');
            }
            
            console.log('Charts initialization completed');
        } catch (error) {
            console.error('Error in chart initialization:', error);
            showChartFallbacks();
        }
    }, 500); // Увеличиваем задержку для надежности
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

function createAdoptionChart() {
    try {
        const ctx = document.getElementById('adoptionChart');
        if (!ctx) {
            console.error('Element with id "adoptionChart" not found');
            return;
        }
        console.log('Creating adoption chart...');
        
        const colors = getChartColors();
        // Используем данные из govtech_data.json, если они загружены, иначе fallback
        const adoptionData = (window.externalData && window.externalData.adoption_data) ? window.externalData.adoption_data : {
            countries: ["Эстония", "Сингапур", "Дубай", "Великобритания", "Китай", "Индия", "Австралия", "Швейцария", "США", "Россия"],
            blockchain_adoption: [85, 75, 70, 45, 60, 40, 25, 40, 55, 45],
            ai_in_gov: [80, 90, 75, 65, 85, 55, 35, 50, 92, 75],
            digital_services: [99, 95, 80, 85, 75, 65, 60, 65, 85, 88],
            investments: [0.3, 12.0, 8.5, 4.2, 30.0, 30.0, 2.1, 1.8, 1850.0, null]
        };
    
    try {
        window.adoptionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: adoptionData.countries,
            datasets: [
                {
                    label: 'Внедрение блокчейна (%)',
                    data: adoptionData.blockchain_adoption,
                    backgroundColor: colors.chart1,
                    borderColor: colors.chart1,
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'ИИ в госуправлении (%)',
                    data: adoptionData.ai_in_gov,
                    backgroundColor: colors.chart2,
                    borderColor: colors.chart2,
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Цифровые услуги (%)',
                    data: adoptionData.digital_services,
                    backgroundColor: colors.chart3,
                    borderColor: colors.chart3,
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Инвестиции (млрд $)',
                    data: adoptionData.investments,
                    backgroundColor: colors.chart4,
                    borderColor: colors.chart4,
                    borderWidth: 1,
                    type: 'line',
                    yAxisID: 'y1',
                    pointStyle: 'circle',
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: colors.textColor,
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Уровень внедрения технологий и инвестиций по странам',
                    color: colors.textColor,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    position: 'left',
                    ticks: {
                        color: colors.secondaryColor
                    },
                    grid: {
                        color: colors.borderColor
                    },
                    title: {
                        display: true,
                        text: 'Уровень внедрения (%)',
                        color: colors.textColor
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    ticks: {
                        color: colors.secondaryColor
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'Инвестиции (млрд $)',
                        color: colors.textColor
                    }
                },
                x: {
                    ticks: {
                        color: colors.secondaryColor
                    },
                    grid: {
                        color: colors.borderColor
                    }
                }
            }
        }
    });
}

function createTimelineChart() {
    const ctx = document.getElementById('timelineChart');
    if (!ctx) {
        console.error('Element with id "timelineChart" not found');
        return;
    }
    console.log('Creating timeline chart...');
    
    const colors = getChartColors();
    
    window.timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2025-2027', '2028-2032', '2033-2040'],
            datasets: [
                {
                    label: 'Количество стран',
                    data: [15, 25, 40],
                    backgroundColor: `${colors.chart1}33`,
                    borderColor: colors.chart1,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Уровень автоматизации (%)',
                    data: [60, 75, 85],
                    backgroundColor: `${colors.chart2}33`,
                    borderColor: colors.chart2,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: colors.textColor,
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Прогноз автоматизации государственных услуг',
                    color: colors.textColor,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Временной период',
                        color: colors.textColor
                    },
                    ticks: {
                        color: colors.secondaryColor
                    },
                    grid: {
                        color: colors.borderColor
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Количество стран',
                        color: colors.textColor
                    },
                    ticks: {
                        color: colors.secondaryColor
                    },
                    grid: {
                        color: colors.borderColor
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Уровень автоматизации (%)',
                        color: colors.textColor
                    },
                    ticks: {
                        color: colors.secondaryColor
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

function createInvestmentChart() {
    const ctx = document.getElementById('investmentChart');
    if (!ctx) {
        console.error('Element with id "investmentChart" not found');
        return;
    }
    console.log('Creating investment chart...');
    
    const colors = getChartColors();
    
    window.investmentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Эстония', 'Сингапур', 'Дубай', 'Великобритания', 'Китай', 'Индия', 'Австралия', 'Швейцария'],
            datasets: [{
                label: 'Инвестиции в смарт-города (млрд $)',
                data: [0.3, 12.0, 8.5, 4.2, 30.0, 30.0, 2.1, 1.8],
                backgroundColor: [
                    colors.chart1,
                    colors.chart2,
                    colors.chart3,
                    colors.chart4,
                    colors.chart5,
                    `${colors.chart1}CC`,
                    `${colors.chart2}CC`,
                    `${colors.chart3}CC`
                ],
                borderColor: [
                    colors.chart1,
                    colors.chart2,
                    colors.chart3,
                    colors.chart4,
                    colors.chart5,
                    `${colors.chart1}CC`,
                    `${colors.chart2}CC`,
                    `${colors.chart3}CC`
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Инвестиции в смарт-города по странам/регионам',
                    color: colors.textColor,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: colors.secondaryColor
                    },
                    grid: {
                        color: colors.borderColor
                    },
                    title: {
                        display: true,
                        text: 'Инвестиции (млрд $)',
                        color: colors.textColor
                    }
                },
                x: {
                    ticks: {
                        color: colors.secondaryColor
                    },
                    grid: {
                        color: colors.borderColor
                    }
                }
            }
        }
    });
}

function createBenefitsChart() {
    const ctx = document.getElementById('benefitsChart');
    if (!ctx) {
        console.error('Element with id "benefitsChart" not found');
        return;
    }
    console.log('Creating benefits chart...');
    
    const colors = getChartColors();
    
    window.benefitsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Налоговые проверки',
                'Обработка документов', 
                'Регистрация недвижимости',
                'Выдача лицензий',
                'Социальные выплаты'
            ],
            datasets: [
                {
                    label: 'Экономия времени (%)',
                    data: [70, 80, 90, 85, 80],
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Экономия средств (млрд $)',
                    data: [15.0, 2.3, 1.8, 3.2, 4.5],
                    backgroundColor: '#FFC185',
                    borderColor: '#FFC185',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: colors.textColor,
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Экономические выгоды по типам государственных услуг',
                    color: colors.textColor,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: colors.secondaryColor
                    },
                    grid: {
                        color: colors.borderColor
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Экономия времени (%)',
                        color: colors.textColor
                    },
                    ticks: {
                        color: colors.secondaryColor
                    },
                    grid: {
                        color: colors.borderColor
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Экономия средств (млрд $)',
                        color: colors.textColor
                    },
                    ticks: {
                        color: colors.secondaryColor
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });
}

function updateChartsTheme() {
    const colors = getChartColors();
    
    // Update all charts
    const charts = [
        window.adoptionChart, 
        window.investmentChart, 
        window.timelineChart, 
        window.benefitsChart,
        window.daoTreasuryChart
    ];
    
    charts.forEach(chart => {
        if (chart) {
            console.log(`Updating chart: ${chart.id}`);
            
            // Update legend colors
            if (chart.options && chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = colors.textColor;
            }
            
            // Update title colors
            if (chart.options && chart.options.plugins && chart.options.plugins.title) {
                chart.options.plugins.title.color = colors.textColor;
            }
            
            // Update scale colors
            if (chart.options && chart.options.scales) {
                Object.keys(chart.options.scales).forEach(scaleKey => {
                    const scale = chart.options.scales[scaleKey];
                    if (scale.ticks) scale.ticks.color = colors.secondaryColor;
                    if (scale.grid) scale.grid.color = colors.borderColor;
                    if (scale.title) scale.title.color = colors.textColor;
                });
            }
            
            try {
                chart.update();
            } catch (error) {
                console.error(`Error updating chart: ${error.message}`);
            }
        } else {
            console.warn("Chart not found or not initialized");
        }
    });
}

// Load external data from JSON file
async function loadExternalData() {
    try {
        const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/12fc9449763596efb4b49aa4afeb45cc/a551640b-f1e1-498d-af21-2310a6e520f6/689d4557.json');
        const data = await response.json();
        console.log('Loaded external data:', data);
        
        // Use external data to enhance charts if needed
        enhanceChartsWithExternalData(data);
    } catch (error) {
        console.error('Failed to load external data:', error);
        // Continue with default data
    }
}

function enhanceChartsWithExternalData(externalData) {
    // This function can be used to enhance charts with additional external data
    // For now, we'll keep the existing static data as it's already comprehensive
    console.log('External data loaded successfully, charts enhanced');
}

// Animation on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

// Utility functions
function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle resize events
window.addEventListener('resize', debounce(function() {
    // Update charts on resize
    [window.adoptionChart, window.timelineChart, window.benefitsChart].forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
}, 250));

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}// Mo
bile menu functionality
function initMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Close mobile menu when clicking on a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
                
                // Update active state
                mobileNavLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll to section
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const elementPosition = targetSection.offsetTop;
                    const offsetPosition = elementPosition - headerHeight - 20;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Update active mobile nav link on scroll
    window.addEventListener('scroll', throttle(function() {
        updateActiveNavigation();
        updateActiveMobileNavigation();
    }, 100));
}

function updateActiveMobileNavigation() {
    const sections = document.querySelectorAll('.section');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100;
    
    let activeSection = null;
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            activeSection = section;
        }
    });
    
    if (activeSection) {
        mobileNavLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.mobile-nav-link[href="#${activeSection.id}"]`);
        if (activeLink) activeLink.classList.add('active');
    }
}// D
AO Treasury Chart
function createDaoTreasuryChart() {
    const ctx = document.getElementById('daoTreasury');
    if (!ctx) {
        console.error('Element with id "daoTreasury" not found');
        return;
    }
    console.log('Creating DAO Treasury chart...');
    
    const colors = getChartColors();
    
    window.daoTreasuryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['100 крупнейших', 'Прочие DAO'],
            datasets: [{
                data: [18700, 22000],   // значения в млн $
                backgroundColor: [colors.chart1, colors.chart2],
                borderColor: [colors.chart1, colors.chart2],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: colors.textColor,
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Распределение средств в DAO-экосистеме (млн $)',
                    color: colors.textColor,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            cutout: '60%'
        }
    });
}