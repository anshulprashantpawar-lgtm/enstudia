export type Category = "Tech" | "Business" | "Social Impact" | "Science" | "Arts & Media" | "Education";

/** seed = true means this is inspiration/featured placeholder content, not a real user project */
export const SEED_FLAG = true;

export interface Member {
  id: string;
  name: string;
  grade: string;
  school: string;
  avatar: string;
  skills: string[];
  bio: string;
  activeProjects: string[];
}

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: Category;
  stage: "Idea" | "Prototype" | "MVP" | "Growing";
  skillsNeeded: string[];
  members: Member[];
  openRoles: string[];
  createdAt: string;
  likes: number;
}

export const MEMBERS: Member[] = [
  {
    id: "m1",
    name: "Priya Sharma",
    grade: "11th Grade",
    school: "Lincoln High School",
    avatar: "PS",
    skills: ["React", "Node.js", "UI/UX Design", "Python"],
    bio: "Full-stack dev passionate about ed-tech and social good. Built 3 apps, won regional hackathon 2024.",
    activeProjects: ["p1", "p3"],
  },
  {
    id: "m2",
    name: "Marcus Williams",
    grade: "12th Grade",
    school: "Westview Academy",
    avatar: "MW",
    skills: ["Machine Learning", "Python", "Data Analysis", "Research"],
    bio: "ML nerd obsessed with climate tech. Interned at a climate startup last summer. MIT EA applicant.",
    activeProjects: ["p2"],
  },
  {
    id: "m3",
    name: "Sofia Reyes",
    grade: "10th Grade",
    school: "Eastside Preparatory",
    avatar: "SR",
    skills: ["Marketing", "Content Strategy", "Canva", "Social Media"],
    bio: "Grew a nonprofit's Instagram from 200 to 14k followers. Love storytelling and brand building.",
    activeProjects: ["p1", "p4"],
  },
  {
    id: "m4",
    name: "Ethan Park",
    grade: "11th Grade",
    school: "Lincoln High School",
    avatar: "EP",
    skills: ["iOS Development", "Swift", "Product Management", "Figma"],
    bio: "Built my first iOS app at 14. Interested in consumer apps that actually change daily habits.",
    activeProjects: ["p3"],
  },
  {
    id: "m5",
    name: "Amara Okonkwo",
    grade: "12th Grade",
    school: "Northside STEM Academy",
    avatar: "AO",
    skills: ["Business Development", "Finance", "Public Speaking", "Writing"],
    bio: "Founded a financial literacy club with 300+ members. Want to build tools that help underserved communities.",
    activeProjects: ["p4", "p5"],
  },
  {
    id: "m6",
    name: "Liam Chen",
    grade: "10th Grade",
    school: "Westview Academy",
    avatar: "LC",
    skills: ["Backend Development", "Go", "PostgreSQL", "System Design"],
    bio: "Self-taught backend dev. Obsessed with building things that scale. Currently learning distributed systems.",
    activeProjects: ["p2", "p6"],
  },
  {
    id: "m7",
    name: "Zoe Martinez",
    grade: "11th Grade",
    school: "Arts & Sciences Magnet",
    avatar: "ZM",
    skills: ["Video Production", "Animation", "After Effects", "Storytelling"],
    bio: "Documentary filmmaker and animator. Believe every project deserves great visual communication.",
    activeProjects: ["p5"],
  },
  {
    id: "m8",
    name: "Dev Patel",
    grade: "12th Grade",
    school: "Northside STEM Academy",
    avatar: "DP",
    skills: ["Robotics", "C++", "Hardware Prototyping", "CAD"],
    bio: "FIRST Robotics captain, 2x state qualifier. Obsessed with physical computing and hardware-software integration.",
    activeProjects: ["p6"],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "StudySync",
    shortDescription: "AI-powered study group matcher for college students navigating the same courses.",
    fullDescription:
      "StudySync solves one of the most frustrating parts of college — finding people to actually study with. We're building an app that analyzes your schedule, learning style, and courses to match you with compatible study partners. Think Tinder for study groups, but with actual substance. The MVP includes smart scheduling, shared note-taking spaces, and a focus timer with group accountability features. We're targeting community college students first since existing solutions ignore them entirely.",
    category: "Tech",
    stage: "Prototype",
    skillsNeeded: ["React Native", "Backend API", "UX Research", "Growth Marketing"],
    members: [MEMBERS[0], MEMBERS[2]],
    openRoles: ["Backend Developer", "UX Researcher", "Growth Marketer"],
    createdAt: "2024-11-14",
    likes: 47,
  },
  {
    id: "p2",
    name: "CarbonTrace",
    shortDescription: "Personal carbon footprint tracker that actually makes behavior change stick.",
    fullDescription:
      "Most carbon trackers guilt-trip you and then disappear. CarbonTrace is different — we use behavioral psychology principles and ML to make sustainable habits actually enjoyable. The app tracks your transportation, food, and purchases automatically by connecting to your bank and location data, then surfaces tiny swaps that add up to massive impact. We're building a social layer so you can compete with friends and see your collective impact. Currently in alpha with 80 beta users in our school district.",
    category: "Social Impact",
    stage: "MVP",
    skillsNeeded: ["iOS/Android Development", "Data Science", "UX Design"],
    members: [MEMBERS[1], MEMBERS[5]],
    openRoles: ["Mobile Developer", "Data Scientist"],
    createdAt: "2024-10-02",
    likes: 89,
  },
  {
    id: "p3",
    name: "Launchpad",
    shortDescription: "A curated marketplace where students can commission each other for real work.",
    fullDescription:
      "Why does freelancing require a portfolio you can only build by already having clients? Launchpad is a verified student marketplace where students hire each other for design, coding, video editing, writing, and more. Every transaction is school-email verified. We handle escrow, contracts, and dispute resolution. Students build real portfolios and earn real money; buyers get affordable skilled help. We're starting with 5 schools in our metro area and plan to expand regionally.",
    category: "Business",
    stage: "Idea",
    skillsNeeded: ["Full-Stack Development", "Legal/Contracts Research", "Community Building", "Payments Integration"],
    members: [MEMBERS[0], MEMBERS[3]],
    openRoles: ["Full-Stack Developer", "Operations Lead", "Legal Researcher"],
    createdAt: "2024-12-01",
    likes: 134,
  },
  {
    id: "p4",
    name: "MindBridge",
    shortDescription: "Anonymous peer support platform connecting students with trained teen counselors.",
    fullDescription:
      "1 in 5 teens experiences a mental health disorder, but most never seek help due to stigma and cost. MindBridge pairs students anonymously with trained peer counselors (older students who've completed a 40-hour certification program we designed with a licensed therapist). Conversations are moderated by AI for safety escalation. We're partnering with 3 school districts and have trained our first cohort of 25 peer counselors. This is the most meaningful thing I've ever worked on.",
    category: "Social Impact",
    stage: "Growing",
    skillsNeeded: ["Product Design", "Backend Engineering", "Psychology Background", "School Partnerships"],
    members: [MEMBERS[2], MEMBERS[4]],
    openRoles: ["Product Designer", "Backend Engineer"],
    createdAt: "2024-09-15",
    likes: 212,
  },
  {
    id: "p5",
    name: "The Unheard",
    shortDescription: "Documentary series spotlighting student entrepreneurs in underrepresented communities.",
    fullDescription:
      "The Unheard is a YouTube documentary series (and eventually a podcast) that profiles student entrepreneurs from communities that never make it onto Forbes 30 Under 30. We've already filmed 4 episodes featuring students from rural Texas, South Chicago, rural Appalachia, and Compton. Each 15-minute episode follows one student through their entrepreneurial journey — wins, failures, and everything in between. We're at 2,400 YouTube subscribers after 6 weeks and growing 30% week-over-week.",
    category: "Arts & Media",
    stage: "Growing",
    skillsNeeded: ["Video Editing", "Sound Design", "Sponsorship Outreach", "Social Media Strategy"],
    members: [MEMBERS[4], MEMBERS[6]],
    openRoles: ["Sound Designer", "Sponsorship Lead"],
    createdAt: "2024-10-20",
    likes: 178,
  },
  {
    id: "p6",
    name: "AquaBot",
    shortDescription: "Low-cost autonomous water quality monitoring system for rural communities.",
    fullDescription:
      "Millions of people in rural areas drink contaminated water because monitoring is expensive and infrequent. We're building AquaBot — a solar-powered floating sensor raft that continuously monitors pH, dissolved oxygen, nitrates, and bacteria levels in local water sources, and sends alerts to local health authorities via LoRaWAN (works without WiFi). The whole system costs under $80 to build. We've deployed 2 prototypes in local ponds and are working with a county health department to pilot in actual water sources.",
    category: "Science",
    stage: "Prototype",
    skillsNeeded: ["Embedded Systems", "Data Visualization", "Grant Writing", "Environmental Science"],
    members: [MEMBERS[5], MEMBERS[7]],
    openRoles: ["Data Visualization Developer", "Grant Writer"],
    createdAt: "2024-11-05",
    likes: 93,
  },
];

// All neutral — single warm palette, no colored category chips
export const CATEGORY_COLORS: Record<Category, string> = {
  Tech:           "bg-white text-ink-2 border-border",
  Business:       "bg-white text-ink-2 border-border",
  "Social Impact":"bg-white text-ink-2 border-border",
  Science:        "bg-white text-ink-2 border-border",
  "Arts & Media": "bg-white text-ink-2 border-border",
  Education:      "bg-white text-ink-2 border-border",
};

export const STAGE_COLORS: Record<Project["stage"], string> = {
  Idea:      "bg-white text-ink-3 border-border",
  Prototype: "bg-white text-ink-2 border-border",
  MVP:       "bg-white text-ink-2 border-border",
  Growing:   "bg-white text-ink-2 border-border",
};
