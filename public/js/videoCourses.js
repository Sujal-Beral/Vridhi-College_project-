/**
 * public/js/videoCourses.js
 * Dynamic Video Crash Courses module for Vridhi Learn.
 * Provides authentic, curated financial video lessons, dynamic search/filter,
 * responsive modal video player, and local progress tracking.
 */

const VIDEO_COURSES = [
  {
    id: "investing-stock-market-basics",
    title: "Stock Market For Beginners: Complete Practical Guide",
    category: "Investing",
    categoryKey: "filter_investing",
    instructor: "CA Rachana Ranade",
    platform: "YouTube",
    youtubeId: "aSuUinjy4Nc",
    duration: "20 min",
    difficulty: "Beginner",
    summary: "Understand the core mechanics of stock markets, historical index cycles, and how retail investors should approach long-term equity investing.",
    takeaways: [
      "Difference between speculative trading and long-term equity investing.",
      "How market indices (Sensex and Nifty) reflect broader economic growth.",
      "Key financial metrics to evaluate before selecting any stock.",
      "The role of emotional discipline and risk management during market dips."
    ],
    isPlaceholder: false
  },
  {
    id: "financial-literacy-first-salary",
    title: "How to Build Wealth with a Salaried Income (Budgeting & SIPs)",
    category: "Financial Literacy",
    categoryKey: "filter_finlit",
    instructor: "Pranjal Kamra (Finology)",
    platform: "YouTube",
    youtubeId: "D1mU04ReiGk",
    duration: "25 min",
    difficulty: "Beginner",
    summary: "A step-by-step roadmap for salaried individuals to budget income, manage cash flows, and build automated investment habits from day one.",
    takeaways: [
      "Practical application of structured allocation frameworks (such as 20-20-30-30).",
      "Why emergency funds must precede equity or high-risk investments.",
      "Automating monthly SIPs to defeat lifestyle inflation.",
      "Common debt and credit pitfalls early in a career."
    ],
    isPlaceholder: false
  },
  {
    id: "financial-planning-stocks-selection",
    title: "Learn How To Invest In Stock Market For Beginners",
    category: "Financial Planning",
    categoryKey: "filter_planning",
    instructor: "Finance With Sharan ft. Shashank Udupa",
    platform: "YouTube",
    youtubeId: "Ao7WHrRw_VM",
    duration: "63 min",
    difficulty: "Beginner",
    summary: "A detailed breakdown of evaluating company financials, P&L statements, multi-bagger mindset, and avoiding common retail pitfalls.",
    takeaways: [
      "6-step framework to begin active and passive market investing.",
      "How to read a basic company Profit & Loss statement.",
      "Self-directed investing vs. relying on fund managers.",
      "Risk mitigation and asset allocation across market caps."
    ],
    isPlaceholder: false
  },
  {
    id: "macroeconomics-financial-future",
    title: "Why the Next 10 Years Will Decide India's Wealth Creation",
    category: "Macroeconomics",
    categoryKey: "filter_macro",
    instructor: "Finance With Sharan ft. Raamdeo Agrawal",
    platform: "YouTube",
    youtubeId: "QSlta0EnGJo",
    duration: "18 min",
    difficulty: "Intermediate",
    summary: "Insights into India's economic growth trajectory, domestic manufacturing, demographic dividends, and compounding opportunities.",
    takeaways: [
      "The compounding impact of India's multi-decade GDP expansion.",
      "How corporate earnings growth drives index valuations.",
      "Sectoral shifts and long-term domestic institutional flows.",
      "Why staying invested beats trying to time macroeconomic cycles."
    ],
    isPlaceholder: false
  },
  {
    id: "investing-stock-screening-marathi",
    title: "१ मिनिटात चांगला स्टॉक कसा निवडायचा? (How to Pick Stocks)",
    category: "Investing",
    categoryKey: "filter_investing",
    instructor: "CA Rachana Ranade (Marathi)",
    platform: "YouTube",
    youtubeId: "Sg3yGZi4mms",
    duration: "15 min",
    difficulty: "Beginner",
    summary: "A simple guide in Marathi covering Debt-to-Equity, Free Cash Flow, and ROE for picking financially resilient companies.",
    takeaways: [
      "Importance of Debt-to-Equity ratio in company safety.",
      "Evaluating Return on Equity (ROE) and Earnings Per Share (EPS).",
      "Why free cash flow matters more than accounting profits.",
      "Step-by-step mindset when analyzing news versus fundamentals."
    ],
    isPlaceholder: false
  },
  {
    id: "tax-budget-rules-freedom",
    title: "New Budget Rules for Financial Freedom",
    category: "Tax",
    categoryKey: "filter_tax",
    instructor: "Pranjal Kamra (Finology)",
    platform: "YouTube",
    youtubeId: "0CaA5K5EsN8",
    duration: "18 min",
    difficulty: "Beginner",
    summary: "Understand income tax slabs, deduction limits under the New and Old tax regimes, and how to structure your annual tax-saving strategy.",
    takeaways: [
      "Core differences between New Concessional Regime and Old Regime deductions.",
      "When Chapter VI-A (80C, 80D, HRA) provides a mathematical advantage.",
      "How to prevent locking funds into sub-optimal financial products for tax deductions.",
      "Smart budgeting habits to maximize post-tax disposable income."
    ],
    isPlaceholder: false
  },
  {
    id: "investing-mutual-funds-intro",
    title: "Intro to Mutual Funds & Long-Term Wealth Strategies",
    category: "Investing",
    categoryKey: "filter_investing",
    instructor: "Financial Planning Academy",
    platform: "YouTube",
    youtubeId: "RJ0YaucSTg8",
    duration: "16 min",
    difficulty: "Beginner",
    summary: "Crucial long-term wealth strategies, SIP mechanisms, Index Funds vs Active Funds, and Total Expense Ratio (TER) fundamentals.",
    takeaways: [
      "How mutual funds pool retail capital into diversified portfolios.",
      "The compounding impact of low-cost Direct Index Funds over 20+ years.",
      "Selecting equity funds based on time horizon and risk tolerance.",
      "Rupee-cost averaging during bear markets and volatile swings."
    ],
    isPlaceholder: false
  },
  {
    id: "insurance-term-health-guide",
    title: "Term Insurance vs Health Insurance: Pure Risk Protection Guide",
    category: "Insurance",
    categoryKey: "filter_insurance",
    instructor: "Labour Law Advisor (LLA)",
    creator: "Labour Law Advisor (LLA)",
    platform: "YouTube",
    youtubeId: "AVYimO9IYdI",
    watchUrl: "https://www.youtube.com/watch?v=AVYimO9IYdI",
    thumbnailUrl: "https://img.youtube.com/vi/AVYimO9IYdI/hqdefault.jpg",
    duration: "15 min",
    difficulty: "Beginner",
    summary: "Essential guide on establishing pure risk life and health insurance coverage to protect family assets from unforeseen financial shocks.",
    takeaways: [
      "Term insurance provides pure financial protection for family dependents without low-return investment bundling.",
      "Health insurance protects existing household savings and wealth from medical inflation and hospitalization costs.",
      "Rule of thumb: Target a minimum term cover of 15–20x your annual income.",
      "Key policy clauses to verify: room rent caps, co-pay clauses, and pre-existing disease waiting periods."
    ],
    keyTakeaways: [
      "Term insurance provides pure financial protection for family dependents without low-return investment bundling.",
      "Health insurance protects existing household savings and wealth from medical inflation and hospitalization costs.",
      "Rule of thumb: Target a minimum term cover of 15–20x your annual income.",
      "Key policy clauses to verify: room rent caps, co-pay clauses, and pre-existing disease waiting periods."
    ],
    isPlaceholder: false
  },
  {
    id: "retirement-nps-epf-framework",
    title: "Retirement Planning: Mastering EPF, PPF & NPS",
    category: "Retirement",
    categoryKey: "filter_retirement",
    instructor: "Labour Law Advisor (LLA)",
    creator: "Labour Law Advisor (LLA)",
    platform: "YouTube",
    youtubeId: "jSF9kdYjiYY",
    watchUrl: "https://www.youtube.com/watch?v=jSF9kdYjiYY",
    thumbnailUrl: "https://img.youtube.com/vi/jSF9kdYjiYY/hqdefault.jpg",
    duration: "29 min",
    difficulty: "Intermediate",
    summary: "A practical framework for combining mandatory provident funds (EPF) with voluntary pension systems (NPS) for multi-decade compounding.",
    takeaways: [
      "Comparative asset growth across EPF, PPF (guaranteed debt), and NPS (equity & debt combination).",
      "Exclusive Section 80CCD(1B) additional tax deduction of ₹50,000 under the Old Regime for NPS.",
      "Understanding active vs. auto allocation in NPS Tier-1 for long-term compounding.",
      "Maturity withdrawal rules: 60% tax-free lump sum and mandatory 40% annuity distribution."
    ],
    keyTakeaways: [
      "Comparative asset growth across EPF, PPF (guaranteed debt), and NPS (equity & debt combination).",
      "Exclusive Section 80CCD(1B) additional tax deduction of ₹50,000 under the Old Regime for NPS.",
      "Understanding active vs. auto allocation in NPS Tier-1 for long-term compounding.",
      "Maturity withdrawal rules: 60% tax-free lump sum and mandatory 40% annuity distribution."
    ],
    isPlaceholder: false
  },
  {
    id: "digital-finance-upi-cyber-safety",
    title: "Digital Payments, UPI 2.0 & Cyber Safety Essentials",
    category: "Digital Finance",
    categoryKey: "filter_digital",
    instructor: "Digital Payment Safety Guide",
    creator: "Digital Payment Safety Guide",
    platform: "YouTube",
    youtubeId: "swv8-dvM7Jg",
    watchUrl: "https://www.youtube.com/watch?v=swv8-dvM7Jg",
    thumbnailUrl: "https://img.youtube.com/vi/swv8-dvM7Jg/hqdefault.jpg",
    duration: "12 min",
    difficulty: "Beginner",
    summary: "Best practices for utilizing UPI credit lines, understanding digital lending guidelines, and preventing financial fraud and phishing attacks.",
    takeaways: [
      "UPI Golden Rule: A UPI PIN is NEVER required to receive money, only to debit funds.",
      "How to detect spoofed QR codes, collect requests, and phishing text links.",
      "Setting transaction and daily velocity limits on banking apps to minimize risk exposure.",
      "Immediate incident steps: Dial 1930 and report suspicious transactions on cybercrime.gov.in within the golden hour."
    ],
    keyTakeaways: [
      "UPI Golden Rule: A UPI PIN is NEVER required to receive money, only to debit funds.",
      "How to detect spoofed QR codes, collect requests, and phishing text links.",
      "Setting transaction and daily velocity limits on banking apps to minimize risk exposure.",
      "Immediate incident steps: Dial 1930 and report suspicious transactions on cybercrime.gov.in within the golden hour."
    ],
    isPlaceholder: false
  }
];

