// server/controllers/boardController.js
import Board from '../models/board.model.js'; // Import the Board model
import List from '../models/list.model.js';
import Card from '../models/card.model.js';
import Activity from '../models/activity.model.js'; 
import User from '../models/user.model.js';   // Import the User model (for member management)
import mongoose from "mongoose";
import { pushNotification } from "../utils/notify.js";

// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
export const createBoard = async (req, res) => {

    console.log(req.body);
    const { name, description, background } = req.body;

    // The 'req.user' object is available here because of the 'protect' middleware
    // It contains the authenticated user's ID and other details.
    const ownerId = req.userId;

    try {
        const board = new Board({
            name,
            description,
            background,
            owner: ownerId,
            members: [ownerId] // Owner is automatically a member
        });

        const createdBoard = await board.save();

        // Optionally, update the User model to include the board in their list of owned/member boards
        await User.findByIdAndUpdate(ownerId, { $push: { boards: createdBoard._id } });

        // Log activity
        const activity = new Activity({
            user: req.userId,
            action: 'created',
            board: board._id,
            details: `board '${board.name}'`
        });
        await activity.save();
        
        // Push activity to board
        board.activity.push(activity);
        await board.save();

        await pushNotification({
          userIds: [req.userId],
          type: "board",
          action: "created",
          entityId: board._id,
          message: `📝 Board "${board.name}" created.`,
        });

        res.status(201).json(createdBoard);
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).json({ message: 'Server error while creating board' });
    }
};

// @desc    Get all boards for the authenticated user (either as owner or member)
// @route   GET /api/boards
// @access  Private
export const getBoards = async (req, res) => {
    const userId = req.userId;

    try {
        // Find boards where the user is either the owner or a member
        const boards = await Board.find({
            $or: [
                { owner: userId },
                { members: userId }
            ]
        })
        .populate('owner', 'username email') // Populate owner details (only name and email)
        .populate('members', 'username email') // Populate member details
        .populate('lists', 'title order') // Populate lists (only title and order) - full lists will be fetched on board view
        .populate({
            path: 'activity',
            populate: {
                path: 'user',
                model: 'User',
                select: 'username email'
            }
        }) // ✅ populate activities with user info
        .sort({ createdAt: -1 });

        res.json(boards);
    } catch (error) {
        console.error('Error fetching boards:', error);
        res.status(500).json({ message: 'Server error while fetching boards' });
    }
};

// @desc    Get a single board by ID
// @route   GET /api/boards/:id
// @access  Private
export const getBoardById = async (req, res) => {
    const boardId = req.params.id;
    const userId = req.userId;

    try {
        const board = await Board.findById(boardId)
            .populate('owner', 'username email')
            .populate('members', 'username email')
            .populate({
                path: 'lists',
                populate: {
                    path: 'cards',
                    model: 'Card', // Explicitly specify model for nested population
                    populate: {
                        path: 'members', // Populate members on cards
                        model: 'User',
                        select: 'username email'
                    }
                },
                options: { sort: { 'order': 1 } } // Sort lists by order
            })
            .populate({
                path: 'activity',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'username email'
                }
            }); // ✅ populate activities

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Check if the user is a member or owner of the board
        const isMember = board.members.some(member => member._id.equals(userId));
        const isOwner = board.owner._id.equals(userId);

        if (!isMember && !isOwner) {
            return res.status(403).json({ message: 'Not authorized to access this board' });
        }

        res.json(board);
    } catch (error) {
        console.error('Error fetching board by ID:', error);
        // Handle CastError if ID is invalid format
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid board ID' });
        }
        res.status(500).json({ message: 'Server error while fetching board' });
    }
};


// @desc Get lists for a board
// @route GET /api/boards/:id/lists
// @access Private
export const getListsForBoard = async (req, res) => {
  const boardId = req.params.id;
  const userId = req.userId;

  try {
    const board = await Board.findById(boardId).populate('lists');

    if (!board) return res.status(404).json({ message: 'Board not found' });

    const isMember = board.members.includes(userId) || board.owner.equals(userId);
    if (!isMember) return res.status(403).json({ message: 'Not authorized' });

    res.json(board.lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching lists' });
  }
};



export const createListForBoard = async (req, res) => {
  const boardId = req.params.id;
  const { title } = req.body;
  const userId = req.userId;

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check user permissions
    const isMember = board.members.includes(userId);
    const isOwner = board.owner.equals(userId);
    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to add lists to this board' });
    }

    // Determine order
    const order = board.lists.length;

    const newList = new List({
      title,
      board: boardId,
      order,
      cards: [],
    });

    const savedList = await newList.save();

    // Add list ID to board.lists array
    board.lists.push(savedList._id);
    await board.save();

    res.status(201).json({ ...savedList.toObject(), cards: [] });
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ message: 'Server error creating list' });
  }
};




