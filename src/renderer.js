// DOM Elements
const inputEditor = document.getElementById('input-editor');
const outputEditor = document.getElementById('output-editor');
const statusIndicator = document.getElementById('status-indicator');
const statusDot = document.querySelector('.status-dot');
const statusText = document.querySelector('.status-text');
const charCount = document.getElementById('char-count');
const conversionTime = document.getElementById('conversion-time');
const lineInfo = document.getElementById('line-info');
const backendStatus = document.getElementById('backend-status');
const saveBtn = document.getElementById('save-btn');
const openBtn = document.getElementById('open-btn');
const guideBtn = document.getElementById('guide-btn');

let debounceTimer;
let currentLatex = '';
let showRendered = true; // Toggle between rendered and code view
const parser = new LaTeXParser();
const toggleBtn = document.getElementById('toggle-view-btn');
const viewMode = document.getElementById('view-mode');

// Set status - no backend needed
backendStatus.textContent = 'Parser: Ready';
backendStatus.classList.add('connected');
backendStatus.style.cursor = 'pointer';
backendStatus.title = 'Click for syntax help';

// Add click handler for syntax help
backendStatus.addEventListener('click', () => {
    alert('LaTeX Parser Syntax Guide:\n\n' +
          'STRUCTURE:\n' +
          '# Heading → \\section{}\n' +
          '## Subheading → \\subsection{}\n' +
          '### Sub-subheading → \\subsubsection{}\n\n' +
          'MATH:\n' +
          'x squared → x²\n' +
          'x cubed → x³\n' +
          'x to the power of n → xⁿ\n' +
          'a over b → a/b (fraction)\n' +
          'square root of x → √x\n' +
          'integral from 0 to 5 of x → ∫₀⁵ x dx\n' +
          'sum from i=1 to n → Σᵢ₌₁ⁿ\n' +
          'derivative of f with respect to x → df/dx\n' +
          'limit as x approaches 0 → lim_{x→0}\n\n' +
          'SYMBOLS:\n' +
          'alpha, beta, gamma, delta, pi, etc.\n' +
          'infinity, not equal to, approximately\n' +
          'for all, there exists\n' +
          'real numbers, integers, rationals\n\n' +
          'ENVIRONMENTS:\n' +
          'Theorem: ... → theorem environment\n' +
          'Proof: ... → proof environment\n' +
          'Equation: ... → numbered equation\n' +
          'End proof / QED → ends proof');
});

// Convert LaTeX to rendered HTML
function renderLatex(latexCode) {
    // Parse the LaTeX document and extract content
    const lines = latexCode.split('\n');
    let html = '';
    let inDocument = false;
    let inTheorem = false;
    let inProof = false;
    let inEquation = false;
    
    for (let line of lines) {
        line = line.trim();
        
        // Skip preamble
        if (line.includes('\\begin{document}')) {
            inDocument = true;
            continue;
        }
        if (line.includes('\\end{document}')) {
            break;
        }
        if (!inDocument) continue;
        
        // Handle empty lines
        if (!line) {
            html += '<br>';
            continue;
        }
        
        // Sections
        if (line.startsWith('\\section{')) {
            const content = line.match(/\\section\{(.*?)\}/)?.[1] || '';
            html += `<h1>${content}</h1>`;
            continue;
        }
        if (line.startsWith('\\subsection{')) {
            const content = line.match(/\\subsection\{(.*?)\}/)?.[1] || '';
            html += `<h2>${content}</h2>`;
            continue;
        }
        if (line.startsWith('\\subsubsection{')) {
            const content = line.match(/\\subsubsection\{(.*?)\}/)?.[1] || '';
            html += `<h3>${content}</h3>`;
            continue;
        }
        
        // Theorem environment
        if (line.includes('\\begin{theorem}')) {
            inTheorem = true;
            html += '<div class="theorem">';
            continue;
        }
        if (line.includes('\\end{theorem}')) {
            inTheorem = false;
            html += '</div>';
            continue;
        }
        
        // Proof environment
        if (line.includes('\\begin{proof}')) {
            inProof = true;
            html += '<div class="proof">';
            continue;
        }
        if (line.includes('\\end{proof}')) {
            inProof = false;
            html += '</div>';
            continue;
        }
        
        // Equation environment
        if (line.includes('\\begin{equation}')) {
            inEquation = true;
            html += '<div class="equation">';
            continue;
        }
        if (line.includes('\\end{equation}')) {
            inEquation = false;
            html += '</div>';
            continue;
        }
        
        // Regular content - convert inline math and display
        html += `<p>${line}</p>`;
    }
    
    return html;
}

