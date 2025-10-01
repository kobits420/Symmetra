// Rule-based plain text to LaTeX converter
// No AI needed - pure pattern matching

class LaTeXParser {
    constructor() {
        this.documentClass = '\\documentclass[12pt]{article}';
        this.packages = [
            '\\usepackage{amsmath}',
            '\\usepackage{amssymb}',
            '\\usepackage{amsthm}',
            '\\usepackage{geometry}',
            '\\geometry{margin=1in}'
        ];
    }

    convert(text) {
        if (!text.trim()) return '';

        let lines = text.split('\n');
        let body = [];
        let inEquation = false;

        for (let line of lines) {
            line = line.trim();
            
            if (!line) {
                body.push('');
                continue;
            }

            // Check for section headers
            if (line.startsWith('# ')) {
                body.push('\\section{' + line.substring(2) + '}');
                continue;
            }
            if (line.startsWith('## ')) {
                body.push('\\subsection{' + line.substring(3) + '}');
                continue;
            }
            if (line.startsWith('### ')) {
                body.push('\\subsubsection{' + line.substring(4) + '}');
                continue;
            }

            // Check for theorem/proof environments
            if (line.toLowerCase().startsWith('theorem:')) {
                body.push('\\begin{theorem}');
                body.push(this.convertMath(line.substring(8).trim()));
                continue;
            }
            if (line.toLowerCase().startsWith('proof:')) {
                body.push('\\begin{proof}');
                body.push(this.convertMath(line.substring(6).trim()));
                continue;
            }
            if (line.toLowerCase() === 'end proof' || line.toLowerCase() === 'qed') {
                body.push('\\end{proof}');
                continue;
            }
            if (line.toLowerCase() === 'end theorem') {
                body.push('\\end{theorem}');
                continue;
            }

            // Check for equations
            if (line.toLowerCase().startsWith('equation:')) {
                body.push('\\begin{equation}');
                body.push(this.convertMath(line.substring(9).trim()));
                body.push('\\end{equation}');
                continue;
            }

            // Regular text with inline math
            body.push(this.convertMath(line));
        }

        return this.buildDocument(body.join('\n'));
    }

