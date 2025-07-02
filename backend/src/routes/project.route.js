import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/project.controller.js';

const router = express.Router();

router.use(protectRoute);
router.get('/', getProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
