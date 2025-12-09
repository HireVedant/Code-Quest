//tracking changes in values over time
let currentLevel = 1;
let currentXP = 0;
let requiredXP = 100;
let currentLang = 'html';
let projects = [];

//Document object model(DOM) elements showing everything in tree structure 
const htmlEditor = document.getElementById('htmlEditor');
const cssEditor = document.getElementById('cssEditor');
const jsEditor = document.getElementById('jsEditor');
const previewFrame = document.getElementById('previewFrame');
const consoleOutput = document.getElementById('consoleOutput');
const tabs = document.querySelectorAll('.tab');
const editors = document.querySelectorAll('.code-editor');

const runBtn = document.getElementById('runBtn');
const clearBtn = document.getElementById('clearBtn');
const beautifyBtn = document.getElementById('beautifyBtn');
const saveBtn = document.getElementById('saveBtn');
const endSessionBtn = document.getElementById('endSessionBtn');
const clearPreviewBtn = document.getElementById('clearPreviewBtn');
const clearConsoleBtn = document.getElementById('clearConsoleBtn');

const levelDisplay = document.getElementById('levelDisplay');
const currentXPDisplay = document.getElementById('currentXP');
const requiredXPDisplay = document.getElementById('requiredXP');
const xpBar = document.getElementById('xpBar');
const projectsList = document.getElementById('projectsList');

//starting program with already saved data
function init() {
    loadProgress();
    loadProjects();
    updateUI();
}

function loadProgress() {
    const savedLevel = localStorage.getItem('codequest_level');
    const savedXP = localStorage.getItem('codequest_xp');
    
    if (savedLevel) currentLevel = parseInt(savedLevel);
    if (savedXP) currentXP = parseInt(savedXP);
    
    requiredXP = currentLevel * 100;
}

function loadProjects() {
    const savedProjects = localStorage.getItem('codequest_projects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
        renderProjects();
    }
}

function saveProgress() {
    localStorage.setItem('codequest_level', currentLevel);
    localStorage.setItem('codequest_xp', currentXP);
}

function saveProjects() {
    localStorage.setItem('codequest_projects', JSON.stringify(projects));
}

//switching tabs between html,css,javascript
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const lang = tab.getAttribute('data-lang');
        switchTab(lang);
    });
});

function switchTab(lang) {
    currentLang = lang;
    
    // Updating tab styles
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    // Updating editor visibility
    editors.forEach(e => e.classList.remove('active'));
    document.getElementById(`${lang}Editor`).classList.add('active');
}

