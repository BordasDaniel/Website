document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide SVG Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Setup IntersectionObserver for sticky side nav active tracking
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.side-nav-item');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    if (item.getAttribute('data-section') === sectionId) {
                        item.classList.add('text-white', 'font-semibold');
                        item.classList.remove('text-neutral-500');
                        const dot = item.querySelector('.border-nav-dot');
                        if (dot) dot.classList.add('bg-white');
                    } else {
                        item.classList.remove('text-white', 'font-semibold');
                        item.classList.add('text-neutral-500');
                        const dot = item.querySelector('.border-nav-dot');
                        if (dot) dot.classList.remove('bg-white');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Skills filter functionality
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillItems = document.querySelectorAll('.skill-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-white', 'text-black', 'font-semibold');
                b.classList.add('border', 'border-neutral-800', 'text-neutral-400');
            });
            btn.classList.add('bg-white', 'text-black', 'font-semibold');
            btn.classList.remove('border', 'border-neutral-800', 'text-neutral-400');

            const category = btn.getAttribute('data-filter');

            skillItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const contactDrawer = document.getElementById('contactDrawer');
    const openDrawerBtn = document.getElementById('openContactDrawerBtn');
    const quickContactBtn = document.getElementById('quickContactBtn');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const contactTerminal = document.getElementById('contactTerminal');
    const terminalStatus = document.getElementById('terminalStatus');
    const terminalChoices = document.querySelectorAll('.terminal-choice');

    function openDrawer() {
        contactDrawer.classList.remove('hidden');
        contactDrawer.classList.add('flex');
    }
    function closeDrawer() {
        contactDrawer.classList.add('hidden');
        contactDrawer.classList.remove('flex');
    }

    function showTerminal() {
        if (!contactTerminal) return;
        contactTerminal.classList.remove('closing');
        contactTerminal.classList.add('is-visible');
    }

    function hideTerminal() {
        if (!contactTerminal) return;
        contactTerminal.classList.remove('is-visible');
        contactTerminal.classList.add('closing');
    }

    function triggerContactAction(target, label) {
        const statusText = label ? `Opening ${label}...` : 'Launching contact channel...';
        if (terminalStatus) {
            terminalStatus.textContent = statusText;
            terminalStatus.classList.add('visible');
        }

        setTimeout(() => {
            if (target.startsWith('mailto:')) {
                window.location.href = target;
                return;
            }
            if (target.startsWith('http')) {
                window.open(target, '_blank', 'noopener,noreferrer');
                return;
            }
            if (target === '#contact' || target === '#open-form') {
                openDrawer();
                return;
            }
            hideTerminal();
        }, 260);
    }

    if (openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
    if (quickContactBtn) quickContactBtn.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);

    terminalChoices.forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.dataset.target || '#contact';
            const label = button.dataset.label || 'Contact';
            triggerContactAction(target, label);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (!contactTerminal || contactTerminal.classList.contains('closing')) return;

        const key = event.key;
        const optionMap = {
            '1': 'mailto:alex.kovacs.dev@gmail.com',
            '2': 'https://linkedin.com',
            '3': 'https://github.com',
            '4': '#contact'
        };

        const labels = {
            '1': 'Mail',
            '2': 'LinkedIn',
            '3': 'GitHub',
            '4': 'Message Form'
        };

        if (optionMap[key]) {
            event.preventDefault();
            triggerContactAction(optionMap[key], labels[key]);
        }
    });

    showTerminal();

    // Handle Contact Form Submit
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! Your message has been sent successfully. Alex will get back to you soon.');
        contactForm.reset();
        closeDrawer();
    });

    const terminalModal = document.getElementById('terminalModal');
    const openTerminalBtn = document.getElementById('openTerminalBtn');
    const terminalForm = document.getElementById('terminalForm');
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');

    if (openTerminalBtn) {
        openTerminalBtn.addEventListener('click', () => {
            terminalModal.classList.remove('hidden');
            terminalModal.classList.add('flex');
            terminalInput.focus();
        });
    }

    window.closeTerminal = function() {
        terminalModal.classList.add('hidden');
        terminalModal.classList.remove('flex');
    };

    // CLI Commands Logic
    terminalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';

        // Echo command
        appendTerminalLine(`alex@portfolio:~$ ${cmd}`, 'text-amber-300');

        switch(cmd) {
            case 'help':
                appendTerminalLine('Available commands: skills, projects, contact, hire, clear, exit', 'text-neutral-400');
                break;
            case 'skills':
                appendTerminalLine('Frontend: React, Next.js, TypeScript, Tailwind CSS, JavaScript ES6+', 'text-neutral-300');
                appendTerminalLine('Backend: Node.js, Express, PostgreSQL, REST APIs, Git, Docker', 'text-neutral-300');
                break;
            case 'projects':
                appendTerminalLine('1. DevPulse Dashboard - Developer metrics tool', 'text-neutral-300');
                appendTerminalLine('2. CodeFlow Canvas - Realtime socket code editor', 'text-neutral-300');
                break;
            case 'contact':
            case 'hire':
                appendTerminalLine('Email: alex.kovacs.dev@gmail.com', 'text-emerald-400');
                appendTerminalLine('Location: Budapest, Hungary (Open to Remote)', 'text-emerald-400');
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                break;
            case 'exit':
                closeTerminal();
                break;
            default:
                appendTerminalLine(`Command not found: ${cmd}. Type 'help' for available options.`, 'text-red-400');
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    });

    function appendTerminalLine(text, className = '') {
        const p = document.createElement('p');
        p.className = className;
        p.textContent = text;
        terminalOutput.appendChild(p);
    }
});

function showSkillDetail(title, desc) {
    const toast = document.getElementById('skillToast');
    document.getElementById('toastSkillTitle').textContent = title;
    document.getElementById('toastSkillDesc').textContent = desc;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 5000);
}

function closeSkillToast() {
    document.getElementById('skillToast').classList.add('hidden');
}

function openProjectModal(title, desc, stackArray, githubUrl, liveUrl) {
    const modal = document.getElementById('projectModal');
    document.getElementById('modalProjectTitle').textContent = title;
    document.getElementById('modalProjectDesc').textContent = desc;

    const stackContainer = document.getElementById('modalProjectStack');
    stackContainer.innerHTML = '';
    stackArray.forEach(tech => {
        const badge = document.createElement('span');
        badge.className = 'px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300';
        badge.textContent = tech;
        stackContainer.appendChild(badge);
    });

    document.getElementById('modalGithubLink').href = githubUrl || '#';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}
