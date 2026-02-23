import WordleClone from "../../public/assets/wordle-clone.png";

const MyData = {
  name: "Sandesh Lawhale",
  sidename: "Unknown Legend ",
  retro: "https://sandeshlawhaleterminal.vercel.app",
  post: "A Full-Stack Web Developer.",
  email: "sandeshlawhale@gmail.com",
  state: "MH",
  country: "India",
  cords: "21.1466° N, 79.0889° E",
  socials: [
    {
      title: "X",
      href: "https://x.com/lawhale_sandesh",
      icon: "../assets/svg/x.svg",
    },
    {
      title: "LinkedIn",
      href: "https://linkedin.com/in/lawhalesandesh",
      icon: "../assets/svg/linkedin2.svg",
    },
    {
      title: "Github",
      href: "https://github.com/sandeshlawhale",
      icon: "../assets/svg/github.svg",
    },
    {
      title: "Instagram",
      href: "https://www.instagram.com/_exotic.sandesh",
      icon: "../assets/svg/instagram.svg",
    },
    // { title: "youtube", href: "/", icon: "../assets/svg/youtube.svg" },
  ],
  about: [
    {
      desc: "I'm Sandesh Lawhale, a detail-oriented Full-Stack Developer with expertise in the MERN stack, based in India.",
    },
    {
      desc: "With great experience, specializes in building user-friendly, scalable applications that deliver seamless performance.",
    },
    {
      desc: "Whether collaborating with teams or leading development efforts, my dedication to excellence and strong analytical skills ensure impactful and efficient solutions.",
    },
  ],
};

const NavLinks = [
  {
    id: 1,
    key: "1",
    title: "Home",
    href: "/",
    logo: "/assets/svg/home.svg",
  },
  {
    id: 2,
    key: "2",
    title: "Projects",
    href: "/projects",
    logo: "/assets/svg/command.svg",
  },
  // {
  //   id: 3,
  //   key: "3",
  //   title: "Blogs",
  //   href: "/blogs",
  //   logo: "/assets/svg/edit.svg",
  // },
  // {
  //   id: 3,
  //   key: "3",
  //   title: "Skills",
  //   href: "/skills",
  //   logo: "/assets/svg/layers.svg",
  // },
  {
    id: 3,
    key: "3",
    title: "About",
    href: "/about",
    logo: "/assets/svg/user.svg",
  },
  {
    id: 4,
    key: "4",
    title: "Contact",
    href: "/contact",
    logo: "/assets/svg/mail.svg",
  },
  {
    id: 5,
    key: "control + k",
    title: "Search",
    href: "/search",
    logo: "/assets/svg/search.svg",
  },
];

const TechStack = {
  frontend: [
    {
      title: "React.js",
      logo: "../assets/svg/react.svg",
    },
    {
      title: "Next.js",
      logo: "../assets/svg/nextjs.svg",
    },
    {
      title: "Typescript",
      logo: "../assets/svg/typescript.svg",
    },
    {
      title: "Tailwind",
      logo: "../assets/svg/tailwind.svg",
    },
    {
      title: "Git",
      logo: "../assets/svg/github-fill.svg",
    },
  ],
  backend: [
    {
      title: "Node.js",
      logo: "../assets/svg/nodejs.svg",
    },
    {
      title: "Express.js",
      logo: "../assets/svg/express.svg",
    },
    {
      title: "MongoDb",
      logo: "../assets/svg/mongodb.svg",
    },
    {
      title: "Firebase",
      logo: "../assets/svg/firebase.svg",
    },
  ],
};

