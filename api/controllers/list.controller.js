// server/controllers/listController.js
import Card from '../models/card.model.js';
import List from '../models/list.model.js';
import Board from '../models/board.model.js';  // Will be used for cascade delete
import mongoose from "mongoose";

// Helper function to check if user is a member of the board
export const checkBoardMembership = async (boardId, userId) => {
    const board = await Board.findById(boardId);
    if (!board) {
        return { authorized: false, message: 'Board not found' };
    }
    const isMember = board.members.some(member => member.equals(userId));
    if (!isMember) {
        return { authorized: false, message: 'Not authorized to access this board' };
    }
    return { authorized: true, board };
};

// @desc    Create a new list within a board
// @route   POST /api/boards/:boardId/lists
// @access  Private
// @desc    Create a new list within a board
// @route   POST /api/boards/:boardId/lists
// @access  Private
export const createList = async (req, res) => {
    const { boardId } = req.params;
    const { title } = req.body;
    const userId = req.userId;

    try {
        const { authorized, message, board } = await checkBoardMembership(boardId, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        const existingLists = await List.find({ board: boardId }).sort({ order: 1 });
        const newOrder = existingLists.length > 0 ? existingLists[existingLists.length - 1].order + 1 : 0;

        const list = new List({
            title,
            board: boardId,
            order: newOrder
        });

        const createdList = await list.save();

        board.lists.push(createdList._id);

        // ✅ Add activity directly to board
        board.activity.push({
            user: userId,
            action: "created list",
            entity: "list",
            entityId: createdList._id,
            details: `List '${createdList.title}' created`
        });

        await board.save();

        res.status(201).json({ ...createdList.toObject(), cards: [] });

    } catch (error) {
        console.error('Error creating list:', error);
        res.status(500).json({ message: 'Server error while creating list' });
    }
};


// @desc    Get all lists for a specific board
// @route   GET /api/boards/:boardId/lists
// @access  Private
export const getListsByBoardId = async (req, res) => {
    const { boardId } = req.params;
    const userId = req.userId;

    try {
        const { authorized, message } = await checkBoardMembership(boardId, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        // Find all lists belonging to the board and populate their cards
        const lists = await List.find({ board: boardId })
            .populate({
                path: 'cards',
                model: 'Card',
                populate: {
                    path: 'members', // Populate members on cards
                    model: 'User',
                    select: 'name email'
                },
                options: { sort: { 'order': 1 } } // Sort cards by order
            })
            .sort({ order: 1 }); // Sort lists by their order field

        res.json(lists);
    } catch (error) {
        console.error('Error fetching lists:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid board ID' });
        }
        res.status(500).json({ message: 'Server error while fetching lists' });
    }
};

// @desc    Update a list's title
// @route   PUT /api/lists/:id
// @access  Private
// @desc    Update a list's title
// @route   PUT /api/lists/:id
// @access  Private
export const updateList = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.userId;

    try {
        const list = await List.findById(id);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        const { authorized, message, board } = await checkBoardMembership(list.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        if (title) list.title = title;

        const updatedList = await list.save();

        // ✅ Add activity
        board.activity.push({
            user: userId,
            action: "updated list",
            entity: "list",
            entityId: updatedList._id,
            details: `List renamed to '${updatedList.title}'`
        });

        await board.save();

        res.json(updatedList);
    } catch (error) {
        console.error('Error updating list:', error);
        res.status(500).json({ message: 'Server error while updating list' });
    }
};


// @desc    Delete a list
// @route   DELETE /api/lists/:id
// @access  Private
export const deleteList = async (req, res) => {
    const { id } = req.params; // List ID
    const userId = req.userId;

    try {
        const list = await List.findById(id);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        const { authorized, message, board } = await checkBoardMembership(list.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        // --- IMPORTANT: Cascade Delete ---
        // Delete all cards associated with this list
        await Card.deleteMany({ list: id });

        // Remove the list's ID from the board's lists array
        board.lists = board.lists.filter(listId => !listId.equals(id));
        await board.save();

        // Delete the list itself
        await List.deleteOne({ _id: id });

        res.json({ message: 'List and its cards removed successfully' });
    } catch (error) {
        console.error('Error deleting list:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid list ID' });
        }
        res.status(500).json({ message: 'Server error while deleting list' });
    }
};

// @desc    Reorder lists within a board
// @route   PUT /api/boards/:boardId/lists/reorder
// @access  Private
// @desc    Reorder lists within a board
// @route   PUT /api/boards/:boardId/lists/reorder
// @access  Private
export const reorderLists = async (req, res) => {
    const { boardId } = req.params;
    const { listIdsInOrder } = req.body;
    const userId = req.userId;

    if (!Array.isArray(listIdsInOrder) || listIdsInOrder.length === 0) {
        return res.status(400).json({ message: 'Invalid list order provided' });
    }

    try {
        const { authorized, message, board } = await checkBoardMembership(boardId, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        const bulkOperations = listIdsInOrder.map((listId, index) => ({
            updateOne: {
                filter: { _id: listId, board: boardId },
                update: { $set: { order: index } }
            }
        }));

        await List.bulkWrite(bulkOperations);
        await Board.findByIdAndUpdate(boardId, { $set: { lists: listIdsInOrder } });

        // ✅ Add activity
        board.activity.push({
            user: userId,
            action: "reordered lists",
            entity: "list",
            details: `Lists reordered`
        });
        await board.save();

        res.json({ message: 'Lists reordered successfully' });
    } catch (error) {
        console.error('Error reordering lists:', error);
        res.status(500).json({ message: 'Server error while reordering lists' });
    }
};


/*
module.exports = {
    createList,
    getListsByBoardId,
    updateList,
    deleteList,
    reorderLists
}; */






// ** LisyColumns & CardItems  ** //
// new approach to get alternate solution
// import Board from '../models/board.model.js';
// import List from '../models/list.model.js';
// import Card from '../models/card.model.js';
// import Card from '../models/card.model.js';
// import List from '../models/list.model.js';

// @desc    Update order of cards in a list
// @route   PUT /api/lists/:listId/cards/reorder
// @access  Private
/*
export const updateCardOrder = async (req, res) => {
  const { listId } = req.params;
  const { newCardOrder } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ message: "Invalid list ID" });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Validate all card IDs
    const validCardIds = await Card.find({ _id: { $in: newCardOrder } });
    if (validCardIds.length !== newCardOrder.length) {
      return res.status(400).json({ message: "One or more card IDs are invalid" });
    }

    list.cards = newCardOrder.map(id => new mongoose.Types.ObjectId(id));
    await list.save();

    const updatedList = await list.populate({
      path: "cards",
      populate: { path: "members labels", select: "name email title color" }
    });

    res.status(200).json(updatedList);
  } catch (error) {
    console.error("Error updating card order:", error);
    res.status(500).json({ message: "Server error while updating card order" });
  }
};
*/
export const updateCardOrder = async (req, res) => {
  try {
    const listId = req.params.listId;
    const { newCardOrder } = req.body;

    const list = await List.findByIdAndUpdate(
      listId,
      { cards: newCardOrder },
      { new: true }
    );

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error while updating card order', error: err.message });
  }
};



export const deleteDeleteList = async (req, res) => {
  try {
    const { id } = req.params;
    await List.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateListOrder = async (req, res) => {
  const { boardId } = req.params;
  const { orderedIds } = req.body;

  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        List.findByIdAndUpdate(id, { order: index })
      )
    );

    res.status(200).json({ message: 'List order updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



