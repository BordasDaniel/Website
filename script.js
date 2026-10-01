document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide SVG Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Loads the content data without changing the page's existing visual structure.
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error(`Could not load data.json (${response.status})`);
            return response.json();
        })
        .then(data => {
            window.portfolioProjects = data.selectedProjects;
            renderSkills(data.skills);
            renderWorkExperience(data.workExperience);
            renderProjects(data.selectedProjects);
            setupSkillFilters();
            setupProjectButtons();
        })
        .catch(error => {
            console.error('Error loading portfolio data:', error);
        });

    function renderSkills(skills) {
        const skillsSection = document.getElementById('skills');
        const filterContainer = skillsSection.querySelector('.flex.flex-wrap.gap-2.mb-10');
        const skillsGrid = skillsSection.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');

        filterContainer.innerHTML = skills.filters.map((filter, index) => `
            <button class="skill-filter-btn ${index === 0 ? 'active bg-white text-black font-semibold' : 'border border-neutral-800 text-neutral-400 hover:text-white'} px-4 py-2 rounded" data-filter="${filter.id}">${filter.label}</button>
        `).join('');

        const midpoint = Math.ceil(skills.items.length / 2);
        const columns = [skills.items.slice(0, midpoint), skills.items.slice(midpoint)];
        skillsGrid.innerHTML = columns.map(items => `
            <div class="divide-y divide-neutral-900 border-t border-b border-neutral-900">
                ${items.map(skill => `
                    <div class="skill-item py-6 flex justify-between items-center group" data-category="${skill.category}">
                        <span class="text-neutral-200 group-hover:text-white group-hover:translate-x-1 transition-all">${skill.name}</span>
                        <span class="font-mono text-xs text-neutral-500 group-hover:text-neutral-300">${skill.label}</span>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    function renderWorkExperience(entries) {
        const experienceGrid = document.querySelector('#experience .space-y-16');
        experienceGrid.innerHTML = entries.map(entry => `
            <div class="pt-8 border-t border-neutral-900 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div class="lg:col-span-5">
                    <h3 class="text-2xl md:text-3xl font-medium text-white mb-2">${entry.position}</h3>
                    <p class="text-neutral-400 text-sm mb-1">${entry.company}</p>
                    <p class="text-neutral-500 font-mono text-xs">${entry.location}</p>
                </div>
                <div class="lg:col-span-3 font-mono text-xs text-neutral-400 tracking-wider">${entry.period}</div>
                <div class="lg:col-span-4 space-y-4">
                    <p class="text-neutral-300 text-sm leading-relaxed font-light">${entry.description}</p>
                    <div class="flex flex-wrap gap-2 pt-2">
                        ${entry.technologies.map(technology => `<span class="px-3 py-1 rounded-full border border-neutral-800 text-[11px] font-mono text-neutral-400 bg-neutral-950">${technology}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderProjects(projects) {
        const projectsGrid = document.querySelector('#projects .grid.grid-cols-1.md\\:grid-cols-2');
        projectsGrid.innerHTML = projects.map(project => `
            <div class="group relative rounded border border-neutral-800 bg-neutral-950 overflow-hidden flex flex-col justify-between p-6 hover:border-neutral-600 transition-all">
                <div>
                    <div class="flex justify-between items-center font-mono text-xs text-neutral-500 mb-6">
                        <span>${String(project.number).padStart(2, '0')} // ${project.type}</span>
                        <span class="${project.number === 1 ? 'text-emerald-400' : 'text-neutral-400'}">${project.status}</span>
                    </div>
                    <h3 class="font-display text-4xl text-white uppercase mb-3 group-hover:text-neutral-200">${project.name}</h3>
                    <p class="text-neutral-400 text-sm mb-6 leading-relaxed font-light">${project.description}</p>
                </div>
                <div>
                    <div class="w-full h-48 rounded bg-neutral-900 border border-neutral-800/80 mb-6 flex items-center justify-center p-4 overflow-hidden relative group-hover:border-neutral-700 transition-colors">
                        <div class="font-mono text-xs text-neutral-500 text-center">
                            <i data-lucide="${project.number === 1 ? 'layout-dashboard' : 'code-2'}" class="w-10 h-10 mx-auto mb-2 text-neutral-600 group-hover:text-white transition-colors"></i>
                            <span>[ ${project.visualLabel} ]</span>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2 mb-6 font-mono text-[11px] text-neutral-400">
                        ${project.technologies.map(technology => `<span class="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800">${technology}</span>`).join('')}
                    </div>
                    <div class="flex items-center justify-between border-t border-neutral-900 pt-4 font-mono text-xs">
                        <button class="project-details-btn text-white hover:underline flex items-center gap-1" data-project-number="${project.number}">
                            Details &amp; Architecture <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </button>
                        <a href="${project.githubUrl}" target="_blank" rel="noopener" class="text-neutral-500 hover:text-white flex items-center gap-1">
                            Code <i data-lucide="github" class="w-3.5 h-3.5"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        if (window.lucide) lucide.createIcons();
    }

    function setupSkillFilters() {
        const filterBtns = document.querySelectorAll('.skill-filter-btn');
        const skillItems = document.querySelectorAll('.skill-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(filterButton => {
                    filterButton.classList.remove('bg-white', 'text-black', 'font-semibold');
                    filterButton.classList.add('border', 'border-neutral-800', 'text-neutral-400');
                });
                btn.classList.add('bg-white', 'text-black', 'font-semibold');
                btn.classList.remove('border', 'border-neutral-800', 'text-neutral-400');

                const category = btn.getAttribute('data-filter');
                skillItems.forEach(item => {
                    item.style.display = category === 'all' || item.getAttribute('data-category') === category ? 'flex' : 'none';
                });
            });
        });
    }

    function setupProjectButtons() {
        document.querySelectorAll('.project-details-btn').forEach(button => {
            button.addEventListener('click', () => {
                const project = window.portfolioProjects.find(item => String(item.number) === button.dataset.projectNumber);
                if (!project) return;
                openProjectModal(project.name, project.details, project.detailsTechnologies, project.githubUrl, project.liveUrl);
            });
        });
    }


    // Sets availability indicator based on current time (8 AM - 8 PM)
    const availableIndicator = document.getElementById('available');
    if (availableIndicator) {
        const currentHour = new Date().getHours();
        if (currentHour >= 8 && currentHour < 20) {
            availableIndicator.classList.add('bg-emerald-500');
        } else {
            availableIndicator.classList.add('bg-neutral-500');
        }
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

    // Reveal each section once as it enters the viewport.
    const revealObserver = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-revealed');
            observerInstance.unobserve(entry.target);
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.08
    });

    sections.forEach(section => {
        section.classList.add('section-reveal');
        revealObserver.observe(section);
    });

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
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const contactTerminal = document.getElementById('contactTerminal');
    const terminalStatus = document.getElementById('terminalStatus');
    const terminalChoices = document.querySelectorAll('.terminal-choice');

    function openDrawer() {
        if (!contactDrawer) return;
        contactDrawer.classList.remove('hidden');
        contactDrawer.classList.add('flex');
    }
    function closeDrawer() {
        if (!contactDrawer) return;
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
            '1': 'mailto:bordas.daniel0124@gmail.com',
            '2': 'https://www.linkedin.com/in/bordasdaniel0124/',
            '3': 'https://github.com/BordasDaniel'
        };

        const labels = {
            '1': 'Mail',
            '2': 'LinkedIn',
            '3': 'GitHub'
        };

        if (optionMap[key]) {
            event.preventDefault();
            triggerContactAction(optionMap[key], labels[key]);
        }
    });

    showTerminal();

    const terminalModal = document.getElementById('terminalModal');
    const openTerminalBtn = document.getElementById('openTerminalBtn');
    const terminalForm = document.getElementById('terminalForm');
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');

    if (openTerminalBtn) {
        openTerminalBtn.addEventListener('click', () => {
            terminalModal.classList.remove('hidden', 'closing');
            terminalModal.classList.add('flex');
            requestAnimationFrame(() => {
                terminalModal.classList.add('is-visible');
                terminalInput.focus();
            });
        });
    }

    window.closeTerminal = function() {
        if (terminalModal.classList.contains('closing')) return;

        terminalModal.classList.remove('is-visible');
        terminalModal.classList.add('closing');

        setTimeout(() => {
            terminalModal.classList.add('hidden');
            terminalModal.classList.remove('flex', 'closing');
        }, 460);
    };

    // CLI Commands Logic
    terminalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';

        // Echo command
        appendTerminalLine(`daniel@portfolio:~$ ${cmd}`, 'text-amber-300');

        switch(cmd) {
            case 'help':
                appendTerminalLine('Available commands: skills, projects, contact, hire, fastfetch, sudo, python, pacman, yay, cmd, terminal, vim, ls, cd, git, npm, docker, rm, coffee, clear, exit', 'text-neutral-400');
                break;
            case 'fastfetch':
                appendTerminalFastfetch();
                break;
            case 'sudo':
                appendTerminalLine("sudo: don't even think about it.", 'text-red-400');
                break;
            case 'python':
                appendTerminalLine('ssssssssss... Python has entered the chat.', 'text-amber-300');
                break;
            case 'pacman':
            case 'yay':
                appendTerminalLine('No thank you. My packages are fine.', 'text-emerald-400');
                break;
            case 'cmd':
            case 'terminal':
                appendTerminalLine('You need more than one terminal?', 'text-neutral-300');
                break;
            case 'vim':
                appendTerminalLine("That's what I'm saying: why do we need our mouses for coding? Right?", 'text-cyan-300');
                break;
            case 'ls':
                appendTerminalLine('about/  skills/  experience/  projects/  contact/  definitely-not-secrets.txt', 'text-neutral-300');
                break;
            case 'cd':
                appendTerminalLine('bash: cd: reality: No such file or directory', 'text-red-400');
                break;
            case 'git':
            case 'git status':
                appendTerminalLine('On branch main', 'text-neutral-300');
                appendTerminalLine('Your portfolio is ahead of its impostor syndrome by 42 commits.', 'text-emerald-400');
                break;
            case 'npm':
            case 'npm install':
                appendTerminalLine('added 847 packages, audited 847 packages in 2.4s', 'text-neutral-300');
                appendTerminalLine('found 0 vulnerabilities and 1 existential crisis.', 'text-amber-300');
                break;
            case 'docker':
                appendTerminalLine('It works on my machine. Ship the machine.', 'text-cyan-300');
                break;
            case 'rm':
            case 'rm -rf /':
                appendTerminalLine('Nice try. This portfolio has backups.', 'text-red-400');
                break;
            case 'coffee':
                appendTerminalLine('Brewing developer fuel... done. Now shipping.', 'text-amber-300');
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
                appendTerminalLine('Email: bordas.daniel0124@gmail.com', 'text-emerald-400');
                appendTerminalLine('Location: Miskolc, Hungary (Open to Remote)', 'text-emerald-400');
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

    function appendTerminalFastfetch() {
        const wrapper = document.createElement('div');
        wrapper.className = 'grid grid-cols-[auto_1fr] gap-5 items-start text-[11px] leading-relaxed';

        const art = document.createElement('pre');
        art.className = 'text-emerald-400 font-bold leading-tight';
        art.textContent = `    /\\_/\\
   ( o.o )
    > ^ <
  portfolio`; 

        const details = document.createElement('div');
        details.className = 'text-neutral-300';
        details.innerHTML = `
            <p><span class="text-emerald-400">OS</span>        Portfolio Linux</p>
            <p><span class="text-emerald-400">Host</span>      Daniel Bordas Portfolio</p>
            <p><span class="text-emerald-400">Kernel</span>    HTML5 / CSS / JavaScript</p>
            <p><span class="text-emerald-400">Uptime</span>    Since the first line of code</p>
            <p><span class="text-emerald-400">Shell</span>     daniel@portfolio:~$</p>
            <p><span class="text-emerald-400">Theme</span>     Dark editorial / terminal</p>
        `;

        wrapper.append(art, details);
        terminalOutput.appendChild(wrapper);
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
