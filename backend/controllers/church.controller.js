import mongoose from "mongoose";
import Church from "../models/church.model.js";

export const getChurches = async (req, res) => {
  try {
    const churches = await Church.find({});
    res.status(200).json({ success: true, data: churches });
  } catch (error) {
    console.log("error in fetching churches:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getOneChurch = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Church Id" });
  }

  try {
    const church = await Church.findById(id);
    if (!church) {
      return res
        .status(404)
        .json({ success: false, message: "Church not found" });
    }
    res.status(200).json({ success: true, data: church });
  } catch (error) {
    console.error("Error fetching church:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createChurch = async (req, res) => {
  const church = req.body;

  // Check if user is authorized (not a churchgoer)
  if (req.user.isChurchgoer) {
    return res.status(403).json({
      success: false,
      message: "Only church representatives can create churches",
    });
  }

  if (
    !church.name ||
    !church.address ||
    !church.city ||
    !church.state ||
    !church.email ||
    !church.website ||
    !church.image
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if a church with the same name and address already exists
    const existingChurch = await Church.findOne({
      name: church.name,
      address: church.address,
    });

    if (existingChurch) {
      return res.status(400).json({
        success: false,
        message: "A church with this name and address already exists",
      });
    }

    const newChurch = new Church(church);
    await newChurch.save();
    res.status(201).json({ success: true, data: newChurch });
  } catch (error) {
    console.error("Error in Creating Church:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateChurch = async (req, res) => {
  const { id } = req.params;
  const church = req.body;

  // Check if user is authorized (not a churchgoer)
  if (req.user.isChurchgoer) {
    return res.status(403).json({
      success: false,
      message: "Only church representatives can update churches",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Church Id" });
  }

  if (
    !church.name ||
    !church.address ||
    !church.city ||
    !church.state ||
    !church.email ||
    !church.website ||
    !church.image
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const updatedChurch = await Church.findByIdAndUpdate(id, church, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedChurch });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteChurch = async (req, res) => {
  const { id } = req.params;

  // Check if user is authorized (not a churchgoer)
  if (req.user.isChurchgoer) {
    return res.status(403).json({
      success: false,
      message: "Only church representatives can delete churches",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Church Id" });
  }

  try {
    await Church.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Church deleted" });
  } catch (error) {
    console.log("error in deleting church:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
