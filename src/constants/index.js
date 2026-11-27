const dockApps = [
  {
    id: "profile",
    name: "About",
    icon: "/images/profile-icon.svg",
    section: "about",
    canOpen: true,
  },
  {
    id: "projects",
    name: "Projects",
    icon: "/images/projects-icon.svg",
    section: "projects",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contact",
    icon: "/images/contact-icon.svg",
    section: "contact",
    canOpen: true,
  },
  {
    id: "skills",
    name: "Skills",
    icon: "/images/skills-icon.svg",
    section: "skills",
    canOpen: true,
  },
];

const techStack = [
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "TypeScript"],
  },
  {
    category: "Styling",
    items: ["Tailwind CSS", "GSAP", "Framer-Motion", "CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "Solidity", "Supabase", "Appwrite", "Firebase"],
  },
  {
    category: "Database",
    items: ["PostgreSQL", "MongoDB"],
  },
  {
    category: "Dev Tools",
    items: ["Foundry", "Forge", "Git", "GitHub", "Docker"],
  },
];

const WORK_LOCATION = {
  id: 1,
  type: "work",
  name: "Work",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [
    {
      id: 5,
      name: "Nike Website",
      category: "Fashion E-commerce",
      technologies: ["HTML", "Tailwind CSS", "CSS", "JavaScript"],
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-10 left-5",
      windowPosition: "top-[5vh] left-5",
      children: [
        {
          id: 1,
          name: "Project description.txt",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "A fashion e-commerce website designed for apparel shopping, featuring an integrated shopping cart system and delivery services.",
          ],
        },
        {
          id: 2,
          name: "GitHub Repository",
          kind: "file",
          fileType: "url",
          linkType: "github",
          href: "https://github.com/Abdulateef410/Nike-website-repo",
          position: "top-10 right-20",
        },
        {
          id: 3,
          name: "Live Demo",
          kind: "file",
          fileType: "url",
          linkType: "live-demo",
          href: "https://nike-website-repo.vercel.app",
          position: "top-20 right-20",
        },
        {
          id: 4,
          name: "nike-website.png",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/projects/nike-website.png",
        },
      ],
    },
    {
      id: 6,
      name: "Coffee Cafe Website",
      category: "Food & Beverage",
      technologies: ["HTML", "CSS"],
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-10 left-5",
      windowPosition: "top-[5vh] left-5",
      children: [
        {
          id: 1,
          name: "Project description.txt",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "A coffee landing page designed to welcome customers and clients.",
          ],
        },
        {
          id: 2,
          name: "GitHub Repository",
          kind: "file",
          fileType: "url",
          linkType: "github",
          href: "https://github.com/Abdulateef410/Coffee-page",
          position: "top-10 right-20",
        },
        {
          id: 3,
          name: "Live Demo",
          kind: "file",
          fileType: "url",
          linkType: "live-demo",
          href: "https://coffee-chi-olive.vercel.app",
          position: "top-20 right-20",
        },
        {
          id: 4,
          name: "coffee-cafe-website.jpg",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/projects/coffee-cafe-website.jpg",
        },
      ],
    },
  ],
};

export const locations = {
  work: WORK_LOCATION,
};

export { dockApps, techStack };
