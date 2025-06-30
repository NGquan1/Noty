import Column from '../models/column.model.js';

export const createColumn = async (req, res) => {
  try {
    const { title } = req.body;
    const column = await Column.create({
      title,
      user: req.user._id,
      cards: [],
    });
    res.status(201).json(column);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getColumns = async (req, res) => {
  try {
    const columns = await Column.find({ user: req.user._id });
    res.status(200).json(columns);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const column = await Column.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title },
      { new: true }
    );
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }
    res.status(200).json(column);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const column = await Column.findOneAndDelete({ _id: id, user: req.user._id });
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }
    res.status(200).json({ message: 'Column deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addCard = async (req, res) => {
  try {
    const { id } = req.params; 
    const { member, tasks } = req.body;
    const column = await Column.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $push: { cards: { member, tasks } } },
      { new: true }
    );
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }
    res.status(200).json(column);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCard = async (req, res) => {
  try {
    const { id, cardId } = req.params;
    const { member, tasks } = req.body;
    const column = await Column.findOneAndUpdate(
      { _id: id, user: req.user._id, 'cards._id': cardId },
      { $set: { 'cards.$.member': member, 'cards.$.tasks': tasks } },
      { new: true }
    );
    if (!column) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.status(200).json(column);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { id, cardId } = req.params;
    const column = await Column.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $pull: { cards: { _id: cardId } } },
      { new: true }
    );
    if (!column) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.status(200).json(column);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
