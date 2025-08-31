import Option from "../models/option.model.js";

// Create new option
export const createOption = async (req, res) => {

   // console.log("User ID from req:", req.userId);
   // console.log("Option name:", req.body.name);
   // console.log(req.body);

  try {
    const option = new Option({
      name: req.body.name,
      userId: req.userId,
    });
    await option.save();
    res.status(201).json(option);
  } catch (err) {
    res.status(500).json({ error: "Failed to create option", details: err });
  }
};

// Get all options for logged-in user
export const getOptions = async (req, res) => {
  try {
    const options = await Option.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(options);
  } catch (err) {
    res.status(500).json({ error: "Failed to get options", details: err });
  }
};

// Update an option
export const updateOption = async (req, res) => {
  try {
    const updated = await Option.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name: req.body.name },
      { new: true }
    );
    if (!updated) return res.status(404).json("Option not found or unauthorized");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update option", details: err });
  }
};

// Delete an option
export const deleteOption = async (req, res) => {
  try {
    const deleted = await Option.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!deleted) return res.status(404).json("Option not found or unauthorized");
    res.json({ message: "Option deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete option", details: err });
  }
};
