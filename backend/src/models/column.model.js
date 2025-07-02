import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  member: { type: String, required: true },
  tasks: [{ type: String, required: true }],
});

const columnSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    cards: [cardSchema],
  },
  { timestamps: true }
);

const Column = mongoose.model('Column', columnSchema);
export default Column;
