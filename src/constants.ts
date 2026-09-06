import type { MathSymbol } from "./types/math-symbol";

/* 
------------------------------------------
Goals available for daily goals.
If goals are removed, do not reuse the same id.
------------------------------------------
1. Complete a private quest
2. Collect stars
*/
export const goalsAvailable = [
    { id: 1, name: 'Complete a private quest' },
    { id: 2, name: 'Collect stars' },
];

// Latex Toolbar Symbols
export const symbols1: MathSymbol[] = [
    { label: 'Exponent', display: '$x^{n}$', offset: 3 },
    { label: 'Subscript', display: '$x_{n}$', offset: 4},
    { label: 'Square Root', display: '$\\sqrt{x}$', offset: 7 },
    { label: 'Fraction', display: '$\\frac{x}{y}$', offset: 7 },
    { label: 'Summation', display: '$\\sum_{x}^{y}$', offset: 14 },
    { label: 'Product', display: '$\\prod_{x}^{y}$', offset: 8},
    { label: 'Integral', display: '$\\int_{x}^{y}$', offset: 6 },

    { label: 'Square Root', display: '$\\sqrt[x]{y}$', offset: 7},
    { label: 'Contour Integral', display: '$\\oint_{x}^{y}$', offset: 8},
    { label: 'Leibniz\'s notation', display: '$\\frac{dy}{dx}$', offset: 8},
    { label: 'Partial Derivative', display: '$\\frac{\\partial y}{\\partial x}$', offset: 16},
    { label: 'Implies', display: '$\\implies$', offset: 10},
    { label: 'If and Only If', display: '$\\iff$', offset: 6},
    { label: 'Times', display: '$\\times$', offset: 8},

    { label: 'Hashtag', display: '$\\#$', offset: 4},
    { label: 'And', display: '$\\wedge$', offset: 8},
    { label: 'Or', display: '$\\vee$', offset: 6},
    { label: 'Element of', display: '$\\in$', offset: 5},
    { label: 'Not an Element of', display: '$\\notin$', offset: 8},
    { label: 'Small Set-Minus', display: '$\\smallsetminus$', offset: 16},
    { label: 'Limit', display: '$\\lim_{x \\to 0}$', offset: 7},

    { label: 'Infinity', display: '$\\infty$', offset: 8 },
    { label: 'Plus-Minus', display: '$\\pm$', offset: 5},
    { label: 'Minus-Plus', display: '$\\mp$', offset: 5},
    { label: 'Empty Set', display: '$\\emptyset$', offset: 11},
    { label: 'For All', display: '$\\forall$', offset: 9},
    { label: 'Exists', display: '$\\exists$', offset: 9},
    { label: 'Not Equal', display: '$\\neq$', offset: 6},

    { label: 'Delta', display: '$\\Delta$', offset: 8},
    { label: 'To', display: '$\\to$', offset: 5},
    { label: 'Divisor', display: '$\\mid$', offset: 6},
    { label: 'Not a Divisor', display: '$\\nmid$', offset: 7},
    { label: 'Bracket', display: '{ }', offset: 1},
    { label: 'Negation', display: '$\\neg$', offset: 6},
    { label: 'Approximation', display: '$\\approx$', offset: 9},
];

export const symbols2: MathSymbol[] = [
    { label: 'Less Than', display: '$\\lt$', offset: 5},
    { label: 'Greater Than', display: '$\\gt$', offset: 5},
    { label: 'Less Than or Equal To', display: '$\\le$', offset: 5},
    { label: 'Greater Than or Equal To', display: '$\\ge$', offset: 5},

    { label: 'Less Than or Equal To', display: '$\\leqslant$', offset: 11},
    { label: 'Greater Than or Equal To', display: '$\\geqslant$', offset: 11},
    { label: 'Much Less Than', display: '$\\ll$', offset: 5},
    { label: 'Much Greater Than', display: '$\\gg$', offset: 5},

    { label: 'Precedes', display: '$\\prec$', offset: 7},
    { label: 'Succeeds', display: '$\\succ$', offset: 7},
    { label: 'Less Than or Similar To', display: '$\\lesssim$', offset: 10},
    { label: 'Greater Than or Similar To', display: '$\\gtrsim$', offset: 9},

    { label: 'Not Less Than', display: '$\\nless$', offset: 8},
    { label: 'Not Greater Than', display: '$\\ngtr$', offset: 7},
    { label: 'Neither Less Than nor Equal To', display: '$\\nleq$', offset: 7},
    { label: 'Neither Greater Than nor Equal To', display: '$\\ngeq$', offset: 7},

    { label: 'Neither Less Than or Equal To', display: '$\\nleqslant$', offset: 12},
    { label: 'Neither Greater Than nor Equal To', display: '$\\ngeqslant$', offset: 12},
    { label: 'Does Not Precedes', display: '$\\nprec$', offset: 8},
    { label: 'Does Not Succeed', display: '$\\nsucc$', offset: 8},
]