    convertMath(text) {
        // Convert common math expressions to LaTeX

        // Greek letters (lowercase)
        text = text.replace(/\balpha\b/gi, '$\\alpha$');
        text = text.replace(/\bbeta\b/gi, '$\\beta$');
        text = text.replace(/\bgamma\b/gi, '$\\gamma$');
        text = text.replace(/\bdelta\b/gi, '$\\delta$');
        text = text.replace(/\bepsilon\b/gi, '$\\epsilon$');
        text = text.replace(/\btheta\b/gi, '$\\theta$');
        text = text.replace(/\blambda\b/gi, '$\\lambda$');
        text = text.replace(/\bmu\b/gi, '$\\mu$');
        text = text.replace(/\bpi\b/gi, '$\\pi$');
        text = text.replace(/\bsigma\b/gi, '$\\sigma$');
        text = text.replace(/\bphi\b/gi, '$\\phi$');
        text = text.replace(/\bomega\b/gi, '$\\omega$');

        // Greek letters (uppercase)
        text = text.replace(/\bDelta\b/g, '$\\Delta$');
        text = text.replace(/\bGamma\b/g, '$\\Gamma$');
        text = text.replace(/\bTheta\b/g, '$\\Theta$');
        text = text.replace(/\bLambda\b/g, '$\\Lambda$');
        text = text.replace(/\bSigma\b/g, '$\\Sigma$');
        text = text.replace(/\bPhi\b/g, '$\\Phi$');
        text = text.replace(/\bOmega\b/g, '$\\Omega$');

        // Operators and symbols
        text = text.replace(/infinity/gi, '$\\infty$');
        text = text.replace(/\bsum\b/gi, '$\\sum$');
        text = text.replace(/\bproduct\b/gi, '$\\prod$');
        text = text.replace(/\bintegral\b/gi, '$\\int$');
        text = text.replace(/partial derivative/gi, '$\\partial$');
        text = text.replace(/\btimes\b/gi, '$\\times$');
        text = text.replace(/\bdot\b(?=\s)/gi, '$\\cdot$');
        text = text.replace(/plus or minus|plus-minus/gi, '$\\pm$');
        text = text.replace(/minus or plus|minus-plus/gi, '$\\mp$');
        text = text.replace(/\bdots\b/gi, '$\\ldots$');
        text = text.replace(/ellipsis/gi, '$\\ldots$');
        
        // Relations
        text = text.replace(/not equal to|not equals/gi, '$\\neq$');
        text = text.replace(/less than or equal to|less or equal/gi, '$\\leq$');
        text = text.replace(/greater than or equal to|greater or equal/gi, '$\\geq$');
        text = text.replace(/approximately equal to|approximately/gi, '$\\approx$');
        text = text.replace(/\bequals\b/gi, '=');

        // Fractions: "a over b" or "a/b"
        text = text.replace(/(\w+|\([^)]+\))\s+over\s+(\w+|\([^)]+\))/gi, (match, num, den) => {
            return `$\\frac{${num}}{${den}}$`;
        });

        // Powers: "x squared", "x cubed", "x to the power of n"
        text = text.replace(/(\w+)\s+squared/gi, '$$$1^2$$');
        text = text.replace(/(\w+)\s+cubed/gi, '$$$1^3$$');
        text = text.replace(/(\w+)\s+to the power of\s+(\w+)/gi, '$$$1^{$2}$$');
        text = text.replace(/(\w+)\s+to the\s+(\w+)/gi, '$$$1^{$2}$$');

        // Subscripts: "x sub i", "x_i"
        text = text.replace(/(\w+)\s+sub\s+(\w+)/gi, '$$$1_{$2}$$');

        // Square roots
        text = text.replace(/square root of\s+(\w+|\([^)]+\))/gi, (match, arg) => {
            return `$\\sqrt{${arg}}$`;
        });
        text = text.replace(/sqrt\(([^)]+)\)/gi, (match, arg) => {
            return `$\\sqrt{${arg}}$`;
        });

        // Integrals with bounds
        text = text.replace(/integral from\s+(\w+)\s+to\s+(\w+)\s+of\s+([^\.]+)/gi, (match, lower, upper, expr) => {
            return `$\\int_{${lower}}^{${upper}} ${expr} \\, dx$`;
        });

        // Derivatives
        text = text.replace(/derivative of\s+(\w+)\s+with respect to\s+(\w+)/gi, (match, func, var_) => {
            return `$\\frac{d${func}}{d${var_}}$`;
        });

        // Limits
        text = text.replace(/limit as\s+(\w+)\s+approaches\s+(\w+)/gi, (match, var_, val) => {
            return `$\\lim_{${var_} \\to ${val}}$`;
        });

        // Summations
        text = text.replace(/sum from\s+(\w+)\s*=\s*(\w+)\s+to\s+(\w+)/gi, (match, var_, lower, upper) => {
            return `$\\sum_{${var_}=${lower}}^{${upper}}$`;
        });

        // Sets
        text = text.replace(/\b(real numbers|reals)\b/gi, '$\\mathbb{R}$');
        text = text.replace(/\bintegers\b/gi, '$\\mathbb{Z}$');
        text = text.replace(/\brationals\b/gi, '$\\mathbb{Q}$');
        text = text.replace(/\bnaturals\b/gi, '$\\mathbb{N}$');

        // Logic
        text = text.replace(/\bfor all\b/gi, '$\\forall$');
        text = text.replace(/\bthere exists\b/gi, '$\\exists$');
        text = text.replace(/\band\b(?![a-z])/gi, '$\\land$');
        text = text.replace(/\bor\b(?![a-z])/gi, '$\\lor$');
        text = text.replace(/\bnot\b(?=\s)/gi, '$\\neg$');
        text = text.replace(/\bimplies\b/gi, '$\\implies$');
        text = text.replace(/\bif and only if\b|iff\b/gi, '$\\iff$');

        // Set operations
        text = text.replace(/\belement of\b|in set/gi, '$\\in$');
        text = text.replace(/\bnot in\b/gi, '$\\notin$');
        text = text.replace(/\bsubset of\b/gi, '$\\subset$');
        text = text.replace(/\bsuperset of\b/gi, '$\\supset$');
        text = text.replace(/\bunion\b/gi, '$\\cup$');
        text = text.replace(/\bintersection\b/gi, '$\\cap$');
        text = text.replace(/\bempty set\b/gi, '$\\emptyset$');

        // Arrows
        text = text.replace(/\brightarrow\b|right arrow/gi, '$\\rightarrow$');
        text = text.replace(/\bleftarrow\b|left arrow/gi, '$\\leftarrow$');
        text = text.replace(/\bmaps to\b/gi, '$\\mapsto$');

        // Trigonometric and other functions
        text = text.replace(/\bsin\b/g, '$\\sin$');
        text = text.replace(/\bcos\b/g, '$\\cos$');
        text = text.replace(/\btan\b/g, '$\\tan$');
        text = text.replace(/\bcsc\b/g, '$\\csc$');
        text = text.replace(/\bsec\b/g, '$\\sec$');
        text = text.replace(/\bcot\b/g, '$\\cot$');
        text = text.replace(/\barcsin\b/g, '$\\arcsin$');
        text = text.replace(/\barccos\b/g, '$\\arccos$');
        text = text.replace(/\barctan\b/g, '$\\arctan$');
        text = text.replace(/\bln\b/g, '$\\ln$');
        text = text.replace(/\blog\b/g, '$\\log$');
        text = text.replace(/\bexp\b/g, '$\\exp$');

        // Absolute value and norms
        text = text.replace(/absolute value of\s+(\w+)/gi, '$|$1|$');
        text = text.replace(/\babs\(([^)]+)\)/gi, '$|$1|$');

        // Binomial coefficients
        text = text.replace(/(\w+)\s+choose\s+(\w+)/gi, '$\\binom{$1}{$2}$');

        // Clean up multiple $ signs
        text = text.replace(/\$\$+/g, '$');
        text = text.replace(/\$\s+\$/g, ' ');

        return text;
    }

    buildDocument(body) {
        const parts = [
            this.documentClass,
            ...this.packages,
            '',
            '\\begin{document}',
            '',
            body,
            '',
            '\\end{document}'
        ];

        return parts.join('\n');
    }
}

// Export for use in renderer
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LaTeXParser;
}