window.VIDEO_COURSES = VIDEO_COURSES;

// Active state
let activeVideoCategoryFilter = "all";
let activeVideoSearchQuery = "";
const PROGRESS_STORAGE_KEY = "vridhiVideoCourseProgress";
let lastActiveTriggerElement = null;

// Helper: Get watched courses from localStorage
function getWatchedCourses() {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Could not read video progress from localStorage:", err);
    return [];
  }
}

// Helper: Save watched courses to localStorage
function saveWatchedCourses(list) {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn("Could not save video progress to localStorage:", err);
  }
}

// Check if course is watched
function isCourseWatched(courseId) {
  const watched = getWatchedCourses();
  return watched.includes(courseId);
}

// Mark course as watched
function markCourseWatched(courseId) {
  const watched = getWatchedCourses();
  if (!watched.includes(courseId)) {
    watched.push(courseId);
    saveWatchedCourses(watched);
  }
  updateLearningProgressUI();
  renderVideoCoursesList();
}
window.markCourseWatched = markCourseWatched;

// Update Overall Progress UI
function updateLearningProgressUI() {
  const watched = getWatchedCourses();
  const total = VIDEO_COURSES.length;
  const count = watched.filter(id => VIDEO_COURSES.some(c => c.id === id)).length;
  const percentage = Math.round((count / total) * 100);

  const textEl = document.getElementById("video-progress-text");
  const pctEl = document.getElementById("video-progress-pct");
  const fillEl = document.getElementById("video-progress-bar-fill");

  const exploredLabel = (window.t && window.t('courses_explored')) ? window.t('courses_explored') : 'courses explored';

  if (textEl) {
    textEl.textContent = `${count} of ${total} ${exploredLabel}`;
  }
  if (pctEl) {
    pctEl.textContent = `${percentage}%`;
  }
  if (fillEl) {
    fillEl.style.width = `${percentage}%`;
  }
}
window.updateLearningProgressUI = updateLearningProgressUI;

