/**
 * Paridhi Sharma - Portfolio Interactive Engine
 * Pure Vanilla JavaScript for high performance, smooth interactions, and micro-animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initTypingEffect();
  initScrollSpy();
  initSkillObserver();
  initSkillFilter();
  initCTerminal();
  initContactForm();
  initCopyEmail();
  initModals();
  initBackToTop();
});

/* ==========================================================================
   Theme Toggle (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('paridhi_portfolio_theme') || (prefersDark ? 'dark' : 'dark');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('paridhi_portfolio_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast('Theme Changed', `Switched to ${newTheme} mode.`);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle-btn i');
  if (icon) {
    if (theme === 'light') {
      icon.className = 'fa-solid fa-moon';
      icon.setAttribute('title', 'Switch to Dark Mode');
    } else {
      icon.className = 'fa-solid fa-sun';
      icon.setAttribute('title', 'Switch to Light Mode');
    }
  }
}

/* ==========================================================================
   Navbar & Mobile Navigation
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  // Sticky Navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburgerBtn.classList.toggle('open');
      const isOpen = navLinks.classList.contains('active');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on clicking any link
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburgerBtn.classList.remove('open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburgerBtn.classList.remove('open');
      }
    });
  }
}

/* ==========================================================================
   Typing Effect in Hero
   ========================================================================== */
function initTypingEffect() {
  const typedTarget = document.getElementById('typed-text');
  if (!typedTarget) return;

  const phrases = [
    'First-Year B.Tech CSE Student',
    'C Programming Specialist',
    'JECRC University, Jaipur',
    'Algorithmic Problem Solver',
    'Aspiring Software Engineer'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTarget.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typedTarget.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1800; // Pause at full phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 450; // Pause before new phrase
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   ScrollSpy for Navigation Links
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Skill Progress Animation (Intersection Observer)
   ========================================================================== */
function initSkillObserver() {
  const skillBars = document.querySelectorAll('.skill-progress-fill');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width') || '0%';
        bar.style.width = targetWidth;
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.25 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   Skill Filter Navigation
   ========================================================================== */
function initSkillFilter() {
  const filterBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Interactive C Code Terminal (About Section)
   ========================================================================== */
function initCTerminal() {
  const runBtn = document.getElementById('run-c-code-btn');
  const outputContainer = document.getElementById('terminal-output');
  if (!runBtn || !outputContainer) return;

  runBtn.addEventListener('click', () => {
    runBtn.disabled = true;
    runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Compiling...';
    outputContainer.innerHTML = '<span style="color:#94a3b8;">$ gcc main.c -o main && ./main</span><br/><span style="color:#fbbf24;">Compiling with GCC 13.2.0...</span>';

    setTimeout(() => {
      const outputLines = [
        '<span style="color:#94a3b8;">$ ./main</span>',
        '-------------------------------------------',
        '<span style="color:#00f2fe; font-weight:600;">Hello, World! 👋</span>',
        'I am <strong style="color:#f8fafc;">Paridhi Sharma</strong>.',
        '🎓 1st Year B.Tech CSE @ <span style="color:#818cf8;">JECRC University, Jaipur</span>.',
        '⚡ Core Skill: <strong style="color:#38bdf8;">C Programming Language</strong> (Memory, Pointers & Logic).',
        '🚀 Status: Actively building algorithms & systems.',
        '-------------------------------------------',
        '<span class="out-success">✔ Process returned 0 (0x0) | Execution time: 0.042 s</span>'
      ];

      outputContainer.innerHTML = outputLines.join('<br/>');
      runBtn.disabled = false;
      runBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Re-Run Code';
      showToast('C Program Executed', 'gcc compiled and ran main.c successfully (exit code 0).');
    }, 900);
  });
}

/* ==========================================================================
   Email Copy Action
   ========================================================================== */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  const email = 'paridhis2280@gmail.com';

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(email);
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        btn.style.color = '#34d399';
        showToast('Email Copied', `${email} copied to clipboard!`);

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.color = '';
        }, 2500);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Email Copied', `${email} copied to clipboard!`);
      }
    });
  });
}

/* ==========================================================================
   Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit-btn');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showToast('Missing Fields', 'Please complete all required fields.', 'error');
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';

      // Show toast
      showToast(
        'Message Prepared!',
        `Thank you ${name}! Opening mail client to send to paridhis2280@gmail.com.`
      );

      // Trigger mailto link with encoded content
      const mailtoUrl = `mailto:paridhis2280@gmail.com?subject=${encodeURIComponent(
        `[Portfolio] ${subject} - from ${name}`
      )}&body=${encodeURIComponent(
        `Hello Paridhi,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent from your portfolio website.`
      )}`;

      window.location.href = mailtoUrl;

      // Reset form
      form.reset();
    }, 1000);
  });
}

/* ==========================================================================
   Project & Resume Modals
   ========================================================================== */
