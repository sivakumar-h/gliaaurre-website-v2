export interface JobOpening {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  aboutRole: string;
  responsibilities: string[];
  qualifications: string[];
  whatWereLookingFor: string[];
}

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: "mechanical-design-engineer",
    slug: "mechanical-design-engineer",
    title: "Mechanical Design Engineer",
    department: "Mechanical & Prototyping",
    location: "Noida",
    type: "Full-Time",
    summary:
      "Work on mechanical design, prototyping, and product development involving 3D printing, CNC machining, and precision assemblies.",
    aboutRole:
      "We are looking for a Mechanical Design Engineer to join our team and work on mechanical design, prototyping, and product development. The role will involve designing mechanical components and assemblies, developing prototypes using 3D printing, and working with CNC machining and manufacturing processes.",
    responsibilities: [
      "Design and develop mechanical components, parts, and assemblies.",
      "Create 3D models, detailed drawings, and engineering documentation.",
      "Work with CNC machining processes for development and manufacturing of components.",
      "Coordinate with the technical team to develop and improve mechanical designs.",
      "Identify design and manufacturing issues and work on practical solutions.",
      "Modify and optimize designs based on testing, prototyping, and feedback.",
      "Support the development of mechanical systems from concept to prototype.",
    ],
    qualifications: [
      "1–3 years of experience in Mechanical Design or a related role.",
      "Good understanding of mechanical design and 3D modelling.",
      "Hands-on experience with 3D printing, including relevant projects or practical work.",
      "Experience with CNC machining and understanding of machining processes.",
      "Proficiency in 3D CAD software such as SolidWorks, Creo, CATIA, Fusion 360, Bambu Studio, or equivalent.",
      "Ability to interpret and create engineering drawings.",
      "Good understanding of manufacturing and prototyping processes.",
      "Strong problem-solving skills.",
    ],
    whatWereLookingFor: [
      "Someone with practical mechanical design experience.",
      "Hands-on experience with 3D printing and prototyping.",
      "Understanding of how designs translate into actual manufactured components.",
      "Willingness to work hands-on and take ownership of tasks in an early-stage company.",
    ],
  },
];