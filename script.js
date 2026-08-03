/**
 * MCQ Study Web Application - Core Engine
 * Pure Vanilla JavaScript (ES6+)
 */

(() => {
  'use strict';

  // --- APP STATE ---
  const state = {
    questions: [],
    filteredQuestions: [],
    currentIndex: 0,
    mode: 'study', // 'study' | 'practice'
    filter: 'all',  // 'all' | 'unanswered' | 'correct' | 'incorrect' | 'bookmarked'
    searchQuery: '',
    
    // User data persisted in LocalStorage
    userAnswers: {},     // { qId: { 'A': 'T'|'F', 'B': 'T'|'F', ... } }
    submittedState: {},  // { qId: true|false }
    bookmarks: new Set(),
    notes: {},           // { qId: 'text' }
    visited: new Set(),
    theme: 'dark'
  };

  // --- DOM ELEMENTS ---
  const dom = {
    loadingScreen: document.getElementById('loading-screen'),
    loadingBar: document.getElementById('loading-bar'),
    app: document.getElementById('app'),
    
    // Header
    btnToggleDrawer: document.getElementById('btn-toggle-drawer'),
    modeStudy: document.getElementById('mode-study'),
    modePractice: document.getElementById('mode-practice'),
    searchInput: document.getElementById('search-input'),
    btnStats: document.getElementById('btn-stats'),
    btnThemeToggle: document.getElementById('btn-theme-toggle'),
    themeIconSun: document.getElementById('theme-icon-sun'),
    themeIconMoon: document.getElementById('theme-icon-moon'),
    
    // Sidebar Drawer
    paletteDrawer: document.getElementById('palette-drawer'),
    drawerBackdrop: document.getElementById('drawer-backdrop'),
    btnCloseDrawer: document.getElementById('btn-close-drawer'),
    jumpInput: document.getElementById('jump-input'),
    jumpBtn: document.getElementById('jump-btn'),
    filterChips: document.querySelectorAll('.chip'),
    questionGrid: document.getElementById('question-grid'),
    countAll: document.getElementById('count-all'),
    countUnanswered: document.getElementById('count-unanswered'),
    countCorrect: document.getElementById('count-correct'),
    countIncorrect: document.getElementById('count-incorrect'),
    countBookmarked: document.getElementById('count-bookmarked'),
    
    // Hero Landing
    landingBanner: document.getElementById('landing-banner'),
    btnHeroStart: document.getElementById('btn-hero-start'),
    btnHeroContinue: document.getElementById('btn-hero-continue'),
    
    // Question View
    questionView: document.getElementById('question-view'),
    questionIndexBadge: document.getElementById('question-index-badge'),
    questionTypeBadge: document.getElementById('question-type-badge'),
    questionStatusBadge: document.getElementById('question-status-badge'),
    btnBookmark: document.getElementById('btn-bookmark'),
    bookmarkIcon: document.getElementById('bookmark-icon'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    
    // Action Bar
    btnSubmit: document.getElementById('btn-submit'),
    btnResetCurrent: document.getElementById('btn-reset-current'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    
    // Notes
    notesDetails: document.getElementById('notes-details'),
    notesInput: document.getElementById('notes-input'),
    
    // Stats Modal
    statsModal: document.getElementById('stats-modal'),
    btnCloseStats: document.getElementById('btn-close-stats'),
    statAccuracy: document.getElementById('stat-accuracy'),
    gaugeProgress: document.getElementById('gauge-progress'),
    statTotal: document.getElementById('stat-total'),
    statAttempted: document.getElementById('stat-attempted'),
    statCorrect: document.getElementById('stat-correct'),
    statIncorrect: document.getElementById('stat-incorrect'),
    statRemaining: document.getElementById('stat-remaining'),
    statBookmarked: document.getElementById('stat-bookmarked'),
    btnCopyStats: document.getElementById('btn-copy-stats'),
    btnResetProgress: document.getElementById('btn-reset-progress')
  };

  // --- INITIALIZATION ---
  async function init() {
    loadLocalState();
    setupTheme();
    setupEventListeners();
    await fetchQuestionBank();
  }

  // --- LOCAL STORAGE HELPERS ---
  function loadLocalState() {
    try {
      const savedAnswers = localStorage.getItem('mcq_user_answers');
      if (savedAnswers) state.userAnswers = JSON.parse(savedAnswers);

      const savedSubmitted = localStorage.getItem('mcq_submitted');
      if (savedSubmitted) state.submittedState = JSON.parse(savedSubmitted);

      const savedBookmarks = localStorage.getItem('mcq_bookmarks');
      if (savedBookmarks) state.bookmarks = new Set(JSON.parse(savedBookmarks));

      const savedNotes = localStorage.getItem('mcq_notes');
      if (savedNotes) state.notes = JSON.parse(savedNotes);

      const savedVisited = localStorage.getItem('mcq_visited');
      if (savedVisited) state.visited = new Set(JSON.parse(savedVisited));

      const savedIdx = localStorage.getItem('mcq_current_index');
      if (savedIdx !== null) state.currentIndex = parseInt(savedIdx, 10) || 0;

      const savedTheme = localStorage.getItem('mcq_theme');
      if (savedTheme) state.theme = savedTheme;

      const savedMode = localStorage.getItem('mcq_mode');
      if (savedMode) state.mode = savedMode;
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function saveLocalState() {
    try {
      localStorage.setItem('mcq_user_answers', JSON.stringify(state.userAnswers));
      localStorage.setItem('mcq_submitted', JSON.stringify(state.submittedState));
      localStorage.setItem('mcq_bookmarks', JSON.stringify(Array.from(state.bookmarks)));
      localStorage.setItem('mcq_notes', JSON.stringify(state.notes));
      localStorage.setItem('mcq_visited', JSON.stringify(Array.from(state.visited)));
      localStorage.setItem('mcq_current_index', state.currentIndex);
      localStorage.setItem('mcq_theme', state.theme);
      localStorage.setItem('mcq_mode', state.mode);
    } catch (e) {
      console.warn('Failed to save to LocalStorage:', e);
    }
  }

  // --- THEME MANAGEMENT ---
  function setupTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcons();
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcons();
    saveLocalState();
  }

  function updateThemeIcons() {
    if (state.theme === 'dark') {
      dom.themeIconSun.classList.add('hidden');
      dom.themeIconMoon.classList.remove('hidden');
    } else {
      dom.themeIconSun.classList.remove('hidden');
      dom.themeIconMoon.classList.add('hidden');
    }
  }

  // --- FETCH DATA ---
  async function fetchQuestionBank() {
    try {
      setLoadingProgress(40);

      let data;
      if (window.QUESTIONS_DATA && Array.isArray(window.QUESTIONS_DATA)) {
        data = window.QUESTIONS_DATA;
      } else {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        data = await response.json();
      }

      setLoadingProgress(80);
      state.questions = data;
      setLoadingProgress(100);

      // Transition out loading screen
      setTimeout(() => {
        dom.loadingScreen.style.opacity = '0';
        setTimeout(() => {
          dom.loadingScreen.classList.add('hidden');
          dom.app.classList.remove('hidden');
          
          applyFiltersAndSearch();
          updateModeButtons();
          
          // Check if session exists to show hero continue option
          if (state.visited.size > 0) {
            dom.btnHeroContinue.classList.remove('hidden');
          }
          
          renderCurrentQuestion();
          renderQuestionGrid();
          updateCounts();
        }, 400);
      }, 300);

    } catch (error) {
      console.error('Failed to load question bank:', error);
      dom.loadingScreen.querySelector('.loading-sub').textContent = 'Error loading question bank. Please refresh.';
      dom.loadingBar.style.backgroundColor = 'var(--color-danger)';
    }
  }

  function setLoadingProgress(percent) {
    if (dom.loadingBar) {
      dom.loadingBar.style.width = `${percent}%`;
    }
  }

  // --- FILTER & SEARCH ---
  function applyFiltersAndSearch() {
    const query = state.searchQuery.toLowerCase().trim();
    
    state.filteredQuestions = state.questions.filter((q) => {
      // 1. Filter match
      const qStatus = getQuestionStatus(q.id);
      let matchesFilter = true;
      if (state.filter === 'unanswered') matchesFilter = !state.submittedState[q.id];
      else if (state.filter === 'correct') matchesFilter = qStatus === 'correct';
      else if (state.filter === 'incorrect') matchesFilter = qStatus === 'incorrect';
      else if (state.filter === 'bookmarked') matchesFilter = state.bookmarks.has(q.id);

      if (!matchesFilter) return false;

      // 2. Search query match
      if (!query) return true;

      const inQuestion = q.question.toLowerCase().includes(query);
      const inOptions = q.options.some(opt => 
        opt.text.toLowerCase().includes(query) || 
        opt.explanation.toLowerCase().includes(query)
      );
      
      return inQuestion || inOptions;
    });

    // Ensure valid current index within filtered list
    if (state.currentIndex >= state.filteredQuestions.length) {
      state.currentIndex = Math.max(0, state.filteredQuestions.length - 1);
    }
  }

  function getQuestionStatus(qId) {
    if (!state.submittedState[qId]) {
      return state.visited.has(qId) ? 'visited' : 'unvisited';
    }
    // Check correctness
    const q = state.questions.find(item => item.id === qId);
    if (!q) return 'visited';
    
    const choices = state.userAnswers[qId] || {};
    let allCorrect = true;
    
    for (const opt of q.options) {
      const userChoice = choices[opt.id];
      if (userChoice !== opt.answer) {
        allCorrect = false;
        break;
      }
    }
    
    return allCorrect ? 'correct' : 'incorrect';
  }

  // --- RENDER QUESTION ---
  function renderCurrentQuestion() {
    if (state.filteredQuestions.length === 0) {
      renderEmptyState();
      return;
    }

    dom.landingBanner.classList.add('hidden');
    dom.questionView.classList.remove('hidden');

    const q = state.filteredQuestions[state.currentIndex];
    state.visited.add(q.id);
    saveLocalState();

    // Badges & Meta
    const overallIndex = state.questions.findIndex(item => item.id === q.id) + 1;
    dom.questionIndexBadge.textContent = `Question ${overallIndex} of ${state.questions.length}`;
    
    const qStatus = getQuestionStatus(q.id);
    dom.questionStatusBadge.textContent = qStatus.toUpperCase();
    dom.questionStatusBadge.className = `badge badge-outline status-${qStatus}`;

    // Bookmark icon state
    if (state.bookmarks.has(q.id)) {
      dom.bookmarkIcon.setAttribute('fill', 'var(--color-warning)');
      dom.bookmarkIcon.setAttribute('stroke', 'var(--color-warning)');
    } else {
      dom.bookmarkIcon.setAttribute('fill', 'none');
      dom.bookmarkIcon.setAttribute('stroke', 'currentColor');
    }

    // Question Text
    dom.questionText.textContent = q.question;

    // Render Options A-E
    renderOptions(q);

    // Personal Notes
    dom.notesInput.value = state.notes[q.id] || '';
    dom.notesDetails.open = !!state.notes[q.id];

    // Action Bar Controls
    const isSubmitted = !!state.submittedState[q.id];
    if (state.mode === 'practice' && !isSubmitted) {
      dom.btnSubmit.classList.remove('hidden');
    } else {
      dom.btnSubmit.classList.add('hidden');
    }

    // Prev / Next Navigation buttons
    dom.btnPrev.disabled = state.currentIndex === 0;
    dom.btnNext.disabled = state.currentIndex === state.filteredQuestions.length - 1;

    renderQuestionGrid();
    updateCounts();
  }

  function renderOptions(q) {
    dom.optionsContainer.innerHTML = '';
    const qId = q.id;
    const choices = state.userAnswers[qId] || {};
    const isSubmitted = !!state.submittedState[qId];
    const isStudyMode = state.mode === 'study';

    q.options.forEach((opt) => {
      const row = document.createElement('div');
      row.className = 'option-row';
      
      const userChoice = choices[opt.id]; // 'T' | 'F' | undefined
      const targetAnswer = opt.answer === 'T' ? 'True' : 'False';
      
      let feedbackBadgeHtml = '';

      if (isStudyMode) {
        // STUDY MODE: Always display the correct answer key
        if (userChoice === undefined) {
          // User hasn't chosen yet: display clear answer key badge (NOT marked as incorrect!)
          feedbackBadgeHtml = `
            <div class="option-feedback-badge badge-key-info">
              Answer Key: <strong>${targetAnswer}</strong>
            </div>
          `;
        } else if (userChoice === opt.answer) {
          // User tested themselves and got it right
          row.classList.add('correct-choice');
          feedbackBadgeHtml = `
            <div class="option-feedback-badge badge-correct-feedback">
              ✓ Correct! (${targetAnswer})
            </div>
          `;
        } else {
          // User tested themselves and chose wrong option
          row.classList.add('incorrect-choice');
          feedbackBadgeHtml = `
            <div class="option-feedback-badge badge-incorrect-feedback">
              ✗ You chose ${userChoice === 'T' ? 'True' : 'False'} — Correct Answer: <strong>${targetAnswer}</strong>
            </div>
          `;
        }
      } else if (isSubmitted) {
        // PRACTICE MODE AFTER SUBMIT
        if (userChoice === undefined) {
          feedbackBadgeHtml = `
            <div class="option-feedback-badge badge-missed-feedback">
              ! Unanswered — Answer: <strong>${targetAnswer}</strong>
            </div>
          `;
        } else if (userChoice === opt.answer) {
          row.classList.add('correct-choice');
          feedbackBadgeHtml = `
            <div class="option-feedback-badge badge-correct-feedback">
              ✓ Correct Choice (${targetAnswer})
            </div>
          `;
        } else {
          row.classList.add('incorrect-choice');
          feedbackBadgeHtml = `
            <div class="option-feedback-badge badge-incorrect-feedback">
              ✗ Incorrect (${userChoice === 'T' ? 'True' : 'False'}) — Answer: <strong>${targetAnswer}</strong>
            </div>
          `;
        }
      }

      const showExplanation = isStudyMode || isSubmitted;

      row.innerHTML = `
        <div class="option-main">
          <div class="option-letter-badge">${opt.id}</div>
          <div class="option-statement">
            <div class="opt-text-content">${opt.text}</div>
            ${feedbackBadgeHtml}
          </div>
          
          <!-- T/F Control Buttons -->
          <div class="tf-control">
            <button class="tf-btn tf-btn-t ${userChoice === 'T' ? 'selected' : ''}" data-letter="${opt.id}" data-val="T" ${isSubmitted && !isStudyMode ? 'disabled' : ''}>T</button>
            <button class="tf-btn tf-btn-f ${userChoice === 'F' ? 'selected' : ''}" data-letter="${opt.id}" data-val="F" ${isSubmitted && !isStudyMode ? 'disabled' : ''}>F</button>
          </div>
        </div>

        <!-- Explanation area -->
        ${(showExplanation && opt.explanation) ? `
          <div class="option-explanation">
            <div class="explanation-header">Explanation (${opt.id})</div>
            ${opt.explanation}
          </div>
        ` : ''}
      `;

      // Event listener for T/F buttons
      const tfButtons = row.querySelectorAll('.tf-btn');
      tfButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const letter = btn.getAttribute('data-letter');
          const val = btn.getAttribute('data-val');
          
          toggleOptionChoice(qId, letter, val);
        });
      });

      dom.optionsContainer.appendChild(row);
    });
  }

  function toggleOptionChoice(qId, letter, val) {
    if (state.mode === 'practice' && state.submittedState[qId]) return;

    if (!state.userAnswers[qId]) {
      state.userAnswers[qId] = {};
    }

    // Toggle logic: if already chosen, unselect it; otherwise set it
    if (state.userAnswers[qId][letter] === val) {
      delete state.userAnswers[qId][letter];
    } else {
      state.userAnswers[qId][letter] = val;
    }

    saveLocalState();
    renderCurrentQuestion();
  }

  function submitCurrentQuestion() {
    const q = state.filteredQuestions[state.currentIndex];
    if (!q) return;

    state.submittedState[q.id] = true;
    saveLocalState();
    renderCurrentQuestion();
  }

  function clearCurrentQuestionChoices() {
    const q = state.filteredQuestions[state.currentIndex];
    if (!q) return;

    delete state.userAnswers[q.id];
    delete state.submittedState[q.id];
    saveLocalState();
    renderCurrentQuestion();
  }

  function renderEmptyState() {
    dom.questionView.classList.add('hidden');
    dom.landingBanner.classList.remove('hidden');
    dom.landingBanner.querySelector('.hero-title').textContent = 'No Questions Found';
    dom.landingBanner.querySelector('.hero-desc').textContent = 'Try adjusting your search query or filter selection.';
    dom.btnHeroStart.classList.add('hidden');
    dom.btnHeroContinue.classList.add('hidden');
  }

  // --- RENDER PALETTE GRID ---
  function renderQuestionGrid() {
    dom.questionGrid.innerHTML = '';

    state.filteredQuestions.forEach((q, idx) => {
      const gridBtn = document.createElement('button');
      gridBtn.className = 'grid-item';
      
      const overallIndex = state.questions.findIndex(item => item.id === q.id) + 1;
      gridBtn.textContent = overallIndex;
      
      const qStatus = getQuestionStatus(q.id);
      gridBtn.classList.add(qStatus);

      if (idx === state.currentIndex) {
        gridBtn.classList.add('current');
      }

      if (state.bookmarks.has(q.id)) {
        gridBtn.classList.add('bookmarked');
      }

      gridBtn.addEventListener('click', () => {
        state.currentIndex = idx;
        saveLocalState();
        renderCurrentQuestion();
        if (window.innerWidth <= 768) {
          closeDrawer();
        }
      });

      dom.questionGrid.appendChild(gridBtn);
    });
  }

  function updateCounts() {
    let unanswered = 0;
    let correct = 0;
    let incorrect = 0;

    state.questions.forEach(q => {
      const st = getQuestionStatus(q.id);
      if (st === 'unanswered' || !state.submittedState[q.id]) unanswered++;
      if (st === 'correct') correct++;
      if (st === 'incorrect') incorrect++;
    });

    dom.countAll.textContent = state.questions.length;
    dom.countUnanswered.textContent = unanswered;
    dom.countCorrect.textContent = correct;
    dom.countIncorrect.textContent = incorrect;
    dom.countBookmarked.textContent = state.bookmarks.size;
  }

  // --- STATS MODAL ---
  function updateStatsModal() {
    const total = state.questions.length;
    let attempted = 0;
    let correctOptions = 0;
    let totalOptionsSubmitted = 0;

    state.questions.forEach(q => {
      if (state.submittedState[q.id]) {
        attempted++;
      }
      const choices = state.userAnswers[q.id] || {};
      q.options.forEach(opt => {
        if (choices[opt.id] !== undefined) {
          totalOptionsSubmitted++;
          if (choices[opt.id] === opt.answer) {
            correctOptions++;
          }
        }
      });
    });

    const incorrectOptions = totalOptionsSubmitted - correctOptions;
    const accuracy = totalOptionsSubmitted > 0 ? Math.round((correctOptions / totalOptionsSubmitted) * 100) : 0;
    const remaining = total - attempted;

    dom.statTotal.textContent = total;
    dom.statAttempted.textContent = attempted;
    dom.statCorrect.textContent = correctOptions;
    dom.statIncorrect.textContent = incorrectOptions;
    dom.statRemaining.textContent = remaining;
    dom.statBookmarked.textContent = state.bookmarks.size;
    dom.statAccuracy.textContent = `${accuracy}%`;

    // SVG Gauge calculation
    const circumference = 314;
    const offset = circumference - (accuracy / 100) * circumference;
    dom.gaugeProgress.style.strokeDashoffset = offset;
  }

  // --- DRAWER & MODAL CONTROLS ---
  function toggleDrawer() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      dom.paletteDrawer.classList.toggle('open');
      dom.drawerBackdrop.classList.toggle('open');
    } else {
      dom.paletteDrawer.classList.toggle('collapsed');
    }
  }

  function closeDrawer() {
    dom.paletteDrawer.classList.remove('open');
    dom.drawerBackdrop.classList.remove('open');
  }

  function openStats() {
    updateStatsModal();
    dom.statsModal.classList.remove('hidden');
  }

  function closeStats() {
    dom.statsModal.classList.add('hidden');
  }

  function updateModeButtons() {
    if (state.mode === 'study') {
      dom.modeStudy.classList.add('active');
      dom.modePractice.classList.remove('active');
    } else {
      dom.modeStudy.classList.remove('active');
      dom.modePractice.classList.add('active');
    }
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Mode Switch
    dom.modeStudy.addEventListener('click', () => {
      state.mode = 'study';
      updateModeButtons();
      saveLocalState();
      renderCurrentQuestion();
    });

    dom.modePractice.addEventListener('click', () => {
      state.mode = 'practice';
      updateModeButtons();
      saveLocalState();
      renderCurrentQuestion();
    });

    // Theme toggle
    dom.btnThemeToggle.addEventListener('click', toggleTheme);

    // Navigation
    dom.btnPrev.addEventListener('click', () => {
      if (state.currentIndex > 0) {
        state.currentIndex--;
        saveLocalState();
        renderCurrentQuestion();
      }
    });

    dom.btnNext.addEventListener('click', () => {
      if (state.currentIndex < state.filteredQuestions.length - 1) {
        state.currentIndex++;
        saveLocalState();
        renderCurrentQuestion();
      }
    });

    // Actions
    dom.btnSubmit.addEventListener('click', submitCurrentQuestion);
    dom.btnResetCurrent.addEventListener('click', clearCurrentQuestionChoices);

    // Bookmark toggle
    dom.btnBookmark.addEventListener('click', () => {
      const q = state.filteredQuestions[state.currentIndex];
      if (!q) return;

      if (state.bookmarks.has(q.id)) {
        state.bookmarks.delete(q.id);
      } else {
        state.bookmarks.add(q.id);
      }
      saveLocalState();
      renderCurrentQuestion();
    });

    // Notes auto-save
    dom.notesInput.addEventListener('input', (e) => {
      const q = state.filteredQuestions[state.currentIndex];
      if (!q) return;

      state.notes[q.id] = e.target.value;
      saveLocalState();
    });

    // Drawer toggle
    dom.btnToggleDrawer.addEventListener('click', toggleDrawer);
    dom.btnCloseDrawer.addEventListener('click', closeDrawer);
    dom.drawerBackdrop.addEventListener('click', closeDrawer);

    // Jump to Question
    const handleJump = () => {
      const val = parseInt(dom.jumpInput.value, 10);
      if (val >= 1 && val <= state.questions.length) {
        const targetIdx = state.filteredQuestions.findIndex(q => q.id === val);
        if (targetIdx !== -1) {
          state.currentIndex = targetIdx;
          saveLocalState();
          renderCurrentQuestion();
          dom.jumpInput.value = '';
          if (window.innerWidth <= 768) closeDrawer();
        } else {
          alert(`Question #${val} is not in the current filtered view.`);
        }
      }
    };
    dom.jumpBtn.addEventListener('click', handleJump);
    dom.jumpInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleJump();
    });

    // Filter Chips
    dom.filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        dom.filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.filter = chip.getAttribute('data-filter');
        applyFiltersAndSearch();
        renderCurrentQuestion();
      });
    });

    // Search
    dom.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      applyFiltersAndSearch();
      renderCurrentQuestion();
    });

    // Hero buttons
    dom.btnHeroStart.addEventListener('click', () => {
      dom.landingBanner.classList.add('hidden');
      dom.questionView.classList.remove('hidden');
      state.currentIndex = 0;
      renderCurrentQuestion();
    });
    dom.btnHeroContinue.addEventListener('click', () => {
      dom.landingBanner.classList.add('hidden');
      dom.questionView.classList.remove('hidden');
      renderCurrentQuestion();
    });

    // Stats modal
    dom.btnStats.addEventListener('click', openStats);
    dom.btnCloseStats.addEventListener('click', closeStats);
    dom.statsModal.addEventListener('click', (e) => {
      if (e.target === dom.statsModal) closeStats();
    });

    // Copy Score Summary
    if (dom.btnCopyStats) {
      dom.btnCopyStats.addEventListener('click', () => {
        const text = `📊 MCQ Study Bank Progress:
• Total Questions: ${dom.statTotal.textContent}
• Attempted: ${dom.statAttempted.textContent}
• Remaining: ${dom.statRemaining.textContent}
• Accuracy: ${dom.statAccuracy.textContent}
• Correct Options: ${dom.statCorrect.textContent}
• Incorrect Options: ${dom.statIncorrect.textContent}
• Bookmarked: ${dom.statBookmarked.textContent}`;

        navigator.clipboard.writeText(text).then(() => {
          const orig = dom.btnCopyStats.textContent;
          dom.btnCopyStats.textContent = '✓ Copied to Clipboard!';
          setTimeout(() => {
            dom.btnCopyStats.textContent = orig;
          }, 2000);
        }).catch(() => {
          alert(text);
        });
      });
    }

    // Reset Progress
    dom.btnResetProgress.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all progress, bookmarks, and notes?')) {
        localStorage.clear();
        state.userAnswers = {};
        state.submittedState = {};
        state.bookmarks = new Set();
        state.notes = {};
        state.visited = new Set();
        state.currentIndex = 0;
        
        closeStats();
        applyFiltersAndSearch();
        renderCurrentQuestion();
      }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Don't trigger if typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        dom.btnPrev.click();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        dom.btnNext.click();
      } else if (e.key.toLowerCase() === 'b') {
        dom.btnBookmark.click();
      } else if (e.key === '/') {
        e.preventDefault();
        dom.searchInput.focus();
      } else if (e.key === 'Enter') {
        if (!dom.btnSubmit.classList.contains('hidden')) {
          dom.btnSubmit.click();
        }
      }
    });
  }

  // --- START APP ---
  document.addEventListener('DOMContentLoaded', init);

})();