// Convert text to LaTeX using local parser
function convertToLatex(text) {
    if (!text.trim()) {
        outputEditor.innerHTML = '';
        conversionTime.textContent = 'Real-time';
        return;
    }
    
    statusDot.classList.add('converting');
    statusText.textContent = 'Converting...';
    
    const startTime = Date.now();
    
    try {
        currentLatex = parser.convert(text);
        displayOutput();
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(3);
        conversionTime.textContent = `Converted in ${duration}s`;
        
        statusDot.classList.remove('converting', 'error');
        statusText.textContent = 'Ready';
        
    } catch (error) {
        console.error('Conversion error:', error);
        statusDot.classList.remove('converting');
        statusDot.classList.add('error');
        statusText.textContent = 'Error';
        outputEditor.textContent = `Error: ${error.message}`;
    }
}

// Display output based on current view mode
function displayOutput() {
    if (showRendered) {
        // Render as beautiful formatted document
        outputEditor.className = 'editor-output rendered';
        const html = renderLatex(currentLatex);
        outputEditor.innerHTML = html;
        
        // Render all math with KaTeX
        renderMathInElement(outputEditor, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\[', right: '\\]', display: true},
                {left: '\\(', right: '\\)', display: false}
            ],
            throwOnError: false
        });
    } else {
        // Show raw LaTeX code
        outputEditor.className = 'editor-output code';
        outputEditor.textContent = currentLatex;
    }
}

// Toggle between rendered and code view
toggleBtn.addEventListener('click', () => {
    showRendered = !showRendered;
    
    if (showRendered) {
        viewMode.textContent = '📄 Show Code';
    } else {
        viewMode.textContent = '✨ Show Rendered';
    }
    
    if (currentLatex) {
        displayOutput();
    }
});

// Debounced conversion (real-time with delay)
function debouncedConvert(text) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        convertToLatex(text);
    }, 500); // Wait 0.5 seconds after user stops typing (faster since no AI)
}

// Update character count
function updateCharCount() {
    const count = inputEditor.value.length;
    charCount.textContent = `${count.toLocaleString()} characters`;
}

// Update cursor position
function updateCursorPosition() {
    const text = inputEditor.value;
    const cursorPos = inputEditor.selectionStart;
    const textBeforeCursor = text.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    lineInfo.textContent = `Ln ${line}, Col ${col}`;
}

// Input event listener
inputEditor.addEventListener('input', (e) => {
    updateCharCount();
    const text = e.target.value;
    if (text.trim()) {
        debouncedConvert(text);
    } else {
        outputEditor.textContent = '';
        conversionTime.textContent = 'Real-time';
    }
});

// Cursor position tracking
inputEditor.addEventListener('keyup', updateCursorPosition);
inputEditor.addEventListener('click', updateCursorPosition);

// Save button - always saves LaTeX code
saveBtn.addEventListener('click', async () => {
    if (!currentLatex) {
        alert('No LaTeX to save. Please convert some text first.');
        return;
    }
    
    try {
        const result = await window.electronAPI.saveLatex(currentLatex);
        if (result.success) {
            statusText.textContent = 'Saved LaTeX!';
            setTimeout(() => {
                statusText.textContent = 'Ready';
            }, 2000);
        } else if (!result.canceled) {
            alert(`Error saving file: ${result.error}`);
        }
    } catch (error) {
        console.error('Save error:', error);
        alert(`Error: ${error.message}`);
    }
});

// Open button
openBtn.addEventListener('click', async () => {
    try {
        const result = await window.electronAPI.openFile();
        if (result.success) {
            inputEditor.value = result.content;
            updateCharCount();
            updateCursorPosition();
            debouncedConvert(result.content);
        } else if (!result.canceled) {
            alert(`Error opening file: ${result.error}`);
        }
    } catch (error) {
        console.error('Open error:', error);
        alert(`Error: ${error.message}`);
    }
});

// Guide button
guideBtn.addEventListener('click', async () => {
    try {
        await window.electronAPI.openGuide();
    } catch (error) {
        console.error('Error opening guide:', error);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveBtn.click();
    }
    
    // Ctrl+O to open
    if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        openBtn.click();
    }

    // F1 for guide
    if (e.key === 'F1') {
        e.preventDefault();
        guideBtn.click();
    }
});

// Initialize
updateCharCount();
updateCursorPosition();

