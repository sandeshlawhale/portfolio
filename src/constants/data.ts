import TraverseLandingPage from "../../public/assets/TraverseLandingPage.png";
import TruenoWheels from "../../public/assets/TruenoWheels.png";
import FoodieLandingPage from "../../public/assets/FoodieLandingPage.jpeg";
import WordleClone from "../../public/assets/wordle-clone.png";
import ChatApp from "../../public/assets/chat-app.png";

const MyData = {
  name: "Sandesh Lawhale",
  sidename: "Unknown Legend ",
  post: "Full-Stack Developer.",
  email: "sandeshlawhale@gmail.com",
  state: "MH",
  country: "India",
  cords: "21.1466° N, 79.0889° E",
  socials: [
    {
      title: "x.com",
      href: "/",
      icon: "../assets/svg/x.svg",
    },
    {
      title: "linkedIn",
      href: "/",
      icon: "../assets/svg/linkedin2.svg",
    },
    {
      title: "github",
      href: "https://github.com/sandeshlawhale",
      icon: "../assets/svg/github.svg",
    },
    {
      title: "instagram",
      href: "https://www.instagram.com/_exotic.sandesh/",
      icon: "../assets/svg/instagram.svg",
    },
    { title: "youtube", href: "/", icon: "../assets/svg/youtube.svg" },
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
    title: "Work",
    href: "/work",
    logo: "/assets/svg/command.svg",
  },
  // {
  //   id: 3,
  //   key: "3",
  //   title: "Blogs",
  //   href: "/blogs",
  //   logo: "/assets/svg/edit.svg",
  // },
  {
    id: 3,
    key: "3",
    title: "Skills",
    href: "/skills",
    logo: "/assets/svg/layers.svg",
  },
  {
    id: 4,
    key: "4",
    title: "About",
    href: "/about",
    logo: "/assets/svg/user.svg",
  },
  {
    id: 5,
    key: "5",
    title: "Contact",
    href: "/contact",
    logo: "/assets/svg/mail.svg",
  },
  {
    id: 6,
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

const MyProjects = [
  {
    name: "Trueno Wheels (Hot Wheels E-commerce Site)",
    slug: "trueno_wheels",
    img: TruenoWheels,
    git: "https://github.com/sandeshlawhale/trueno-wheels",
    demo: "https://trueno-wheels.vercel.app/",
    shortDescription:
      "A dynamic e-commerce platform built with the MERN stack, focusing on selling collectible Hot Wheels cars with animations and blog integration.",
    timeline: "Ongoing",
    role: "Full-Stack Developer",
    outcome:
      "Created an engaging e-commerce experience with interactive UI elements, category-based filtering, and a blog section for car enthusiasts.",
    detail: [
      {
        desc: "Trueno Wheels is an e-commerce platform dedicated to Hot Wheels collectors, developed using the MERN stack. The project aims to provide an immersive shopping experience by featuring interactive animations, smooth navigation, and high-quality images of collectible models. The site includes a catalog where users can browse through various car models, filter them by category, and check details like scale, year, and availability.",
      },
      {
        desc: "One of the standout features of Trueno Wheels is its dynamic animations. When users navigate the site, a car animation appears on screen, enhancing the browsing experience. Additionally, the site includes a 'Car of the Day' section, highlighting rare and trending Hot Wheels models, which updates regularly.",
      },
      {
        desc: "Beyond just an e-commerce platform, Trueno Wheels incorporates a blog section where enthusiasts can read about the history of different car models, comparisons between Hot Wheels and their real-life counterparts, and collector tips. The website is still a work in progress, with planned features like merchandise sales and user authentication for personalized shopping experiences.",
      },
    ],
  },
  {
    name: "Traverse Landing Page",
    slug: "traverse_landing_page",
    img: TraverseLandingPage,
    git: "https://github.com/sandeshlawhale/traverse-landing-page",
    demo: "https://traverselandingpage.netlify.app/",
    shortDescription:
      "A sleek and modern travel landing page designed to inspire and engage travelers with immersive visuals and intuitive UI.",
    timeline: "Completed",
    role: "Frontend Developer",
    outcome:
      "Developed a visually appealing and fully responsive landing page that enhances user engagement and encourages travel exploration.",
    detail: [
      {
        desc: "The Traverse Landing Page is a modern and engaging website designed to attract travel enthusiasts. It features **stunning visuals, well-structured content, and intuitive navigation**, creating an immersive browsing experience. The design focuses on showcasing travel destinations while keeping the layout clean and interactive.",
      },
      {
        desc: "A key aspect of this project was ensuring **responsiveness and smooth animations**. The landing page adapts seamlessly across different screen sizes, providing a great experience on desktops, tablets, and mobile devices. The use of hover effects, transitions, and subtle animations enhances the overall user interaction.",
      },
      {
        desc: "The landing page includes sections such as a **hero banner with an inspiring travel message, featured destinations, testimonials, and a call-to-action section** to encourage bookings. The thoughtful placement of elements and engaging imagery creates an appealing platform for travelers looking for their next adventure.",
      },
    ],
  },
  {
    name: "Chat Application",
    slug: "chat_application",
    img: ChatApp,
    git: "https://github.com/sandeshlawhale/Chat-App",
    demo: "https://chatapp-ed6f0.web.app/",
    shortDescription:
      "A real-time chat application built using ReactJS and Firebase, featuring instant messaging, emoji support, and image sharing.",
    timeline: "Ongoing",
    role: "Full-Stack Developer",
    outcome:
      "Successfully built a functional and responsive chat application with real-time messaging, improving user communication.",
    detail: [
      {
        desc: "Chat Application 2.0 is a real-time messaging platform developed using ReactJS for the frontend and Firebase for backend services. The app supports instant messaging, where users can send text messages, emojis, and images in real time. Firebase Authentication is integrated to allow users to log in securely, ensuring a seamless experience across multiple devices.",
      },
      {
        desc: "One of the main challenges during development was handling real-time updates and ensuring messages appeared instantly without delay. This was achieved using Firebase Firestore, which enables real-time data synchronization. Additionally, I implemented Firebase Storage to allow users to upload and send images in chats, enhancing the interaction experience.",
      },
      {
        desc: "The UI is designed with responsiveness in mind, ensuring a smooth experience on desktops. Although mobile responsiveness is not yet implemented, the app is structured in a way that allows easy future enhancements. The chat interface includes features like message timestamps, a message input field with emoji support, and smooth UI animations to enhance usability.",
      },
    ],
  },
  {
    name: "Voting System",
    slug: "voting_system",
    git: "https://github.com/sandeshlawhale/MERN-vote-pp/tree/master",
    shortDescription:
      "A MERN-based voting system that allows users to create polls, vote in real time, and view graphical results using Chart.js.",
    timeline: "Completed",
    role: "Full-Stack Developer",
    outcome:
      "Developed a fully functional, secure, and scalable voting system, enhancing user engagement in decision-making processes.",
    detail: [
      {
        desc: "The Voting System is a full-stack web application built using MongoDB, Express.js, React.js, and Node.js (MERN stack). The goal was to create a secure platform where users can participate in polls, cast their votes, and view live results dynamically. The application uses JWT-based authentication to ensure that only registered users can vote, preventing multiple entries.",
      },
      {
        desc: "To provide real-time updates, I integrated WebSockets via Socket.IO, enabling instant updates when a user votes. This ensures that all users viewing a poll see live changes in the results without needing to refresh the page. The voting results are displayed using Chart.js, offering a visually appealing and clear representation of the data.",
      },
      {
        desc: "One of the key challenges in this project was preventing duplicate voting while maintaining a smooth user experience. This was solved by implementing unique user IDs and storing vote status in MongoDB. Additionally, the UI is designed to be clean and intuitive, allowing users to navigate easily between polls and results.",
      },
    ],
  },
  {
    name: "Foodie Landing Page",
    slug: "foodie_landing_page",
    img: FoodieLandingPage,
    git: "https://github.com/sandeshlawhale/Foodie-Landing-Page",
    demo: "https://foodielandingpage.netlify.app/",
    shortDescription:
      "A visually appealing and modern landing page for food lovers, designed with a clean UI and engaging elements.",
    timeline: "Completed",
    role: "Frontend Developer",
    outcome:
      "Successfully developed a responsive and interactive food landing page that enhances user engagement and brand presence.",
    detail: [
      {
        desc: "The Foodie Landing Page is a visually appealing website designed to attract food lovers and restaurant customers. Built with modern frontend technologies, the page features a **minimalistic and clean UI**, with vibrant food imagery, well-placed call-to-action buttons, and an easy-to-navigate layout.",
      },
      {
        desc: "One of the main focuses of this project was **responsiveness and smooth user experience**. The design adapts well across different screen sizes, ensuring a seamless browsing experience on desktops, tablets, and mobile devices. Various animations and transitions are used to enhance the user interaction, making the landing page visually engaging.",
      },
      {
        desc: "The landing page includes sections such as a **hero banner with an eye-catching tagline, featured dishes, customer reviews, and a contact form**. Each section is strategically placed to provide maximum user engagement and conversion. The use of high-quality images and well-thought-out typography adds to the overall appeal of the site.",
      },
    ],
  },
];

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
      desc: "Framework",
      key: "n",
    },
    {
      title: "React.js",
      image: "/assets/svg/reactjs.png",
      desc: "Library",
      key: "r",
    },
    {
      title: "Tailwind CSS",
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

export { MyData, NavLinks, TechStack, MyProjects, MyGames, Stack };