export const symbols3: MathSymbol[] = [
    { label: 'Equivalent', display: '$\\equiv$', offset: 8},
    { label: 'Similar', display: '$\\sim$', offset: 6},
    { label: 'Asymptotic', display: '$\\asymp$', offset: 8},
    { label: 'Similar or Equal To', display: '$\\simeq$', offset: 8},
    { label: 'Congruent', display: '$\\cong$', offset: 7},
    { label: 'Del', display: '$\\nabla$', offset: 8},

    { label: 'Divided', display: '$\\div$', offset: 6},
    { label: 'Vdash', display: '$\\vdash$', offset: 8},
    { label: 'Models', display: '$\\models$', offset: 9},
    { label: 'Proportional', display: '$\\propto$', offset: 9},
    { label: 'Real Part', display: '$\\Re$', offset: 5},
    { label: 'Imaginary Part', display: '$\\Im$', offset: 5},

    { label: 'Star', display: '$\\star$', offset: 7},
    { label: 'Asterisk', display: '$\\ast$', offset: 6},
    { label: 'Circle', display: '$\\circ$', offset: 7},
    { label: 'Bullet', display: '$\\bullet$', offset: 9},
    { label: 'IMath', display: '$\\imath$', offset: 8},
    { label: 'JMath', display: '$\\jmath$', offset: 8},

    { label: 'OPlus', display: '$\\oplus$', offset: 8},
    { label: 'OMinus', display: '$\\ominus$', offset: 9},
    { label: 'OTimes', display: '$\\otimes$', offset: 9},
    { label: 'OSlash', display: '$\\oslash$', offset: 9},
    { label: 'CDot', display: '$\\cdot$', offset: 7},
    { label: 'Hbar', display: '$\\hbar$', offset: 7},

    { label: 'CDots', display: '$\\cdots$', offset: 8},
    { label: 'VDots', display: '$\\vdots$', offset: 8},
    { label: 'DDots', display: '$\\ddots$', offset: 8},
    { label: 'Angle', display: '$\\angle$', offset: 8},
    { label: 'Bot', display: '$\\bot$', offset: 6},
    { label: 'Bowties', display: '$\\bowtie$', offset: 9},

    { label: 'Parallel', display: '$\\parallel$', offset: 11},
    { label: 'Not Equivalent', display: '$\\not\\equiv$', offset: 12},
    { label: 'Not Similar', display: '$\\nsim$', offset: 7},
    { label: 'Not Congruent', display: '$\\ncong$', offset: 8},
    { label: 'There is No', display: '$\\nexists$', offset: 10},
    { label: 'Measured Angle', display: '$\\measuredangle$', offset: 16},
]

export const symbols4: MathSymbol[] = [
    { label: 'Alpha', display: '$\\alpha$', offset: 8 },
    { label: 'Beta', display: '$\\beta$', offset: 7 },
    { label: 'Gamma', display: '$\\gamma$', offset: 8},
    { label: 'Delta', display: '$\\delta$', offset: 8},
    { label: 'Epsilon', display: '$\\epsilon$', offset: 10},
    
    { label: 'Var Epsilon', display: '$\\varepsilon$', offset: 13},
    { label: 'Zeta', display: '$\\zeta$', offset: 7},
    { label: 'Eta', display: '$\\eta$', offset: 6},
    { label: 'Theta', display: '$\\theta$', offset: 8},
    { label: 'Var Theta', display: '$\\vartheta$', offset: 11},

    { label: 'Iota', display: '$\\iota$', offset: 7},
    { label: 'Kappa', display: '$\\kappa$', offset: 8},
    { label: 'Lambda', display: '$\\lambda$', offset: 9},
    { label: 'Mu', display: '$\\mu$', offset: 5},
    { label: 'Nu', display: '$\\nu$', offset: 5},

    { label: 'Xi', display: '$\\xi$', offset: 5},
    { label: 'O', display: '$\\o$', offset: 4},
    { label: 'Pi', display: '$\\pi$', offset: 5},
    { label: 'Var Pi', display: '$\\varpi$', offset: 8},
    { label: 'Rho', display: '$\\rho$', offset: 6},

    { label: 'Var Pho', display: '$\\varrho$', offset: 9},
    { label: 'Sigma', display: '$\\sigma$', offset: 8},
    { label: 'Var Sigma', display: '$\\varsigma$', offset: 11},
    { label: 'Tau', display: '$\\tau$', offset: 6},
    { label: 'Upsilon', display: '$\\upsilon$', offset: 10},

    { label: 'Phi', display: '$\\phi$', offset: 6},
    { label: 'Var Phi', display: '$\\varphi$', offset: 9},
    { label: 'Chi', display: '$\\chi$', offset: 6},
    { label: 'Psi', display: '$\\psi$', offset: 6},
    { label: 'Omega', display: '$\\omega$', offset: 8},
]