//running code - on successful running give XP
runBtn.addEventListener('click', () => {
    const html = htmlEditor.value;
    const css = cssEditor.value;
    const js = jsEditor.value;
    
    // Clearing console
    consoleOutput.innerHTML = '<p class="console-info">Running code...</p>';
    
    // Building complete HTML document
    const fullCode = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>
                // Intercept console methods
                (function() {
                    const originalLog = console.log;
                    const originalError = console.error;
                    const originalWarn = console.warn;
                    
                    console.log = function(...args) {
                        window.parent.postMessage({type: 'log', message: args.join(' ')}, '*');
                        originalLog.apply(console, args);
                    };
                    
                    console.error = function(...args) {
                        window.parent.postMessage({type: 'error', message: args.join(' ')}, '*');
                        originalError.apply(console, args);
                    };
                    
                    console.warn = function(...args) {
                        window.parent.postMessage({type: 'warn', message: args.join(' ')}, '*');
                        originalWarn.apply(console, args);
                    };
                    
                    // Catch runtime errors
                    window.onerror = function(msg, url, line, col, error) {
                        window.parent.postMessage({
                            type: 'error', 
                            message: 'Error: ' + msg + ' (Line ' + line + ')'
                        }, '*');
                        return false;
                    };
                })();
                
                // User code
                try {
                    ${js}
                } catch(e) {
                    window.parent.postMessage({type: 'error', message: e.toString()}, '*');
                }
            <\/script>
        </body>
        </html>
    `;
    
    // Injecting into iframe
    const iframe = previewFrame;
    iframe.srcdoc = fullCode;
    
    // Award XP on successful execution of code without errors
    let hasError = false;
    
    // Listening to console messages from iframe
    window.addEventListener('message', (event) => {
        if (event.data.type === 'error') {
            hasError = true;
            addConsoleMessage(event.data.message, 'error');
        } else if (event.data.type === 'log') {
            addConsoleMessage(event.data.message, 'log');
        } else if (event.data.type === 'warn') {
            addConsoleMessage(event.data.message, 'warn');
        }
    });
    
    // Award XP after short delay (allow error detection)
    setTimeout(() => {
        if (!hasError && (html.trim() || css.trim() || js.trim())) {
            addXP(20);
            addConsoleMessage('✅ Code executed successfully! +20 XP', 'log');
        } else if (hasError) {
            addConsoleMessage('❌ Errors detected. Fix them to earn XP.', 'error');
        }
    }, 500);
});

//outputs
function addConsoleMessage(message, type) {
    const p = document.createElement('p');
    p.className = `console-${type}`;
    p.textContent = message;
    consoleOutput.appendChild(p);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

clearConsoleBtn.addEventListener('click', () => {
    consoleOutput.innerHTML = '<p class="console-info">Console cleared.</p>';
});

//XP - Leveling System

function addXP(amount) {
    currentXP += amount;
    
    // Checking for level up
    while (currentXP >= requiredXP) {
        currentXP -= requiredXP;
        currentLevel++;
        requiredXP = currentLevel * 100;
        showLevelUpNotification();
    }
    
    saveProgress();
    updateUI();
}

function showLevelUpNotification() {
    addConsoleMessage(`🎉 LEVEL UP! You are now Level ${currentLevel}!`, 'log');
}

function updateUI() {
    levelDisplay.textContent = currentLevel;
    currentXPDisplay.textContent = currentXP;
    requiredXPDisplay.textContent = requiredXP;
    
    const percentage = (currentXP / requiredXP) * 100;
    xpBar.style.width = percentage + '%';
}

//clear button to clear currently written code and output 
clearBtn.addEventListener('click', () => {
    const activeEditor = document.querySelector('.code-editor.active');
    if (activeEditor) {
        activeEditor.value = '';
        addConsoleMessage(`${currentLang.toUpperCase()} editor cleared.`, 'log');
    }
});

//beautify button to make text arrangement more better
beautifyBtn.addEventListener('click', () => {
    const activeEditor = document.querySelector('.code-editor.active');
    if (!activeEditor || !activeEditor.value.trim()) {
        addConsoleMessage('No code to beautify.', 'warn');
        return;
    }
    
    let code = activeEditor.value;
    
    if (currentLang === 'html') {
        code = beautifyHTML(code);
    } else if (currentLang === 'css') {
        code = beautifyCSS(code);
    } else if (currentLang === 'js') {
        code = beautifyJS(code);
    }
    
    activeEditor.value = code;
    addConsoleMessage(`${currentLang.toUpperCase()} code beautified.`, 'log');
});

//HTML beautifier
function beautifyHTML(html) {
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    
    html.split(/>\s*</).forEach((node) => {
        if (node.match(/^\/\w/)) indent--;
        formatted += tab.repeat(indent > 0 ? indent : 0) + '<' + node + '>\n';
        if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith("input")) indent++;
    });
    
    return formatted.substring(1, formatted.length - 2);
}

//CSS beautifier
function beautifyCSS(css) {
    return css
        .replace(/\s*{\s*/g, ' {\n  ')
        .replace(/;\s*/g, ';\n  ')
        .replace(/\s*}\s*/g, '\n}\n\n');
}

//JS beautifier
function beautifyJS(js) {
    return js
        .replace(/{\s*/g, ' {\n  ')
        .replace(/;\s*/g, ';\n  ')
        .replace(/}\s*/g, '\n}\n');
}

//saving project
saveBtn.addEventListener('click', () => {
    const html = htmlEditor.value;
    const css = cssEditor.value;
    const js = jsEditor.value;
    
    if (!html.trim() && !css.trim() && !js.trim()) {
        addConsoleMessage('Cannot save empty project.', 'warn');
        return;
    }
    
    const projectName = prompt('Enter project name:', `Project ${projects.length + 1}`);
    if (!projectName) return;
    
    const project = {
        id: Date.now(),
        name: projectName,
        html: html,
        css: css,
        js: js,
        preview: html.substring(0, 100) // Short preview
    };
    
    projects.push(project);
    saveProjects();
    renderProjects();
    addConsoleMessage(`Project "${projectName}" saved successfully!`, 'log');
});

//show saved projects on screen
function renderProjects() {
    if (projects.length === 0) {
        projectsList.innerHTML = '<p class="no-projects">No saved projects yet. Click Save to create one!</p>';
        return;
    }
    
    projectsList.innerHTML = '';
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        card.innerHTML = `
            <div class="project-name">${project.name}</div>
            <div class="project-preview">${project.preview || 'No preview'}</div>
            <div class="project-actions">
                <button class="btn-load" onclick="loadProject(${project.id})">Load</button>
                <button class="btn-delete" onclick="deleteProject(${project.id})">Delete</button>
            </div>
        `;
        
        projectsList.appendChild(card);
    });
}

// Loading project into editors
function loadProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    htmlEditor.value = project.html;
    cssEditor.value = project.css;
    jsEditor.value = project.js;
    
    addConsoleMessage(`Project "${project.name}" loaded.`, 'log');
}

// Deleting project
function deleteProject(id) {
    if (!confirm('Delete this project?')) return;
    
    projects = projects.filter(p => p.id !== id);
    saveProjects();
    renderProjects();
    addConsoleMessage('Project deleted.', 'log');
}

//End Session - resets everything
endSessionBtn.addEventListener('click', () => {
    if (!confirm('End session? This will reset your XP and level.')) return;
    
    currentLevel = 1;
    currentXP = 0;
    requiredXP = 100;
    
    htmlEditor.value = '';
    cssEditor.value = '';
    jsEditor.value = '';
    
    localStorage.removeItem('codequest_level');
    localStorage.removeItem('codequest_xp');
    
    saveProgress();
    updateUI();
    
    consoleOutput.innerHTML = '<p class="console-info">Session ended. Progress reset.</p>';
});

// Clearing preview frame
clearPreviewBtn.addEventListener('click', () => {
    previewFrame.srcdoc = '';
    addConsoleMessage('Preview cleared.', 'log');
});

//starting application
init();

