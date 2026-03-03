export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string;
  experiences: WorkExperience[];
  projects: Project[];
  education: Education[];
  certifications: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  bullets: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  dates: string;
  details: string;
}

export const emptyResume: ResumeData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  summary: "",
  skills: "",
  experiences: [],
  projects: [],
  education: [],
  certifications: "",
};

export const sampleResume: ResumeData = {
  fullName: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "(555) 123-4567",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexjohnson",
  summary:
    "Results-driven software engineer with 5+ years of experience building scalable web applications. Proficient in React, TypeScript, and Node.js with a track record of improving application performance by up to 40%.",
  skills:
    "JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, AWS, Docker, CI/CD, REST APIs, GraphQL, Agile/Scrum",
  experiences: [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      dates: "Jan 2022 - Present",
      bullets:
        "Led migration of legacy monolith to microservices, reducing deployment time by 60%\nArchitected real-time data pipeline processing 2M+ events daily\nMentored 4 junior engineers, improving team velocity by 25%\nImplemented automated testing suite achieving 95% code coverage",
    },
    {
      id: "2",
      title: "Software Engineer",
      company: "StartupXYZ",
      location: "Remote",
      dates: "Jun 2019 - Dec 2021",
      bullets:
        "Built customer-facing dashboard used by 10K+ daily active users\nOptimized database queries reducing API response time by 40%\nDesigned and implemented OAuth 2.0 authentication system",
    },
  ],
  projects: [
    {
      id: "1",
      name: "Open Source CLI Tool",
      description: "A developer productivity tool with 500+ GitHub stars",
      bullets:
        "Built with Node.js and TypeScript, published to npm with 2K+ weekly downloads\nImplemented plugin architecture enabling community contributions",
    },
  ],
  education: [
    {
      id: "1",
      degree: "B.S. Computer Science",
      school: "University of California, Berkeley",
      dates: "2015 - 2019",
      details: "GPA: 3.8/4.0, Dean's List",
    },
  ],
  certifications: "AWS Certified Solutions Architect\nGoogle Cloud Professional Developer",
};