// Initialize Video Courses Module
function initVideoCoursesModule() {
  renderVideoCategoryFilters();
  renderVideoCoursesList();
  updateLearningProgressUI();
  setupVideoSearchListener();
  setupVideoModalListeners();
}

// Render Category Filter Pills
function renderVideoCategoryFilters() {
  const filterContainer = document.getElementById("video-category-filters");
  if (!filterContainer) return;

  const categories = [
    { key: "all", labelKey: "filter_all", defaultLabel: "All" },
    { key: "Investing", labelKey: "filter_investing", defaultLabel: "Investing" },
    { key: "Financial Literacy", labelKey: "filter_finlit", defaultLabel: "Financial Literacy" },
    { key: "Tax", labelKey: "filter_tax", defaultLabel: "Tax" },
    { key: "Insurance", labelKey: "filter_insurance", defaultLabel: "Insurance" },
    { key: "Retirement", labelKey: "filter_retirement", defaultLabel: "Retirement" },
    { key: "Digital Finance", labelKey: "filter_digital", defaultLabel: "Digital Finance" },
    { key: "Macroeconomics", labelKey: "filter_macro", defaultLabel: "Macroeconomics" },
    { key: "Financial Planning", labelKey: "filter_planning", defaultLabel: "Financial Planning" }
  ];

  filterContainer.innerHTML = categories.map(cat => {
    const isActive = activeVideoCategoryFilter === cat.key;
    const label = (window.t && window.t(cat.labelKey)) ? window.t(cat.labelKey) : cat.defaultLabel;
    return `
      <button type="button" 
              class="video-filter-pill ${isActive ? 'active' : ''}" 
              data-filter-category="${cat.key}"
              onclick="window.setVideoCategoryFilter('${cat.key}')">
        ${label}
      </button>
    `;
  }).join("");
}
window.renderVideoCategoryFilters = renderVideoCategoryFilters;