/**
 * @desc    Update a board
 * @route   PUT /api/boards/:id
 * @access  Private
 */
export const updateBoard = async (req, res) => {
  const boardId = req.params.id;
  const userId = req.userId; // From verifyToken middleware
  const { name, description, background } = req.body;

  try {
    const board = await Board.findById(boardId).populate('owner members', 'username email');

    if (!board) return res.status(404).json({ message: 'Board not found' });

    // Only owner or member can update
    const isOwner = board.owner._id.equals(userId);
    const isMember = board.members.some((m) => m._id.equals(userId));

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to update this board' });
    }

    let changes = [];
    if (name && name !== board.name) {
      changes.push(`renamed board to "${name}"`);
      board.name = name;
    }
    if (description && description !== board.description) {
      changes.push(`updated description`);
      board.description = description;
    }
    if (background && background !== board.background) {
      changes.push(`changed background`);
      board.background = background;
    }

    const updatedBoard = await board.save();
    // Create activity if changes exist
    if (changes.length > 0) {
      const activity = new Activity({
        user: userId,
        action: 'updated',
        board: board._id,
        details: changes.join(", "),
      });
      await activity.save();

      board.activity.push(activity);
      await board.save();

      await pushNotification({
        userIds: board.members,
        type: "board",
        action: "updated",
        entityId: board._id,
        message: `✏️ Board "${board.name}" updated: ${changes.join(", ")}`
      });
    }

    res.json(updatedBoard);

  } catch (err) {
    console.error('Error updating board:', err);
    res.status(500).json({ message: 'Server error while updating board' });
  }
};

/**
 * @desc    Delete a board
 * @route   DELETE /api/boards/:id
 * @access  Private
 */
export const deleteBoard = async (req, res) => {
  const boardId = req.params.id;
  const userId = req.userId;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    if (!board.owner.equals(userId)) {
      return res.status(403).json({ message: 'Only the owner can delete this board' });
    }

    // Cascade delete lists & cards
    await Card.deleteMany({ board: boardId });
    await List.deleteMany({ board: boardId });
    await Board.deleteOne({ _id: boardId });

    // Remove from owner's `boards` field
    await User.findByIdAndUpdate(userId, { $pull: { boards: boardId } });

    res.json({ message: 'Board deleted successfully' });
  } catch (err) {
    console.error('Error deleting board:', err);
    res.status(500).json({ message: 'Server error while deleting board' });
  }
};

/**
 * @desc    Add a member by email
 * @route   PUT /api/boards/:id/members
 * @access  Private (Owner or existing member)
 */
export const addBoardMember = async (req, res) => {
  const boardId = req.params.id;
  const { email } = req.body;
  const userId = req.userId;
  // console.log(req.body);
  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const isOwner = board.owner.equals(userId);
    const isMember = board.members.some((m) => m.equals(userId));
    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to add members' });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });

    if (board.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User already a member' });
    }

    board.members.push(userToAdd._id);
    await board.save();

    await User.findByIdAndUpdate(userToAdd._id, { $addToSet: { boards: boardId } });

    // Activity log
    const activity = new Activity({
      user: userId,
      action: 'added',
      board: board._id,
      details: `added ${userToAdd.username || userToAdd.email} to the board`
    });
    await activity.save();

    board.activity.push(activity);
    await board.save();

    await pushNotification({
      userIds: [userToAdd._id, ...board.members],
      type: "board",
      action: "member_added",
      entityId: board._id,
      message: `👥 ${userToAdd.username || userToAdd.email} added to board "${board.name}".`
    });

    const updatedBoard = await Board.findById(boardId).populate('members', 'username email');
    res.json(updatedBoard.members);

  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ message: 'Server error while adding member' });
  }
};

/**
 * @desc    Remove a member
 * @route   DELETE /api/boards/:id/members/:memberId
 * @access  Private (Owner or self)
 */