const projectData = {
  'student-system': {
    title: 'Student Record Management System in C',
    category: 'Core C Programming & File Systems',
    tags: ['C Language', 'Binary File I/O', 'Structs', 'Dynamic Memory', 'CLI'],
    description: 'A comprehensive, modular terminal application developed in C to manage university student academic records with persistent storage.',
    features: [
      'Built with custom C struct models containing student ID, name, batch, semester, and GPA.',
      'Binary file serialization utilizing fread() and fwrite() for persistent, fast storage.',
      'CRUD functionality: Create new record, Search by Roll Number/Name, Update existing records, Delete records, and Display formatted grade books.',
      'Data validation to prevent duplicate IDs and ensure numeric integrity of marks.'
    ],
    codeSnippet: `// Structure definition in C
typedef struct {
    int roll_no;
    char name[50];
    char department[30];
    float cgpa;
} Student;

void add_student(FILE *fp) {
    Student s;
    printf("Enter Roll No: ");
    scanf("%d", &s.roll_no);
    printf("Enter Name: ");
    scanf(" %[^\\n]s", s.name);
    printf("Enter CGPA: ");
    scanf("%f", &s.cgpa);
    
    fseek(fp, 0, SEEK_END);
    fwrite(&s, sizeof(Student), 1, fp);
    printf("Record saved successfully!\\n");
}`
  },
  'tic-tac-toe': {
    title: 'Interactive Terminal Tic-Tac-Toe & Game Engine',
    category: 'Algorithm & Matrix Logic in C',
    tags: ['C Language', '2D Arrays', 'Game Logic', 'Matrix Algorithms'],
    description: 'An interactive command-line Tic-Tac-Toe game featuring two-player local mode and an AI opponent based on minimax matrix evaluation.',
    features: [
      'Employs a 3x3 2D char array to manage and render the dynamic game grid with terminal refresh.',
      'Comprehensive win-checking algorithm evaluating rows, columns, and primary/secondary diagonals in O(1) time.',
      'Turn alternation system, input validation preventing overwriting chosen cells, and draw-detection logic.',
      'Clean ASCII UI with colored symbols and score tally across multiple rounds.'
    ],
    codeSnippet: `// Grid & Win Detection logic snippet
char board[3][3];

int check_winner() {
    for (int i = 0; i < 3; i++) {
        // Check rows & columns
        if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != ' ') return 1;
        if (board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != ' ') return 1;
    }
    // Check diagonals
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != ' ') return 1;
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != ' ') return 1;
    return 0;
}`
  },
  'bank-simulator': {
    title: 'ATM & Banking Simulation Console in C',
    category: 'Security Logic & File Handling in C',
    tags: ['C Language', 'Authentication', 'Transaction Logging', 'File Handling'],
    description: 'A realistic ATM banking system console program simulating secure customer transactions and audit logs.',
    features: [
      'PIN authentication logic with maximum retry limits to prevent brute-force entries.',
      'Transaction processing for deposits, cash withdrawals with balance limits, and account statement display.',
      'File-based audit log recording timestamped transaction history.',
      'Defensive programming safeguards guarding against overflow and negative numeric entries.'
    ],
    codeSnippet: `// Secure transaction handling
int withdraw(Account *acc, double amount) {
    if (amount <= 0) {
        printf("Error: Invalid withdrawal amount.\\n");
        return 0;
    }
    if (acc->balance < amount) {
        printf("Error: Insufficient funds! Current: $%.2f\\n", acc->balance);
        return 0;
    }
    acc->balance -= amount;
    log_transaction(acc->acc_no, "WITHDRAWAL", amount);
    return 1;
}`
  },
  'portfolio-web': {
    title: 'Modern High-Performance Web Portfolio',
    category: 'Web Engineering & UI/UX',
    tags: ['HTML5', 'Vanilla CSS', 'ES6+ JavaScript', 'Glassmorphism', 'Responsive'],
    description: 'A state-of-the-art developer portfolio crafted from scratch featuring obsidian glassmorphism, responsive mobile layouts, dynamic C runner simulation, and accessible resume generator.',
    features: [
      'Engineered with semantic HTML5, zero external framework overhead for ultra-fast performance.',
      'Rich CSS tokens with dark obsidian glassmorphism, glowing micro-interactions, and fluid typography.',
      'Interactive features: Live C terminal simulation, theme switcher, email clipboard copy, and dynamic typing.',
      'Print-ready, ATS-formatted resume with instant download/print capabilities.'
    ],
    codeSnippet: `/* Glassmorphism token implementation */
.glass-card {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
}`
  }
};