// Set Active Category Filter
function setVideoCategoryFilter(category) {
  activeVideoCategoryFilter = category;
  renderVideoCategoryFilters();
  renderVideoCoursesList();
}
window.setVideoCategoryFilter = setVideoCategoryFilter;

// Filter Video Courses
function getFilteredVideoCourses() {
  return VIDEO_COURSES.filter(course => {
    // Category match
    const categoryMatches = (activeVideoCategoryFilter === "all" || course.category.toLowerCase() === activeVideoCategoryFilter.toLowerCase());

    // Search query match
    if (!activeVideoSearchQuery.trim()) {
      return categoryMatches;
    }

    const q = activeVideoSearchQuery.toLowerCase().trim();
    const titleMatches = course.title.toLowerCase().includes(q);
    const summaryMatches = course.summary.toLowerCase().includes(q);
    const instructorMatches = course.instructor.toLowerCase().includes(q);
    const categoryMatchesText = course.category.toLowerCase().includes(q);
    const takeawaysMatch = Array.isArray(course.takeaways) && course.takeaways.some(t => t.toLowerCase().includes(q));

    return categoryMatches && (titleMatches || summaryMatches || instructorMatches || categoryMatchesText || takeawaysMatch);
  });
}

// Render Video Course Cards
function renderVideoCoursesList() {
  const container = document.getElementById("video-grid-container");
  if (!container) return;

  const filtered = getFilteredVideoCourses();
  const watchVideoLabel = (window.t && window.t('watch_video')) ? window.t('watch_video') : 'Watch Video ▶';
  const watchedBadgeLabel = (window.t && window.t('watched')) ? window.t('watched') : '✓ Watched';
  const noCoursesLabel = (window.t && window.t('no_courses_found')) ? window.t('no_courses_found') : 'No video courses match your search criteria.';
  const clearFiltersLabel = (window.t && window.t('clear_filters')) ? window.t('clear_filters') : 'Clear Filters';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="video-empty-state">
        <span style="font-size: 2.2rem;">🎬</span>
        <p>${noCoursesLabel}</p>
        <button class="video-filter-pill active" onclick="window.setVideoCategoryFilter('all'); document.getElementById('video-search-input').value=''; window.handleVideoSearch('');">
          ${clearFiltersLabel}
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(course => {
    const isWatched = isCourseWatched(course.id);
    const thumbnailSrc = course.thumbnailUrl || (course.youtubeId 
      ? `https://img.youtube.com/vi/${course.youtubeId}/hqdefault.jpg`
      : `/images/Vridhi_logo.jpeg`);

    const isAvailable = !course.isPlaceholder && course.youtubeId;
    const instructorName = course.creator || course.instructor;

    return `
      <div class="video-course-card ${isWatched ? 'is-watched' : ''}" data-course-id="${course.id}">
        <div class="video-thumbnail-wrapper" onclick="window.openVideoPlayerModal('${course.id}', this)" role="button" tabindex="0" aria-label="Play ${course.title}">
          <img src="${thumbnailSrc}" 
               alt="${course.title}" 
               class="video-thumbnail-img" 
               loading="lazy" 
               onerror="this.onerror=null; this.src='/images/Vridhi_logo.jpeg';">
          <div class="video-play-overlay">
            <span class="video-play-icon">${isAvailable ? '▶' : 'ℹ️'}</span>
          </div>
          <span class="video-duration-tag">⏱️ ${course.duration}</span>
          ${isWatched ? `<span class="video-watched-badge">${watchedBadgeLabel}</span>` : ''}
        </div>

        <div class="video-card-content">
          <div class="video-card-top-meta">
            <span class="video-category-tag">${course.category}</span>
            <span class="video-difficulty-tag">${course.difficulty}</span>
          </div>

          <h3 class="video-card-title">${course.title}</h3>
          <p class="video-card-summary">${course.summary}</p>

          <div class="video-card-instructor-meta">
            <span class="video-instructor-icon">👨‍🏫</span>
            <span class="video-instructor-name">${instructorName}</span>
          </div>

          <div class="video-card-actions">
            <button type="button" 
                    class="video-watch-btn ${isWatched ? 'watched-action' : ''}" 
                    onclick="window.openVideoPlayerModal('${course.id}', this)">
              ${isWatched ? watchedBadgeLabel : watchVideoLabel}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}
window.renderVideoCoursesList = renderVideoCoursesList;

// Search Input Listener
function setupVideoSearchListener() {
  const searchInput = document.getElementById("video-search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    window.handleVideoSearch(e.target.value);
  });
}

function handleVideoSearch(query) {
  activeVideoSearchQuery = query;
  renderVideoCoursesList();
}
window.handleVideoSearch = handleVideoSearch;

// Open Video Player Modal
function openVideoPlayerModal(courseId, triggerEl) {
  const course = VIDEO_COURSES.find(c => c.id === courseId);
  if (!course) return;

  lastActiveTriggerElement = triggerEl || document.activeElement;

  const modal = document.getElementById("video-player-modal");
  const backdrop = document.getElementById("video-modal-backdrop");
  const frameWrapper = document.getElementById("video-player-frame-wrapper");
  if (!modal || !backdrop || !frameWrapper) return;

  // Mark course as explored/watched upon opening
  markCourseWatched(courseId);

  // Populate metadata
  document.getElementById("modal-video-category").textContent = course.category;
  document.getElementById("modal-video-difficulty").textContent = course.difficulty;
  document.getElementById("modal-video-duration").textContent = `⏱️ ${course.duration}`;
  document.getElementById("modal-video-title").textContent = course.title;
  document.getElementById("modal-video-instructor").textContent = course.creator || course.instructor;
  document.getElementById("modal-video-platform").textContent = course.platform || "YouTube";
  document.getElementById("modal-video-summary").textContent = course.summary;

  // Watched Indicator in modal
  const watchedBadge = document.getElementById("modal-watched-indicator");
  if (watchedBadge) {
    watchedBadge.style.display = "inline-flex";
  }

  // Populate takeaways (supports takeaways and keyTakeaways)
  const takeawaysList = document.getElementById("modal-video-takeaways-list");
  const listData = course.keyTakeaways || course.takeaways;
  if (takeawaysList && Array.isArray(listData)) {
    takeawaysList.innerHTML = listData.map(t => `<li>${t}</li>`).join("");
  }

  // Setup Mark as Watched button in modal
  const markBtn = document.getElementById("video-modal-mark-watched-btn");
  if (markBtn) {
    const markLabel = (window.t && window.t('watched')) ? window.t('watched') : '✓ Watched';
    markBtn.textContent = markLabel;
    markBtn.onclick = () => {
      markCourseWatched(course.id);
      closeVideoPlayerModal();
    };
  }

  // Load YouTube Iframe or Placeholder Message
  if (!course.isPlaceholder && course.youtubeId) {
    frameWrapper.innerHTML = `
      <iframe 
        src="https://www.youtube-nocookie.com/embed/${course.youtubeId}?autoplay=1&rel=0" 
        title="${course.title}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen 
        loading="lazy"
        class="video-player-iframe">
      </iframe>
    `;
  } else {
    const unavailText = (window.t && window.t('video_unavailable')) ? window.t('video_unavailable') : 'Video currently unavailable';
    frameWrapper.innerHTML = `
      <div class="video-placeholder-notice">
        <span style="font-size: 2.5rem; margin-bottom: 8px;">🎬</span>
        <h4>${unavailText}</h4>
        <p>This curriculum unit is currently in verification. Please explore the learning takeaways and verified whitepapers below.</p>
      </div>
    `;
  }

  // Show modal and lock background scrolling
  backdrop.classList.add("active");
  modal.classList.add("active");
  document.body.classList.add("video-modal-open");

  // Focus close button for accessibility
  const closeBtn = document.getElementById("video-modal-close-btn");
  if (closeBtn) closeBtn.focus();
}
window.openVideoPlayerModal = openVideoPlayerModal;

// Close Video Player Modal & Stop Playback
function closeVideoPlayerModal() {
  const modal = document.getElementById("video-player-modal");
  const backdrop = document.getElementById("video-modal-backdrop");
  const frameWrapper = document.getElementById("video-player-frame-wrapper");

  // Stop video immediately by destroying iframe src
  if (frameWrapper) {
    frameWrapper.innerHTML = "";
  }

  if (modal) modal.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
  document.body.classList.remove("video-modal-open");

  // Restore focus to opener element
  if (lastActiveTriggerElement && typeof lastActiveTriggerElement.focus === "function") {
    lastActiveTriggerElement.focus();
  }
}
window.closeVideoPlayerModal = closeVideoPlayerModal;

// Setup Modal Event Listeners
function setupVideoModalListeners() {
  const modal = document.getElementById("video-player-modal");
  const backdrop = document.getElementById("video-modal-backdrop");
  const closeBtn = document.getElementById("video-modal-close-btn");
  const footerCloseBtn = document.getElementById("video-modal-footer-close-btn");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeVideoPlayerModal);
  }
  if (footerCloseBtn) {
    footerCloseBtn.addEventListener("click", closeVideoPlayerModal);
  }
  if (backdrop) {
    backdrop.addEventListener("click", closeVideoPlayerModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      const activeModal = document.querySelector(".video-player-modal.active");
      if (activeModal) {
        closeVideoPlayerModal();
      }
    }
  });
}

// Re-render when language changes
if (window.applyLanguage) {
  const originalApplyLanguage = window.applyLanguage;
  window.applyLanguage = function(lang) {
    originalApplyLanguage(lang);
    renderVideoCategoryFilters();
    renderVideoCoursesList();
    updateLearningProgressUI();
  };
}

// Auto-run on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initVideoCoursesModule();
});
