//src/data/demoData.js
export const BOARDS = [
  { id: 'cbse', name: 'CBSE' },
  { id: 'icse', name: 'ICSE' },
  { id: 'up_board', name: 'UP Board' },
  { id: 'mp_board', name: 'MP Board' },
  { id: 'rajasthan', name: 'Rajasthan Board' },
  { id: 'maharashtra', name: 'Maharashtra Board' },
  { id: 'bihar', name: 'Bihar Board' },
  { id: 'other', name: 'Other' },
];

export const CLASSES = [6, 7, 8, 9, 10, 11, 12];

export const SUBJECTS_BY_CLASS = {
  6:  ['Mathematics','Science','Social Science','English','Hindi'],
  7:  ['Mathematics','Science','Social Science','English','Hindi'],
  8:  ['Mathematics','Science','Social Science','English','Hindi'],
  9:  ['Mathematics','Science','Social Science','English','Hindi'],
  10: ['Mathematics','Science','Social Science','English','Hindi'],
  11: ['Physics','Chemistry','Mathematics','Biology','English'],
  12: ['Physics','Chemistry','Mathematics','Biology','English'],
};

const SUBJECT_META = {
  Mathematics:    { icon: '📐', color: 'from-blue-500 to-indigo-600',    bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  Science:        { icon: '🔬', color: 'from-green-500 to-emerald-600',  bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  'Social Science':{ icon: '🌍', color: 'from-orange-500 to-amber-600',  bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  English:        { icon: '📚', color: 'from-purple-500 to-violet-600',  bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Hindi:          { icon: '✍️', color: 'from-red-500 to-rose-600',       bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200' },
  Physics:        { icon: '⚡', color: 'from-yellow-500 to-orange-600',  bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  Chemistry:      { icon: '🧪', color: 'from-teal-500 to-cyan-600',      bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200' },
  Biology:        { icon: '🌿', color: 'from-lime-500 to-green-600',     bg: 'bg-lime-50',   text: 'text-lime-700',   border: 'border-lime-200' },
};

export const getSubjects = (classGrade) => {
  const names = SUBJECTS_BY_CLASS[classGrade] || [];
  return names.map((name, i) => ({
    id: `s${classGrade}_${i + 1}`,
    name,
    ...(SUBJECT_META[name] || SUBJECT_META['Mathematics']),
  }));
};

export const TOPICS = {
  's9_1': [
    {
      id: 't1', title: 'Number Systems', order: 1,
      duration: '45 min', difficulty: 'Easy', diffColor: 'text-green-600 bg-green-50',
      summary: 'Understanding real numbers, their decimal expansions, and representation on the number line.',
      content: `## What is Number System?
A number system defines how numbers are represented and categorized. In Mathematics, we study different types of numbers:

---

### 🔢 Types of Numbers

**1. Natural Numbers (N)**
Natural numbers are counting numbers: **1, 2, 3, 4, 5, ...**
- They start from 1 and go to infinity
- Used for counting real objects

**2. Whole Numbers (W)**
Whole numbers include zero along with natural numbers: **0, 1, 2, 3, 4, 5, ...**
- W = N ∪ {0}

**3. Integers (Z)**
Integers include positive, negative numbers and zero: **..., -3, -2, -1, 0, 1, 2, 3, ...**

**4. Rational Numbers (Q)**
A rational number can be expressed as **p/q**, where p and q are integers and q ≠ 0.
- Examples: 1/2, 3/4, -5/7, 2 (= 2/1)
- Decimal form: terminating OR non-terminating repeating

**5. Irrational Numbers**
Numbers that **cannot** be expressed as p/q.
- Examples: √2, √3, π, e
- Decimal form: non-terminating, non-repeating

**6. Real Numbers (R)**
Real Numbers = Rational + Irrational numbers

---

### 📌 Key Theorems
- √p is irrational if p is a **prime** number
- Sum of rational + irrational = **irrational**
- Product of non-zero rational × irrational = **irrational**

---

### ⚡ Laws of Exponents
- a^m × a^n = a^(m+n)
- (a^m)^n = a^(mn)
- a^m × b^m = (ab)^m
- a^0 = 1 (for any non-zero a)`,
      quiz: {
        id: 'q1', title: 'Number Systems Quiz', timeLimit: 10,
        questions: [
          { id: 'qq1', text: 'Which of the following is an irrational number?',
            options: [{ id: 'a', text: '√4' }, { id: 'b', text: '√9' }, { id: 'c', text: '√2' }, { id: 'd', text: '√16' }],
            correct: 'c' },
          { id: 'qq2', text: 'The decimal expansion of 1/3 is:',
            options: [{ id: 'a', text: '0.333... (non-terminating repeating)' }, { id: 'b', text: '0.3 (terminating)' }, { id: 'c', text: '0.3333 (terminating)' }, { id: 'd', text: 'Non-terminating non-repeating' }],
            correct: 'a' },
          { id: 'qq3', text: 'Every integer is also a:',
            options: [{ id: 'a', text: 'Natural number' }, { id: 'b', text: 'Whole number' }, { id: 'c', text: 'Rational number' }, { id: 'd', text: 'Irrational number' }],
            correct: 'c' },
          { id: 'qq4', text: 'The value of (2³)² is:',
            options: [{ id: 'a', text: '12' }, { id: 'b', text: '64' }, { id: 'c', text: '32' }, { id: 'd', text: '16' }],
            correct: 'b' },
          { id: 'qq5', text: 'π (pi) is classified as:',
            options: [{ id: 'a', text: 'A rational number' }, { id: 'b', text: 'A whole number' }, { id: 'c', text: 'An irrational number' }, { id: 'd', text: 'An integer' }],
            correct: 'c' },
        ],
      },
    },
    {
      id: 't2', title: 'Polynomials', order: 2,
      duration: '50 min', difficulty: 'Medium', diffColor: 'text-yellow-600 bg-yellow-50',
      summary: 'Learn about polynomials, their zeroes, types and the Factor Theorem.',
      content: `## Polynomials

A **polynomial** is an algebraic expression consisting of variables and coefficients with non-negative integer exponents.

---

### 📐 Types of Polynomials

| Type | Degree | Example |
|------|--------|---------|
| Monomial | Any | 5x² |
| Binomial | Any | x + 2 |
| Trinomial | Any | x² + 3x + 2 |
| Linear | 1 | 2x + 3 |
| Quadratic | 2 | x² - 5x + 6 |
| Cubic | 3 | x³ + 2x² - x + 1 |

---

### 🔑 Zeroes of a Polynomial
The **zero** of a polynomial p(x) is the value of x for which p(x) = 0.
- A linear polynomial has **one** zero
- A quadratic polynomial has at most **two** zeroes
- A polynomial of degree n has at most **n** zeroes

---

### 📌 Remainder Theorem
When p(x) is divided by (x - a), the remainder = p(a)

---

### 📌 Factor Theorem
(x - a) is a factor of p(x) **if and only if** p(a) = 0`,
      quiz: {
        id: 'q2', title: 'Polynomials Quiz', timeLimit: 10,
        questions: [
          { id: 'qq1', text: 'What is the degree of polynomial 5x³ + 2x² - 7x + 1?',
            options: [{ id: 'a', text: '1' }, { id: 'b', text: '2' }, { id: 'c', text: '3' }, { id: 'd', text: '4' }],
            correct: 'c' },
          { id: 'qq2', text: 'The zero of the polynomial p(x) = 2x - 6 is:',
            options: [{ id: 'a', text: '6' }, { id: 'b', text: '3' }, { id: 'c', text: '2' }, { id: 'd', text: '-3' }],
            correct: 'b' },
          { id: 'qq3', text: 'A quadratic polynomial can have at most how many zeroes?',
            options: [{ id: 'a', text: '1' }, { id: 'b', text: '2' }, { id: 'c', text: '3' }, { id: 'd', text: 'Infinite' }],
            correct: 'b' },
          { id: 'qq4', text: 'If p(x) = x² - 5x + 6, what is p(2)?',
            options: [{ id: 'a', text: '4' }, { id: 'b', text: '1' }, { id: 'c', text: '0' }, { id: 'd', text: '-1' }],
            correct: 'c' },
          { id: 'qq5', text: 'Which is NOT a polynomial?',
            options: [{ id: 'a', text: 'x² + 2x + 1' }, { id: 'b', text: '√x + 1' }, { id: 'c', text: '3x - 7' }, { id: 'd', text: 'x³ - 1' }],
            correct: 'b' },
        ],
      },
    },
    {
      id: 't3', title: 'Lines and Angles', order: 3,
      duration: '40 min', difficulty: 'Easy', diffColor: 'text-green-600 bg-green-50',
      summary: 'Explore properties of lines, angles, transversals and parallel line theorems.',
      content: `## Lines and Angles

---

### 📏 Basic Terms

**Point** – A location in space with no dimension
**Line** – Extends infinitely in both directions
**Line Segment** – Part of a line with two endpoints
**Ray** – Part of a line with one endpoint

---

### 📐 Types of Angles

| Angle | Measure |
|-------|---------|
| Acute | 0° < θ < 90° |
| Right | θ = 90° |
| Obtuse | 90° < θ < 180° |
| Straight | θ = 180° |
| Reflex | 180° < θ < 360° |

---

### 🔑 Key Theorems

**1. Vertically Opposite Angles** – When two lines intersect, vertically opposite angles are equal.

**2. Linear Pair** – Adjacent angles on a straight line sum to 180°.

**3. Parallel Lines & Transversal:**
- Corresponding angles are equal ✓
- Alternate interior angles are equal ✓
- Co-interior (same-side) angles are supplementary (sum = 180°) ✓`,
      quiz: {
        id: 'q3', title: 'Lines & Angles Quiz', timeLimit: 8,
        questions: [
          { id: 'qq1', text: 'If two lines intersect, the vertically opposite angles are:',
            options: [{ id: 'a', text: 'Supplementary' }, { id: 'b', text: 'Complementary' }, { id: 'c', text: 'Equal' }, { id: 'd', text: 'Adjacent' }],
            correct: 'c' },
          { id: 'qq2', text: 'A linear pair of angles always adds up to:',
            options: [{ id: 'a', text: '90°' }, { id: 'b', text: '180°' }, { id: 'c', text: '270°' }, { id: 'd', text: '360°' }],
            correct: 'b' },
          { id: 'qq3', text: 'Alternate interior angles are formed when a transversal cuts:',
            options: [{ id: 'a', text: 'Two intersecting lines' }, { id: 'b', text: 'Two parallel lines' }, { id: 'c', text: 'Three parallel lines' }, { id: 'd', text: 'A circle' }],
            correct: 'b' },
          { id: 'qq4', text: 'If one angle of a linear pair is 70°, the other is:',
            options: [{ id: 'a', text: '70°' }, { id: 'b', text: '100°' }, { id: 'c', text: '110°' }, { id: 'd', text: '120°' }],
            correct: 'c' },
          { id: 'qq5', text: 'Co-interior angles on the same side of a transversal are:',
            options: [{ id: 'a', text: 'Equal' }, { id: 'b', text: 'Complementary' }, { id: 'c', text: 'Supplementary' }, { id: 'd', text: 'Vertically opposite' }],
            correct: 'c' },
        ],
      },
    },
  ],
  's9_2': [
    {
      id: 't10', title: 'Matter in Our Surroundings', order: 1,
      duration: '40 min', difficulty: 'Easy', diffColor: 'text-green-600 bg-green-50',
      summary: 'Understanding states of matter, their properties and interconversion.',
      content: `## Matter in Our Surroundings

**Matter** is anything that occupies space and has mass.

---

### 🧊 States of Matter

| State | Shape | Volume | Compressibility |
|-------|-------|--------|----------------|
| Solid | Fixed | Fixed | Very Low |
| Liquid | No fixed | Fixed | Low |
| Gas | No fixed | No fixed | High |

---

### 🔄 Changes of State

- **Melting** – Solid → Liquid (absorbs heat)
- **Boiling/Vaporization** – Liquid → Gas (absorbs heat)
- **Condensation** – Gas → Liquid (releases heat)
- **Freezing** – Liquid → Solid (releases heat)
- **Sublimation** – Solid → Gas directly (e.g., dry ice, camphor)
- **Deposition** – Gas → Solid directly

---

### 🌡️ Important Terms

**Latent Heat of Fusion** – Heat required to convert 1 kg of solid to liquid at its melting point (without temperature change).

**Latent Heat of Vaporization** – Heat required to convert 1 kg of liquid to gas at its boiling point.

---

### 📌 Key Facts
- Evaporation causes cooling (that's why we sweat!)
- Evaporation depends on: surface area, temperature, humidity, wind speed
- Dry ice is solid CO₂ (sublimes at -78.5°C)`,
      quiz: {
        id: 'q10', title: 'Matter Quiz', timeLimit: 8,
        questions: [
          { id: 'qq1', text: 'Which state of matter has a fixed shape and volume?',
            options: [{ id: 'a', text: 'Gas' }, { id: 'b', text: 'Liquid' }, { id: 'c', text: 'Solid' }, { id: 'd', text: 'Plasma' }],
            correct: 'c' },
          { id: 'qq2', text: 'The process of solid converting directly to gas is called:',
            options: [{ id: 'a', text: 'Evaporation' }, { id: 'b', text: 'Condensation' }, { id: 'c', text: 'Sublimation' }, { id: 'd', text: 'Melting' }],
            correct: 'c' },
          { id: 'qq3', text: 'Evaporation causes:',
            options: [{ id: 'a', text: 'Heating' }, { id: 'b', text: 'Cooling' }, { id: 'c', text: 'No temperature change' }, { id: 'd', text: 'Condensation' }],
            correct: 'b' },
          { id: 'qq4', text: 'Which of these substances undergoes sublimation?',
            options: [{ id: 'a', text: 'Water' }, { id: 'b', text: 'Iron' }, { id: 'c', text: 'Camphor' }, { id: 'd', text: 'Alcohol' }],
            correct: 'c' },
          { id: 'qq5', text: 'When a gas converts to liquid, the process is:',
            options: [{ id: 'a', text: 'Freezing' }, { id: 'b', text: 'Condensation' }, { id: 'c', text: 'Sublimation' }, { id: 'd', text: 'Melting' }],
            correct: 'b' },
        ],
      },
    },
    {
      id: 't11', title: 'Atoms and Molecules', order: 2,
      duration: '50 min', difficulty: 'Medium', diffColor: 'text-yellow-600 bg-yellow-50',
      summary: 'Learn about atomic theory, atomic mass, molecules and chemical formulae.',
      content: `## Atoms and Molecules

---

### ⚛️ Dalton's Atomic Theory
1. All matter is made of tiny, indivisible particles called **atoms**
2. Atoms of the same element are identical in mass and properties
3. Atoms combine in simple whole-number ratios to form compounds
4. Atoms cannot be created or destroyed in chemical reactions

---

### 📏 Atomic Mass
- Defined relative to Carbon-12 (mass = 12 u)
- 1 atomic mass unit (u) = 1/12th mass of C-12 atom
- H = 1u, O = 16u, N = 14u, C = 12u, Na = 23u, Fe = 56u

---

### 🔬 Molecules
A **molecule** is the smallest unit of a substance that can exist independently.
- H₂O (water) – 2 H + 1 O
- CO₂ – 1 C + 2 O
- H₂SO₄ – 2 H + 1 S + 4 O

---

### 📌 Avogadro's Number
One mole of any substance contains **6.022 × 10²³** particles (Avogadro's number, Nₐ).

**Molar Mass** = Mass of 1 mole of a substance in grams = Atomic/Molecular mass in grams`,
      quiz: {
        id: 'q11', title: 'Atoms & Molecules Quiz', timeLimit: 10,
        questions: [
          { id: 'qq1', text: 'Who proposed the atomic theory?',
            options: [{ id: 'a', text: 'Rutherford' }, { id: 'b', text: 'Dalton' }, { id: 'c', text: 'Bohr' }, { id: 'd', text: 'Thomson' }],
            correct: 'b' },
          { id: 'qq2', text: 'The atomic mass of Oxygen is:',
            options: [{ id: 'a', text: '12 u' }, { id: 'b', text: '14 u' }, { id: 'c', text: '16 u' }, { id: 'd', text: '18 u' }],
            correct: 'c' },
          { id: 'qq3', text: 'How many atoms are in one molecule of H₂SO₄?',
            options: [{ id: 'a', text: '5' }, { id: 'b', text: '6' }, { id: 'c', text: '7' }, { id: 'd', text: '8' }],
            correct: 'c' },
          { id: 'qq4', text: "Avogadro's number is approximately:",
            options: [{ id: 'a', text: '6.022 × 10²¹' }, { id: 'b', text: '6.022 × 10²³' }, { id: 'c', text: '6.022 × 10²⁵' }, { id: 'd', text: '3.011 × 10²³' }],
            correct: 'b' },
          { id: 'qq5', text: 'The molar mass of water (H₂O) is:',
            options: [{ id: 'a', text: '16 g/mol' }, { id: 'b', text: '17 g/mol' }, { id: 'c', text: '18 g/mol' }, { id: 'd', text: '20 g/mol' }],
            correct: 'c' },
        ],
      },
    },
    {
      id: 't12', title: 'Motion', order: 3,
      duration: '55 min', difficulty: 'Hard', diffColor: 'text-red-600 bg-red-50',
      summary: 'Understand distance, displacement, speed, velocity, acceleration and equations of motion.',
      content: `## Motion

---

### 📏 Distance vs Displacement

| | Distance | Displacement |
|--|---------|-------------|
| Type | Scalar | Vector |
| Definition | Total path length | Shortest path (start to end) |
| Value | Always positive | Can be zero or negative |

---

### ⚡ Speed vs Velocity

- **Speed** = Distance / Time (scalar)
- **Velocity** = Displacement / Time (vector)
- **Average speed** = Total distance / Total time
- **Average velocity** = Total displacement / Total time

---

### 📈 Acceleration
**a = (v - u) / t** where:
- u = initial velocity
- v = final velocity  
- t = time taken

---

### 🔢 Equations of Motion (Uniform Acceleration)
1. **v = u + at**
2. **s = ut + ½at²**
3. **v² = u² + 2as**

Where: u = initial velocity, v = final velocity, a = acceleration, s = displacement, t = time

---

### 📊 Graphs
- **Distance-Time graph** – Slope = Speed
- **Velocity-Time graph** – Slope = Acceleration, Area = Displacement`,
      quiz: {
        id: 'q12', title: 'Motion Quiz', timeLimit: 12,
        questions: [
          { id: 'qq1', text: 'Displacement is a:',
            options: [{ id: 'a', text: 'Scalar quantity' }, { id: 'b', text: 'Vector quantity' }, { id: 'c', text: 'Both scalar and vector' }, { id: 'd', text: 'Neither' }],
            correct: 'b' },
          { id: 'qq2', text: "Using v = u + at, if u = 5 m/s, a = 2 m/s², t = 3s, then v = ?",
            options: [{ id: 'a', text: '8 m/s' }, { id: 'b', text: '10 m/s' }, { id: 'c', text: '11 m/s' }, { id: 'd', text: '13 m/s' }],
            correct: 'c' },
          { id: 'qq3', text: 'The slope of a velocity-time graph represents:',
            options: [{ id: 'a', text: 'Speed' }, { id: 'b', text: 'Distance' }, { id: 'c', text: 'Acceleration' }, { id: 'd', text: 'Displacement' }],
            correct: 'c' },
          { id: 'qq4', text: 'A body is moving with uniform velocity. Its acceleration is:',
            options: [{ id: 'a', text: 'Positive' }, { id: 'b', text: 'Negative' }, { id: 'c', text: 'Zero' }, { id: 'd', text: 'Constant but non-zero' }],
            correct: 'c' },
          { id: 'qq5', text: 'The area under a velocity-time graph gives:',
            options: [{ id: 'a', text: 'Acceleration' }, { id: 'b', text: 'Speed' }, { id: 'c', text: 'Displacement' }, { id: 'd', text: 'Force' }],
            correct: 'c' },
        ],
      },
    },
  ],
  's9_4': [
    {
      id: 't20', title: 'The Fun They Had', order: 1,
      duration: '35 min', difficulty: 'Easy', diffColor: 'text-green-600 bg-green-50',
      summary: 'A story by Isaac Asimov imagining education in the future with mechanical teachers.',
      content: `## The Fun They Had – Isaac Asimov

---

### 📖 About the Story
"The Fun They Had" is a science fiction short story by **Isaac Asimov**, written in **1951**. It imagines what schooling will be like in the year **2157**.

---

### 📝 Characters
- **Margie** – An 11-year-old girl living in 2157
- **Tommy** – Margie's 13-year-old neighbour
- **Margie's Mother** – Strict about Margie's studies
- **The County Inspector** – A specialist who repairs mechanical teachers

---

### 🤖 Main Theme
In 2157, children study at home with **mechanical teachers** (robots). Tommy finds an old physical **book** from 2157 and both are amazed. They read about how children in the "old days" went to a **real school** with a **human teacher**.

Margie imagines how much fun those children must have had — studying together, laughing together, going home together. She compares it to her lonely mechanical teacher and feels nostalgic for something she never experienced.

---

### 💡 Key Message
The story contrasts **technology-based education** vs **human-based education** and reflects on the value of human connection in learning.

---

### ✏️ Important Vocabulary
- **Scornful** – Showing contempt
- **Loftily** – In a superior manner
- **Dispute** – Argument
- **Geared** – Adjusted to suit someone`,
      quiz: {
        id: 'q20', title: 'The Fun They Had Quiz', timeLimit: 8,
        questions: [
          { id: 'qq1', text: 'Who wrote "The Fun They Had"?',
            options: [{ id: 'a', text: 'R.K. Narayan' }, { id: 'b', text: 'Isaac Asimov' }, { id: 'c', text: 'Mark Twain' }, { id: 'd', text: 'Ruskin Bond' }],
            correct: 'b' },
          { id: 'qq2', text: 'The story is set in which year?',
            options: [{ id: 'a', text: '2057' }, { id: 'b', text: '2100' }, { id: 'c', text: '2157' }, { id: 'd', text: '2257' }],
            correct: 'c' },
          { id: 'qq3', text: 'What did Tommy find that amazed Margie?',
            options: [{ id: 'a', text: 'A robot teacher' }, { id: 'b', text: 'A real printed book' }, { id: 'c', text: 'An old photograph' }, { id: 'd', text: 'A time machine' }],
            correct: 'b' },
          { id: 'qq4', text: 'What is Margie\'s mechanical teacher\'s main problem in the story?',
            options: [{ id: 'a', text: 'It is too strict' }, { id: 'b', text: 'It gives too much homework' }, { id: 'c', text: 'The geography section was too fast for her' }, { id: 'd', text: 'It never spoke' }],
            correct: 'c' },
          { id: 'qq5', text: 'What does Margie think about the old schools?',
            options: [{ id: 'a', text: 'They were boring' }, { id: 'b', text: 'They were fun because children were together' }, { id: 'c', text: 'They were very advanced' }, { id: 'd', text: 'She did not think about them' }],
            correct: 'b' },
        ],
      },
    },
  ],
};

export const getTopics = (subjectId) => TOPICS[subjectId] || [];

export const DEMO_USER = {
  id: 'demo_1',
  name: 'Arjun Sharma',
  email: 'demo@syllix-learn.com',
  phone: '9876543210',
  age: 15,
  classGrade: 9,
  board: 'CBSE',
  selectedSubjects: ['s9_1', 's9_2', 's9_4'],
  avatar: 'AS',
};

export const DEMO_SCORES = [
  { id: 'sc1', topicId: 't1',  topicName: 'Number Systems',          subjectName: 'Mathematics', subjectId: 's9_1', score: 4, total: 5, timeTaken: 312, date: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'sc2', topicId: 't10', topicName: 'Matter in Our Surroundings', subjectName: 'Science',  subjectId: 's9_2', score: 3, total: 5, timeTaken: 290, date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'sc3', topicId: 't2',  topicName: 'Polynomials',             subjectName: 'Mathematics', subjectId: 's9_1', score: 2, total: 5, timeTaken: 420, date: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'sc4', topicId: 't20', topicName: 'The Fun They Had',        subjectName: 'English',     subjectId: 's9_4', score: 5, total: 5, timeTaken: 195, date: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'sc5', topicId: 't11', topicName: 'Atoms and Molecules',     subjectName: 'Science',     subjectId: 's9_2', score: 3, total: 5, timeTaken: 380, date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'sc6', topicId: 't3',  topicName: 'Lines and Angles',        subjectName: 'Mathematics', subjectId: 's9_1', score: 4, total: 5, timeTaken: 265, date: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: 'sc7', topicId: 't12', topicName: 'Motion',                  subjectName: 'Science',     subjectId: 's9_2', score: 5, total: 5, timeTaken: 310, date: new Date(Date.now() - 86400000 * 7).toISOString() },
];
