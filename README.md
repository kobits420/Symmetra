# Symmetra

A beautiful desktop application for taking math notes. Write in structured plain text and watch it transform into perfect LaTeX in real-time. Similar to Sublime Text, with a clean split-pane interface designed for speed and simplicity.

**No AI, No API Keys, No Setup** - Just pure pattern matching and instant conversion!

## Features

- **Beautiful rendered output** - See actual mathematical notation, not LaTeX code!
- Real-time conversion from structured text to LaTeX as you type
- Toggle between rendered view and LaTeX code with one click
- Split-pane editor inspired by Sublime Text
- Dark input theme, clean white output for optimal readability
- Full-screen desktop application
- Save and open files
- Keyboard shortcuts (Ctrl+S to save, Ctrl+O to open)
- Character count and cursor position tracking
- **100% Free** - No costs, no subscriptions, no external services
- **Instant** - No waiting for AI, conversions are immediate
- **Works Offline** - No internet connection required (after initial CDN load)
- **Lightweight** - Pure JavaScript with KaTeX for rendering

## Prerequisites

- Node.js 16+ and npm

That's it! No AI, no Ollama, no OpenAI API needed.

## Quick Start

### 1. Install Node.js

Download from: https://nodejs.org/ (version 16 or higher)

### 2. Launch Symmetra

Double-click `start.bat` or run:

```bash
npm install
npm start
```

Done! The app will launch immediately.

## How to Use

**Click the green "Parser: Ready" status at the bottom for a complete syntax guide!**

### Basic Syntax

**Structure:**
```
# Heading
## Subheading  
### Sub-subheading
```

**Math Powers:**
```
x squared                  → x²
x cubed                    → x³
x to the power of n        → xⁿ
```

**Fractions:**
```
a over b                   → a/b
numerator over denominator → fraction
```

**Roots:**
```
square root of x           → √x
sqrt(expression)           → √(expression)
```

**Calculus:**
```
integral from 0 to 5 of x squared              → ∫₀⁵ x² dx
derivative of f with respect to x              → df/dx
limit as x approaches 0                        → lim_{x→0}
sum from i=1 to n                              → Σᵢ₌₁ⁿ
```

**Greek Letters:**
```
alpha, beta, gamma, delta, theta, pi, sigma, etc.
```

**Symbols:**
```
infinity                   → ∞
not equal to               → ≠
approximately              → ≈
for all                    → ∀
there exists               → ∃
real numbers              → ℝ
integers                  → ℤ
```

**Environments:**
```
Theorem: Your theorem text here
Proof: Your proof text here
End proof (or QED)

Equation: Your equation here
```

### Example

Type this:

```
# The Quadratic Formula

Theorem: For any quadratic equation ax squared plus bx plus c equals 0, 
where a not equal to 0, the solutions are:

Equation: x equals negative b plus or minus square root of b squared minus 4ac over 2a

Proof: We start by dividing both sides by a to get x squared plus b over a times x 
plus c over a equals 0.

Applying the quadratic formula, we complete the square...
End proof
```

Get beautiful rendered mathematical notation instantly!

**Toggle View:** Click "📄 Show Code" to see the raw LaTeX if needed.

## Controls

- `Ctrl+S` - Save LaTeX file (always saves as .tex)
- `Ctrl+O` - Open text file
- `F1` - Open comprehensive syntax guide
- `F11` - Toggle fullscreen
- **📖 Guide button** - Opens complete syntax reference with examples
- **Toggle button** - Switch between rendered view and LaTeX code
- **Click status bar** - Quick syntax help

## Project Structure

```
symmetra/
├── src/
│   ├── index.html        # Main window HTML
│   ├── styles.css        # Dark theme styling
│   ├── renderer.js       # UI logic
│   └── latex-parser.js   # Pattern matching parser
├── main.js               # Electron main process
├── preload.js            # Electron IPC bridge
├── package.json          # Node dependencies
├── start.bat             # Launch script
└── README.md
```

## How It Works

Symmetra uses **pattern matching** to convert your text:

1. You type in a structured format (but way easier than LaTeX)
2. Parser scans for keywords like "squared", "over", "integral from"
3. Replaces them with proper LaTeX commands
4. Generates a complete, compilable LaTeX document
5. All happens instantly in JavaScript - no AI needed!

## Advantages Over AI

- ✅ **Instant** - No 5-30 second wait times
- ✅ **Beautiful rendering** - See actual math notation in real-time
- ✅ **Consistent** - Same input always gives same output
- ✅ **Predictable** - You control exactly what you get
- ✅ **Free** - No API costs ever
- ✅ **Private** - Nothing sent to external servers
- ✅ **Reliable** - No "model is down" or rate limits

## Limitations

- **Structured input required** - You need to use the specific syntax (click status bar for help)
- **Not as flexible as AI** - AI can interpret more variations
- **Limited to predefined patterns** - Can't understand completely free-form English

But for math notes, this is actually **better** than AI - it's faster, more consistent, and you learn the patterns quickly!

## Customization

Want to add more patterns? Edit `src/latex-parser.js` and add your own regex replacements!

## Technologies

- **Desktop**: Electron (cross-platform framework)
- **Parser**: Pure JavaScript pattern matching
- **Rendering**: KaTeX for beautiful math typography
- **UI**: Custom dark/light split theme inspired by Sublime Text
- **Minimal dependencies** - KaTeX loaded via CDN, everything else local

## License

MIT
