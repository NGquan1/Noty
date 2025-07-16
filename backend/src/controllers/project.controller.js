import Project from '../models/project.model.js';
import Column from '../models/column.model.js';
import Note from '../models/note.model.js';

// Get all projects for the current user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = new Project({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update project name
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { name },
      { new: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete project and all related data
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Kiểm tra xem id có phải là một MongoDB ObjectId hợp lệ không
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid project ID format' });
    }

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete all related data
    await Column.deleteMany({ project: id });
    await Note.deleteMany({ project: id });
    
    res.json({ message: 'Project and all related data deleted' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(400).json({ error: err.message });
  }
};