const MyGames = [
  {
    name: "Wordle Clone",
    slug: "wordle-clone",
    img: WordleClone,
    git: "https://github.com/sandeshlawhale/wordle-clone",
    demo: "https://wordleclonebysandesh.netlify.app/",
    shortDescription:
      "A React-based Wordle game clone with custom improvements, built for learning and fun.",
    timeline: "Feb 2024 – Mar 2024",
    role: "Frontend Developer",
    outcome:
      "Successfully implemented a Wordle-like game using React with custom keyboard input, routing, and improved UI.",
    detail: [
      {
        desc: "Developed the game from scratch using React.js, focusing on implementing the core gameplay mechanics. This includes the logic for word guessing, providing dynamic feedback with color highlights based on the accuracy of each guess, and enforcing the attempt limit to enhance the challenge and excitement of the game.",
      },
      {
        desc: "Designed and integrated a fully custom virtual keyboard to improve user interaction within the game. In addition to the virtual keyboard, I ensured seamless compatibility with physical keyboard inputs, allowing players to use whichever method they prefer for typing their guesses.",
      },
      {
        desc: "In addition to the core game mechanics, I enhanced the original tutorial version by introducing multiple pages, such as a home page, game page, and a results page. I also significantly improved the user interface, making it more visually appealing and user-friendly, incorporating smooth animations and interactive elements to engage users.",
      },
      {
        desc: "Throughout the development process, I gained valuable hands-on experience in React's state management, particularly with `useState` and `useEffect`, which were essential for handling game state and user input. I also worked with conditional rendering to display different UI elements based on game progress, and implemented event handlers to manage user interactions efficiently.",
      },
      {
        desc: "Once the game was fully developed, I deployed the final version to Netlify for public access. This deployment made it easy for anyone to play the game online and provided a stable, live environment for users to enjoy. You can try out the game yourself by visiting the following link: [Play the Game](https://wordleclonebysandesh.netlify.app).",
      },
    ],
  },
];

const Stack = {
  software: [
    {
      title: "Next.js",
      image: "../assets/svg/nextjs.svg",
      desc: "FW",
      key: "n",
    },
    {
      title: "React.js",
      image: "/assets/svg/reactjs.png",
      desc: "Library",
      key: "r",
    },
    {
      title: "Tailwind",
      image: "../assets/svg/tailwindcss.svg",
      desc: "Styling",
      key: "t",
    },
    {
      title: "Node.js",
      image: "../assets/svg/node.svg",
      desc: "Runtime",
      key: "n",
    },
    {
      title: "Express.js",
      image: "../assets/svg/express.svg",
      desc: "Backend",
      key: "e",
    },
    {
      title: "MongoDB",
      image: "../assets/svg/mongodb.svg",
      desc: "Database",
      key: "d",
    },
    {
      title: "VS Code",
      image: "../assets/svg/vsc.svg",
      desc: "Editor",
      key: "v",
    },
    {
      title: "Arc",
      image: "../assets/svg/arc.svg",
      desc: "Browser",
      key: "a",
    },
    {
      title: "Postman",
      image: "/assets/svg/postman.png",
      desc: "Testing",
      key: "p",
    },
    {
      title: "Motion",
      image: "../assets/svg/framer-motion.svg",
      desc: "Animation",
      key: "o",
    },
    {
      title: "Git",
      image: "../assets/svg/github-fill.svg",
      desc: "Versioning",
      key: "g",
    },
    {
      title: "Figma",
      image: "../assets/svg/figma.svg",
      desc: "Design",
      key: "f",
    },
  ],
};

const Experience = [
  {
    id: "exp-1",
    company: {
      name: "TruScholar",
      logo: "/assets/company/truscholar.png",
      website: "https://truscholar.com"
    },
    role: "Full Stack Dev Intern",
    status: "Completed",
    location: {
      type: "On-site",
      city: "Amravati, MH."
    },
    duration: {
      start: "Feb 25",
      end: "Nov 25"
    },
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Razorpay",
      "DigiLocker API",
      "LangChain",
    ],
    responsibilities: [
      "Built frontend interfaces and REST APIs for a municipal certificate issuance, reissuance, and verification system, reducing manual processing overhead.",
      "Developed responsive dashboards and reusable UI components for a Supply Chain Management System to ensure transparent product tracking.",
      "Integrated DigiLocker after legacy verification deprecation, restoring seamless digital certificate access.",
      "Improved a wallet mobile application by fixing UI issues and integrating Razorpay for subscription-based payments."
    ]
  }
];


export { MyData, NavLinks, TechStack, MyGames, Stack, Experience };
