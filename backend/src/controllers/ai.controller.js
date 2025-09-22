import Project from "../models/project.model.js";
import Column from "../models/column.model.js";
import Note from "../models/note.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const aiGenerateProject = async (req, res) => {
  try {
    const { name, description, deadline, members, goals } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `Generate a project plan for: ${name}\nDescription: ${description}\nDeadline: ${deadline}\nMembers: ${members}\nSpecial goals: ${goals}\nReturn a JSON with tasks (array of string), meetings (array of string), and notes (array of string).`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let aiData;
    try {
      aiData = JSON.parse(response.text());
    } catch (e) {
      aiData = {
        tasks: ["Task 1", "Task 2"],
        meetings: ["Kickoff meeting"],
        notes: ["Project created by AI"],
      };
    }

    const project = new Project({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
      deadline,
    });
    await project.save();

    const columns = [
      { title: "To-do", status: "todo" },
      { title: "In progress", status: "inprogress" },
      { title: "Finished", status: "finished" },
    ];
    for (const col of columns) {
      await Column.create({
        project: project._id,
        title: col.title,
        status: col.status,
        cards: [],
      });
    }

    if (aiData.notes && Array.isArray(aiData.notes)) {
      for (const note of aiData.notes) {
        await Note.create({ project: project._id, content: note });
      }
    }

    res.status(201).json({ project, aiData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