export const symbols5: MathSymbol[] = [
    { label: 'Acute', display: '$\\acute{e}$', offset: 8},
    { label: 'Grave', display: '$\\grave{e}$', offset: 8},
    { label: 'Hat', display: '$\\hat{e}$', offset: 6},
    { label: 'Tilde', display: '$\\tilde{e}$', offset: 8},
    { label: 'Ddot', display: '$\\ddot{e}$', offset: 7},
    { label: 'Bar', display: '$\\bar{e}$', offset: 6},
]

export const symbols6: MathSymbol[] = [
    { label: 'Gamma', display: '$\\Gamma$', offset: 8},
    { label: 'Delta', display: '$\\Delta$', offset: 8},
    { label: 'Theta', display: '$\\Theta$', offset: 8},

    { label: 'Lambda', display: '$\\Lambda$', offset: 9},
    { label: 'Xi', display: '$\\Xi$', offset: 5},
    { label: 'Pi', display: '$\\Pi$', offset: 5},

    { label: 'Sigma', display: '$\\Sigma$', offset: 8},
    { label: 'Upsilon', display: '$\\Upsilon$', offset: 10},
    { label: 'Phi', display: '$\\Phi$', offset: 6},

    { label: 'Psi', display: '$\\Psi$', offset: 6},
    { label: 'Omega', display: '$\\Omega$', offset: 8},
]

export const symbols7: MathSymbol[] = [
    { label: 'Big Set Union', display: '$\\bigcup_{x}^{y}$', offset: 10},
    { label: 'Big Intersection', display: '$\\bigcap_{x}^{y}$', offset: 10},
    { label: 'Big Vee', display: '$\\bigvee_{x}^{y}$', offset: 10},
    { label: 'Big Wedge', display: '$\\bigwedge_{x}^{y}$', offset: 12},
    { label: 'Big OPlus', display: '$\\bigoplus_{x}^{y}$', offset: 12},
    { label: 'Big OTimes', display: '$\\bigotimes_{x}^{y}$', offset: 13},
    { label: 'Coprod', display: '$\\coprod_{x}^{y}$', offset: 10},
    { label: 'Big Square Set Union', display: '$\\bigsqcup_{x}^{y}$', offset: 12},
]

export const symbols8: MathSymbol[] = [
    { label: 'Proper Subset', display: '$\\subset$', offset: 9},
    { label: 'Set Union', display: '$\\cup$', offset: 6},
    { label: 'Set Intersection', display: '$\\cap$', offset: 6},

    { label: 'Subset', display: '$\\subseteq$', offset: 11},
    { label: 'Not a Subset', display: '$\\subsetneq$', offset: 12},
    { label: 'Not a Subset', display: '$\\nsubseteq$', offset: 12},

    { label: 'Big Triangle Up', display: '$\\bigtriangleup$', offset: 16},
    { label: 'Big Triangle Down', display: '$\\bigtriangledown$', offset: 18},
    { label: 'Big Cirlce', display: '$\\bigcirc$', offset: 10},

    { label: 'Triangle Left', display: '$\\triangleleft$', offset: 15},
    { label: 'Triangle Right', display: '$\\triangleright$', offset: 16},
    { label: 'Square', display: '$\\square$', offset: 9},
]

