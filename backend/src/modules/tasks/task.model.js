import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  userId: mongoose.Schema.Types.ObjectId
});

export default mongoose.model("Task", taskSchema);