function initModals() {
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  // Open Project Details Modal
  const projectDetailBtns = document.querySelectorAll('.open-project-modal');
  projectDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      const data = projectData[projId];

      if (data) {
        modalTitle.innerHTML = `<i class="fa-solid fa-code-commit" style="color:var(--accent-cyan);"></i> ${data.title}`;
        
        let tagsHtml = data.tags.map(t => `<span class="project-tech-tag">${t}</span>`).join(' ');
        let featuresHtml = data.features.map(f => `<li>${f}</li>`).join('');

        modalBody.innerHTML = `
          <div style="margin-bottom:1.2rem;">
            <p style="font-size:1rem; color:var(--text-main); margin-bottom:0.8rem; line-height:1.7;">
              ${data.description}
            </p>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.5rem;">
              ${tagsHtml}
            </div>
            
            <h4 style="font-size:1.05rem; margin-bottom:0.6rem; color:var(--accent-cyan);">Key Architecture & Highlights:</h4>
            <ul class="project-highlights-list" style="margin-bottom:1.5rem;">
              ${featuresHtml}
            </ul>

            <h4 style="font-size:1.05rem; margin-bottom:0.6rem; color:var(--accent-cyan);">Source Code Sneak Peek:</h4>
            <div class="terminal-window" style="border-radius:10px;">
              <div class="terminal-body" style="padding:1rem; font-size:0.82rem;">
                <pre><code>${escapeHtml(data.codeSnippet)}</code></pre>
              </div>
            </div>
          </div>
        `;

        openModal();
      }
    });
  });

  // Open Resume Modal
  const resumeModalBtns = document.querySelectorAll('.open-resume-modal');
  resumeModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalTitle.innerHTML = `<i class="fa-solid fa-file-pdf" style="color:var(--accent-cyan);"></i> Paridhi Sharma - Resume`;
      modalBody.innerHTML = `
        <div style="text-align:center; padding:1rem 0;">
          <h3 style="font-size:1.6rem; margin-bottom:0.4rem;">Paridhi Sharma</h3>
          <p style="color:var(--accent-cyan); font-weight:600; margin-bottom:1rem;">
            1st Year B.Tech CSE @ JECRC University, Jaipur
          </p>
          <p style="max-width:550px; margin:0 auto 1.5rem auto; font-size:0.95rem; color:var(--text-muted);">
            Strong foundation in C programming, low-level memory concepts, data structures, and algorithmic logic.
          </p>

          <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; margin-bottom:1.5rem;">
            <a href="resume.html" target="_blank" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Full Resume
            </a>
            <button onclick="window.open('resume.html', '_blank').print()" class="btn btn-secondary btn-sm">
              <i class="fa-solid fa-print"></i> Print / Save PDF
            </button>
          </div>

          <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:12px; padding:1.2rem; text-align:left;">
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
              <div>
                <small style="color:var(--text-dim); text-transform:uppercase;">Email</small>
                <div style="font-weight:600; color:var(--text-main);">paridhis2280@gmail.com</div>
              </div>
              <div>
                <small style="color:var(--text-dim); text-transform:uppercase;">Education</small>
                <div style="font-weight:600; color:var(--text-main);">B.Tech CSE (2025-2029)</div>
              </div>
              <div>
                <small style="color:var(--text-dim); text-transform:uppercase;">University</small>
                <div style="font-weight:600; color:var(--text-main);">JECRC University, Jaipur</div>
              </div>
              <div>
                <small style="color:var(--text-dim); text-transform:uppercase;">Core Skill</small>
                <div style="font-weight:600; color:var(--text-main);">C Programming Language</div>
              </div>
            </div>
          </div>
        </div>
      `;
      openModal();
    });
  });

  function openModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function escapeHtml(string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ==========================================================================
   Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(title, message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconClass = type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check';
  const iconColor = type === 'error' ? '#ef4444' : '#34d399';

  toast.innerHTML = `
    <i class="fa-solid ${iconClass} toast-icon" style="color:${iconColor};"></i>
    <div class="toast-content">
      <h5>${title}</h5>
      <p>${message}</p>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Trigger slide-in animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 20);

  // Auto remove after 4s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 400);
  }, 4000);
}
