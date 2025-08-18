// Sample data for testing the application
export const sampleQuizzes = [
  {
    title: "E-Waste Basics",
    description: "Test your knowledge about electronic waste and recycling fundamentals",
    category: "E-Waste Basics",
    points: 100,
    timeLimit: 10,
    difficulty: "easy" as const,
    status: "active" as const,
    questions: [
      {
        id: "1",
        question: "What does 'e-waste' stand for?",
        options: ["Electronic waste", "Energy waste", "Environmental waste", "Electrical waste"],
        correctAnswer: 0,
        explanation: "E-waste refers to electronic waste, which includes discarded electrical or electronic devices."
      },
      {
        id: "2", 
        question: "Which of these items is considered e-waste?",
        options: ["Old smartphone", "Plastic bottle", "Paper magazine", "Glass jar"],
        correctAnswer: 0,
        explanation: "Smartphones contain electronic components and are classified as e-waste when discarded."
      },
      {
        id: "3",
        question: "What percentage of e-waste is currently recycled globally?",
        options: ["Less than 20%", "About 50%", "More than 80%", "Nearly 100%"],
        correctAnswer: 0,
        explanation: "Unfortunately, less than 20% of e-waste is properly recycled globally, highlighting the need for better recycling programs."
      }
    ]
  },
  {
    title: "Recycling Methods",
    description: "Learn about different methods and processes used in e-waste recycling",
    category: "Recycling Methods",
    points: 150,
    timeLimit: 15,
    difficulty: "medium" as const,
    status: "active" as const,
    questions: [
      {
        id: "1",
        question: "What is the first step in e-waste recycling?",
        options: ["Shredding", "Collection and sorting", "Chemical treatment", "Melting"],
        correctAnswer: 1,
        explanation: "Collection and sorting is the crucial first step to separate different types of electronic devices and materials."
      },
      {
        id: "2",
        question: "Which precious metal is commonly recovered from e-waste?",
        options: ["Silver", "Gold", "Platinum", "All of the above"],
        correctAnswer: 3,
        explanation: "E-waste contains valuable precious metals including gold, silver, and platinum that can be recovered and reused."
      }
    ]
  }
];

export const sampleChallenges = [
  {
    title: "Device Collection Drive",
    description: "Organize a community e-waste collection event in your neighborhood or workplace",
    category: "Collection",
    points: 200,
    difficulty: "medium" as const,
    status: "active" as const,
    estimatedTime: 120,
    requirements: [
      "Set up a collection point for at least 4 hours",
      "Collect minimum 10 electronic devices",
      "Provide information about proper e-waste disposal",
      "Take photos of the collection event"
    ],
    creator: "EcoQuest Admin"
  },
  {
    title: "E-Waste Education Workshop",
    description: "Conduct an educational session about e-waste recycling for your community",
    category: "Education", 
    points: 150,
    difficulty: "easy" as const,
    status: "active" as const,
    estimatedTime: 60,
    requirements: [
      "Present to at least 5 people",
      "Cover basics of e-waste and recycling",
      "Provide actionable tips for proper disposal",
      "Document the session with photos or video"
    ],
    creator: "EcoQuest Admin"
  },
  {
    title: "Social Media Awareness Campaign",
    description: "Create and share content about e-waste recycling on social media platforms",
    category: "Awareness",
    points: 100,
    difficulty: "easy" as const,
    status: "active" as const,
    estimatedTime: 30,
    requirements: [
      "Create 3 informative posts about e-waste",
      "Share on at least 2 social media platforms",
      "Use relevant hashtags (#ewaste #recycling #sustainability)",
      "Engage with comments and questions"
    ],
    creator: "EcoQuest Admin"
  }
];

export const deviceCategories = [
  "Smartphone",
  "Laptop", 
  "Desktop Computer",
  "Tablet",
  "Monitor",
  "Television",
  "Printer",
  "Router/Modem",
  "Gaming Console",
  "Smart Watch",
  "Headphones/Earbuds",
  "Camera",
  "Battery",
  "Charger/Cable",
  "Other"
];

export const challengeCategories = [
  "Collection",
  "Recycling", 
  "Education",
  "Community",
  "Innovation",
  "Awareness"
];

export const quizCategories = [
  "E-Waste Basics",
  "Recycling Methods",
  "Environmental Impact", 
  "Technology",
  "Sustainability"
];