export const symbols9: MathSymbol[] = [
    { label: 'Left Arrow', display: '$\\gets$', offset: 7},
    { label: 'Right Arrow', display: '$\\to$', offset: 5},
    { label: 'Long Left Arrow', display: '$\\longleftarrow$', offset: 16},
    { label: 'Long Right Arrow', display: '$\\longrightarrow$', offset: 17},
    { label: 'Left Right Arrow', display: '$\\leftrightarrow$', offset: 17},

    { label: 'Left Harpoon Up', display: '$\\leftharpoonup$', offset: 16},
    { label: 'Right Harpoon Up', display: '$\\rightharpoonup$', offset: 17},
    { label: 'Maps To', display: '$\\mapsto$', offset: 9},
    { label: 'Long Maps To', display: '$\\longmapsto$', offset: 13},
    { label: 'Long Left Right Arrow', display: '$\\longleftrightarrow$', offset: 21},

    { label: 'Left Harpoon Down', display: '$\\leftharpoondown$', offset: 18},
    { label: 'Right Harpoon Down', display: '$\\rightharpoondown$', offset: 19},
    { label: 'Left Right Harpoons', display: '$\\leftrightharpoons$', offset: 20},
    { label: 'Right Left Harpoons', display: '$\\rightleftharpoons$', offset: 20},
    { label: 'Up Down Arrow', display: '$\\updownarrow$', offset: 14},

    { label: 'Up Arrow', display: '$\\uparrow$', offset: 10},
    { label: 'Down Arrow', display: '$\\downarrow$', offset: 12},
    { label: 'SW Arrow', display: '$\\swarrow$', offset: 10},
    { label: 'SE Arrow', display: '$\\searrow$', offset: 10},
    { label: 'Up Up Arrow', display: '$\\upuparrows$', offset: 13},

    { label: 'Curve Arrow Left', display: '$\\curvearrowleft$', offset: 17},
    { label: 'Curve Arrow Right', display: '$\\curvearrowright$', offset: 18},
    { label: 'NW Arrow', display: '$\\nwarrow$', offset: 10},
    { label: 'NE Arrow', display: '$\\nearrow$', offset: 10},
    { label: 'Right Right Arrow', display: '$\\rightrightarrows$', offset: 19},

    { label: 'Circle Arrow Right', display: '$\\circlearrowright$', offset: 19},
    { label: 'Right Arrow Tail', display: '$\\rightarrowtail$', offset: 17},
    { label: 'Right Squig Arrow', display: '$\\rightsquigarrow$', offset: 18},
    { label: 'Loop Arrow Right', display: '$\\looparrowright$', offset: 17},
    { label: 'Not Right Arrow', display: '$\\nrightarrow$', offset: 14},
]

export const symbols10: MathSymbol[] = [
    { label: 'Left Arrow', display: '$\\Leftarrow$', offset: 12},
    { label: 'Right Arrow', display: '$\\Rightarrow$', offset: 13},
    { label: 'Left Right Arrow', display: '$\\Leftrightarrow$', offset: 17},

    { label: 'Long Left Arrow', display: '$\\Longleftarrow$', offset: 16},
    { label: 'Long Right Arrow', display: '$\\Longrightarrow$', offset: 17},
    { label: 'Long Left Right Arrow', display: '$\\Longleftrightarrow$', offset: 21},
    
    { label: 'Up Arrow', display: '$\\Uparrow$', offset: 10},
    { label: 'Down Arrow', display: '$\\Downarrow$', offset: 12},
    { label: 'Up Down Arrow', display: '$\\Updownarrow$', offset: 14},

    { label: 'Not Left Arrow', display: '$\\nLeftarrow$', offset: 13},
    { label: 'Not Right Arrow', display: '$\\nRightarrow$', offset: 14},
    { label: 'Not Left Right Arrow', display: '$\\nLeftrightarrow$', offset: 18},
]

export const symbols11: MathSymbol[] = [
    { label: 'Over Right Arrow', display: '$\\overrightarrow{AB}$', offset: 17},
    { label: 'Under Right Arrow', display: '$\\underrightarrow{AB}$', offset: 18},
    { label: 'Wide Hat', display: '$\\widehat{abc}$', offset: 10},
    { label: 'Wide Tilde', display: '$\\widetilde{abc}$', offset: 12},
    { label: 'Overline', display: '$\\overline{abc}$', offset: 11},

    { label: 'Underline', display: '$\\underline{abc}$', offset: 12},
    { label: 'Overbrace', display: '$\\overbrace{abc}$', offset: 12},
    { label: 'Underbrace', display: '$\\underbrace{abc}$', offset: 13},
    { label: 'Overset', display: '$\\overset{abc}{AB}$', offset: 10},
    { label: 'Underset', display: '$\\underset{abc}{AB}$', offset: 11},
]

export const symbols12: MathSymbol[] = [
    { label: 'Parenthesis', display: '$\\left(  \\right)$', offset: 8},
    { label: 'Floor', display: '$\\left\\lfloor  \\right\\rfloor$', offset: 14},
    { label: 'Brace', display: '$\\left\\{  \\right\\}$', offset: 9},
    { label: 'Ceiling', display: '$\\left\\lceil  \\right\\rceil$', offset: 13},
    { label: 'Divides', display: '$\\left|  \\right|$', offset: 8},
    { label: 'Bracket', display: '$\\left[  \\right]$', offset: 8},
    { label: 'Divides Unitarily, Is Parallel With', display: '$\\left\\|  \\right\\|$', offset: 9},
    { label: 'Angle Bracket', display: '$\\left\\langle  \\right\\rangle$', offset: 14},
]

export const symbols13: MathSymbol[] = [
    { label: 'Combination', display: '$\\mathrm{C}_{n}^{k}$', offset: 13},
    { label: 'Binomial', display: '$\\binom{n}{k}$', offset: 8},
]