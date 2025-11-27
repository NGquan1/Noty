import Project from "../models/project.model.js";
import Column from "../models/column.model.js";
import Note from "../models/note.model.js";
import Calendar from "../models/calendar.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const aiGenerateProject = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { name, description, startDate, deadline, members, goals } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
You are an expert Senior Project Manager.
Your goal is to create a highly detailed, actionable project plan.

**CRITICAL INSTRUCTION: SEPARATE TASKS**
- Do NOT group multiple tasks into one card.
- Create **MANY individual cards**.
- Each card should represent a single, atomic task.
- If a phase has 5 steps, generate **5 separate cards**, not 1 card with 5 steps.

**Project Context:**
- **Name:** ${name}
- **Description:** ${description}
- **Start Date:** ${startDate}
- **Deadline:** ${deadline}
- **Team Members:** ${members}
- **Strategic Goals:** ${goals}

**Output Schema (Strict JSON):**
{
  "cards": [
    {
      "title": "Specific Task Title (e.g., 'Design Database Schema')",
      "member": "Assigned Member Name"
    },
    {
      "title": "Next Specific Task (e.g., 'Setup CI/CD Pipeline')",
      "member": "Assigned Member Name"
    }
  ],
  "notes": [
    {
      "title": "Strategic Insight",
      "content": "Detailed advice..."
    }
  ],
  "events": [
    {
      "title": "Kickoff Meeting",
      "description": "Agenda...",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "location": "Online"
    }
  ]
}

**Rules for "WOW" Quality:**
1. **Granularity**: Break down the project into at least 10-15 separate cards if possible.
2. **Specificity**: Titles should be action-oriented (e.g., "Write API Documentation" instead of just "Docs").
3. **Distribution**: Assign cards intelligently to members.
4. **Notes**: Provide high-value strategic advice in the notes.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text =
      typeof response.text === "function" ? await response.text() : "";

    let aiData;
    try {
      aiData = JSON.parse(text);
    } catch (err) {
      console.warn("⚠️ Gemini returned invalid JSON. Using fallback data.");
      aiData = {
        cards: [
          { title: "Research Requirements", member: "Member 1" },
          { title: "Draft Initial Design", member: "Member 2" },
          { title: "Setup Project Repo", member: "Member 1" },
        ],
        notes: [
          {
            title: "Getting Started",
            content: "Break down tasks into small, manageable chunks.",
          },
        ],
        events: [
          {
            title: "Kickoff",
            description: "Project start meeting",
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date().toISOString().slice(0, 10),
            location: "Online",
          },
        ],
      };
    }

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: Array.isArray(members) ? members : [req.user._id],
      deadline,
    });

    const columnTitles = ["To-do", "In Progress", "Finished"];
    const createdColumns = [];
    for (const title of columnTitles) {
      const column = await Column.create({
        title,
        user: req.user._id,
        project: project._id,
        cards: [],
      });
      createdColumns.push(column);
    }

    // Process Cards - One Card per Task
    if (Array.isArray(aiData.cards) && aiData.cards.length > 0) {
      const todoColumn = createdColumns.find((c) => c.title === "To-do");
      if (todoColumn) {
        const cards = aiData.cards.map((card) => ({
          member: card.member || "Unassigned",
          tasks: [card.title || "Untitled Task"], // Single task per card
          status: "to-do",
          user: req.user._id,
        }));
        todoColumn.cards.push(...cards);
        await todoColumn.save();
      }
    }

    // Process Notes
    if (Array.isArray(aiData.notes)) {
      for (const note of aiData.notes) {
        const title = note.title || "AI Insight";
        const content = note.content || (typeof note === "string" ? note : JSON.stringify(note));
        
        await Note.create({
          title: title.slice(0, 100),
          content: content,
          user: req.user._id,
          projectId: project._id,
        });
      }
    }

    // Process Events
    if (Array.isArray(aiData.events)) {
      for (const ev of aiData.events) {
        await Calendar.create({
          title: ev.title || "Untitled Event",
          description: ev.description || "",
          startDate: ev.startDate || null,
          endDate: ev.endDate || null,
          location: ev.location || "",
          labels: ev.labels || "meeting",
          client: ev.client || "",
          shareWith: [],
          file: "",
          user: req.user._id,
          project: project._id.toString(),
          deadline: deadline ? new Date(deadline) : null,
        });
      }
    }

    return res.status(201).json({
      project,
      aiData,
      message:
        "AI has generated a detailed project plan with individual tasks for clarity!",
    });
  } catch (err) {
    console.error("AI Generate Project Error:", err);
    return res.status(500).json({ error: err.message });
  }
};
