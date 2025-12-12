import { 
  BookOpen, 
  Video, 
  Calculator, 
  TrendingUp, 
  Users,
  Download
} from "lucide-react";

export const subjects = [
  {
    id: "physical-sciences",
    title: "Physical Sciences",
    icon: BookOpen,
    description: "Physics and Chemistry curriculum aligned with CAPS.",
    color: "bg-blue-500/10 text-blue-600",
    paper1: "Physics",
    paper2: "Chemistry",
    content: {
      paper1: [
        "Newton's Laws of Motion",
        "Vertical Projectile Motion",
        "Momentum & Impulse",
        "Work, Energy & Power",
        "Doppler Effect",
        "Electrostatics",
        "Electric Circuits",
        "Electrodynamics",
        "Photoelectric Effect"
      ],
      paper2: [
        "Organic Molecules",
        "Physical Properties of Organic Compounds",
        "Organic Reactions",
        "Rates of Reaction",
        "Chemical Equilibrium",
        "Acids and Bases",
        "Electrochemical Reactions",
        "The Fertilizer Industry"
      ]
    }
  },
  {
    id: "mathematics",
    title: "Mathematics",
    icon: Calculator,
    description: "Algebra, Calculus, Geometry and Trigonometry.",
    color: "bg-emerald-500/10 text-emerald-600",
    paper1: "Algebra & Calculus",
    paper2: "Geometry & Trig",
    content: {
      paper1: [
        "Patterns, Sequences & Series",
        "Functions & Inverses",
        "Exponential & Logarithmic Functions",
        "Finance, Growth & Decay",
        "Differential Calculus",
        "Probability",
        "Counting Principles"
      ],
      paper2: [
        "Euclidean Geometry",
        "Analytical Geometry",
        "Trigonometry: Ratios & Identities",
        "Trigonometry: 2D & 3D Problems",
        "Statistics",
        "Regression & Correlation"
      ]
    }
  },
  {
    id: "life-sciences",
    title: "Life Sciences",
    icon: Users,
    description: "Biology, Genetics, and Human Anatomy.",
    color: "bg-green-500/10 text-green-600",
    paper1: "Meiosis & Reproduction",
    paper2: "Genetics & Evolution",
    content: {
      paper1: [
        "Meiosis",
        "Reproduction in Vertebrates",
        "Human Reproduction",
        "Endocrine System & Homeostasis",
        "Response to the Environment (Plants)",
        "Response to the Environment (Humans)"
      ],
      paper2: [
        "DNA: Code of Life",
        "RNA & Protein Synthesis",
        "Genetics & Inheritance",
        "Evolution: Natural Selection",
        "Human Evolution"
      ]
    }
  },
  {
    id: "accounting",
    title: "Accounting",
    icon: TrendingUp,
    description: "Financial statements, companies and auditing.",
    color: "bg-amber-500/10 text-amber-600",
    paper1: "Financial Reporting",
    paper2: "Managerial Accounting",
    content: {
      paper1: [
        "Companies: Financial Statements",
        "Companies: Analysis & Interpretation",
        "Companies: Audit Reports",
        "Corporate Governance",
        "Inventory Systems"
      ],
      paper2: [
        "Cost Accounting & Manufacturing",
        "Budgeting",
        "VAT & Ethics",
        "Reconciliations",
        "Fixed Assets"
      ]
    }
  },
  {
    id: "geography",
    title: "Geography",
    icon: BookOpen,
    description: "Climatology, Geomorphology and Mapwork.",
    color: "bg-orange-500/10 text-orange-600",
    paper1: "Theory",
    paper2: "Mapwork",
    content: {
      paper1: [
        "Climate & Weather: Mid-latitude Cyclones",
        "Climate & Weather: Tropical Cyclones",
        "Subtropical Anticyclones",
        "Valley Climates & Urban Climates",
        "Geomorphology: Drainage Systems",
        "Geomorphology: Fluvial Processes",
        "Rural & Urban Settlement",
        "Economic Geography of SA"
      ],
      paper2: [
        "Mapwork Skills & Calculations",
        "Map Interpretation",
        "GIS (Geographical Information Systems)"
      ]
    }
  },
  {
    id: "economics",
    title: "Economics",
    icon: TrendingUp,
    description: "Macro and Micro-economics.",
    color: "bg-indigo-500/10 text-indigo-600",
    paper1: "Macro-economics",
    paper2: "Micro-economics",
    content: {
      paper1: [
        "Circular Flow",
        "Business Cycles",
        "Public Sector",
        "Foreign Exchange Markets",
        "Economic Growth & Development",
        "Inflation",
        "Tourism"
      ],
      paper2: [
        "Perfect Markets",
        "Imperfect Markets",
        "Market Failure",
        "Contemporary Economic Issues",
        "Environmental Sustainability"
      ]
    }
  },
  {
    id: "business-studies",
    title: "Business Studies",
    icon: Users,
    description: "Business operations, legislation and strategies.",
    color: "bg-purple-500/10 text-purple-600",
    paper1: "Business Environments",
    paper2: "Business Ventures",
    content: {
      paper1: [
        "Impact of Recent Legislation",
        "Human Resources Function",
        "Professionalism & Ethics",
        "Creative Thinking",
        "Macro Environment: Strategies",
        "Quality of Performance"
      ],
      paper2: [
        "Management & Leadership",
        "Investment: Securities",
        "Investment: Insurance",
        "Team Performance & Conflict Management",
        "Social Responsibility & CSR",
        "Human Rights, Inclusivity & Environmental Issues"
      ]
    }
  },
  {
    id: "math-literacy",
    title: "Mathematical Literacy",
    icon: Calculator,
    description: "Practical application of mathematical concepts.",
    color: "bg-teal-500/10 text-teal-600",
    paper1: "Finance & Data",
    paper2: "Maps & Measurement",
    content: {
      paper1: [
        "Finance: Interest, Banking, Inflation",
        "Finance: Taxation & Exchange Rates",
        "Data Handling: Statistics",
        "Probability"
      ],
      paper2: [
        "Measurement: Length, Weight, Volume",
        "Maps, Plans & Representations",
        "Scales & Models",
        "Probability (Applications)"
      ]
    }
  }
];

export const features = [
  {
    title: "Video Lessons",
    description: "High-quality recorded lessons for every chapter, available 24/7.",
    icon: Video
  },
  {
    title: "Live Classes",
    description: "Interactive weekly live sessions with expert teachers.",
    icon: Users
  }
];

export const pricingFeatures = [
  "Access to all video lessons",
  "Weekly live online lessons",
  "Downloadable notes & worksheets",
  "Progress tracking dashboard"
];