export const removeBoardMember = async (req, res) => {
  const boardId = req.params.id;
  const memberId = req.params.memberId;
  const userId = req.userId;

  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const isOwner = board.owner.equals(userId);
    const isSelf = userId === memberId;

    if (!isOwner && !isSelf) {
      return res.status(403).json({ message: 'Not authorized to remove this member' });
    }

    // Prevent removing owner
    if (board.owner.equals(memberId)) {
      return res.status(400).json({ message: 'Owner cannot be removed. Delete board instead.' });
    }

    const removedUser = await User.findById(memberId);
    board.members = board.members.filter((m) => !m.equals(memberId));
    await board.save();

    await User.findByIdAndUpdate(memberId, { $pull: { boards: boardId } });

    // Activity log
    const activity = new Activity({
      user: userId,
      action: 'removed',
      board: board._id,
      details: `removed ${removedUser?.username || removedUser?.email} from the board`
    });
    await activity.save();

    board.activity.push(activity);
    await board.save();

    await pushNotification({
      userIds: board.members,
      type: "board",
      action: "member_removed",
      entityId: board._id,
      message: `🚫 ${removedUser?.username || removedUser?.email} removed from board "${board.name}".`
    });

    res.json({ message: 'Member removed successfully' });
    
  } catch (err) {
    console.error('Error removing member:', err);
    res.status(500).json({ message: 'Server error while removing member' });
  }
};


/*
module.exports = {
    createBoard,
    getBoards,
    getBoardById,
    updateBoard,
    deleteBoard,
    addBoardMember,
    removeBoardMember
}; */





// ** LisyColumns & CardItems  ** //
// new approach to get alternate solution
// import Board from '../models/board.model.js';
// import List from '../models/list.model.js';
// import Card from '../models/card.model.js';

// Get Board by ID
export const getBoardByTheId = async (req, res) => {
  const boardId = req.params.id;
    const userId = req.userId;
  try {
    const board = await Board.findById(req.params.id)
      .populate({
        path: 'lists',
        populate: {
          path: 'cards',
          populate: 'labels'
        }
      });

    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create List
// import List from "../models/list.model.js";
// import Board from "../models/board.model.js";
// controllers/list.controller.js or board.controller.js

export const createList = async (req, res) => {
  try {
    const { title } = req.body;
    const { boardId } = req.params;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const order = board.lists.length;

    const newList = new List({
      title,
      board: board._id,
      cards: [],
      order
    });

    const savedList = await newList.save();

    // Push new list to board's list array
    board.lists.push(savedList._id);
    await board.save();

    res.status(201).json(savedList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// Update List Order
/*
export const updateListOrder = async (req, res) => {
  try {
    const { boardId, newListOrder } = req.body;
    const board = await Board.findByIdAndUpdate(boardId, { lists: newListOrder }, { new: true });
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
*/
// import Board from "../models/Board.js";
// import List from "../models/List.js";

// @desc    Update order of lists in a board
// @route   PUT /api/boards/:boardId/lists/reorder
// @access  Private
export const updateListOrder = async (req, res) => {
  const { boardId } = req.params;
  const { newListOrder } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Validate all list IDs
    const validListIds = await List.find({ _id: { $in: newListOrder } });
    if (validListIds.length !== newListOrder.length) {
      return res.status(400).json({ message: "One or more list IDs are invalid" });
    }

    board.lists = newListOrder.map(id => new mongoose.Types.ObjectId(id));
    await board.save();

    const updatedBoard = await board.populate({
      path: "lists",
      populate: { path: "cards" },
      options: { sort: { order: 1 } }
    });

    res.status(200).json(updatedBoard);
  } catch (error) {
    console.error("Error updating list order:", error);
    res.status(500).json({ message: "Server error while updating list order" });
  }
};



/*
export const createCard = async (req, res) => {
  const { listId } = req.params;
  const { title } = req.body;
  try {
    const newCard = new Card({ title, list: listId });
    await newCard.save();

    await List.findByIdAndUpdate(listId, { $push: { cards: newCard._id } });
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create card' });
  }
};
*/

// Other endpoints (reorder, delete, update) follow similar structure...


export const getListsByBoardId = async (req, res) => {
    const { boardId } = req.params;
    const userId = req.userId;
  try {
    const board = await Board.findOne({ _id: boardId, owner: userId });
    if (!board) {
    return res.status(403).json({ message: "Access denied to this board" });
    }

    // const lists = await List.find({ board: req.params.boardId }).populate("cards");
    // Find all lists belonging to the board and populate their cards
    const lists = await List.find({ board: boardId })
        .populate({
            path: 'cards',
            model: 'Card',
           /* populate: {
                path: 'members', // Populate members on cards
                model: 'User',
                select: 'name email'
            }, */
            options: { sort: { 'order': 1 } } // Sort cards by order
        })
        .sort({ order: 1 }); // Sort lists by their order field
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


