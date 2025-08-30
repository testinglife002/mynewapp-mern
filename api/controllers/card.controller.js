// server/controllers/cardController.js
import Card from '../models/card.model.js';
import List from '../models/list.model.js';
import Board from '../models/board.model.js'; // Import the Board model
import Label from '../models/label.model.js';
import Activity from '../models/activity.model.js';
import User from '../models/user.model.js';   // Import the User model (for member management)
import mongoose from 'mongoose';

import path from 'path';
import fs from 'fs';

// Helper function to check if user is a member of the board
const checkBoardMembership = async (boardId, userId) => {
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

// @desc    Create a new card within a list
// @route   POST /api/lists/:listId/cards
// @access  Private
export const createCard = async (req, res) => {
    const { listId } = req.params;
    const { title, description, dueDate, labels, members } = req.body;
    const userId = req.userId; // Authenticated user

    try {
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        const { authorized, message, board } = await checkBoardMembership(list.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        // Determine the order for the new card
        const existingCards = await Card.find({ list: listId }).sort({ order: 1 });
        const newOrder = existingCards.length > 0 ? existingCards[existingCards.length - 1].order + 1 : 0;

        const card = new Card({
            title,
            description,
            dueDate,
            labels,
            members,
            list: listId,
            board: list.board, // Store board ID for easier querying
            owner: userId, // The user who created the card
            order: newOrder
        });

        const createdCard = await card.save();

        // Add the new card's ID to the list's cards array
        list.cards.push(createdCard._id);
        await list.save();

        // Populate members to return full user objects
        const populatedCard = await Card.findById(createdCard._id).populate('members', 'name email');

        res.status(201).json(populatedCard);
    } catch (error) {
        console.error('Error creating card:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid list ID' });
        }
        res.status(500).json({ message: 'Server error while creating card' });
    }
};

// @desc    Get a single card by ID
// @route   GET /api/cards/:id
// @access  Private
export const getCardById = async (req, res) => {
    const { id } = req.params; // Card ID
    const userId = req.userId;

    try {
        const card = await Card.findById(id)
            .populate('members', 'username email')
            .populate('comments.user', 'username email')
            .populate('attachments.uploadedBy', 'username email'); // NEW: Populate uploadedBy for attachments

        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const { authorized, message } = await checkBoardMembership(card.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        res.json(card);
    } catch (error) {
        console.error('Error fetching card by ID:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card ID' });
        }
        res.status(500).json({ message: 'Server error while fetching card' });
    }
};

// @desc    Update a card
// @route   PUT /api/cards/:id
// @access  Private
export const updateCard = async (req, res) => {
    const { id } = req.params; // Card ID
    const userId = req.userId;
    const { title, description, dueDate, labels, members, completed, checklists, comments, attachments } = req.body;

    try {
        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const { authorized, message } = await checkBoardMembership(card.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        // Update fields if provided
        if (title !== undefined) card.title = title;
        if (description !== undefined) card.description = description;
        if (dueDate !== undefined) card.dueDate = dueDate;
        if (labels !== undefined) card.labels = labels;
        if (members !== undefined) card.members = members;
        if (completed !== undefined) card.completed = completed;
        if (checklists !== undefined) card.checklists = checklists;
        if (comments !== undefined) card.comments = comments;
        if (attachments !== undefined) card.attachments = attachments;

        const updatedCard = await card.save();

        // Re-populate members, comments.user, and attachments.uploadedBy for the response
        const populatedCard = await Card.findById(updatedCard._id)
            .populate('members', 'username email')
            .populate('comments.user', 'username email')
            .populate('attachments.uploadedBy', 'username email');

        res.json(populatedCard);
    } catch (error) {
        console.error('Error updating card:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card ID' });
        }
        res.status(500).json({ message: 'Server error while updating card' });
    }
};

// @desc    Delete a card
// @route   DELETE /api/cards/:id
// @access  Private
export const deleteCard = async (req, res) => {
    const { id } = req.params; // Card ID
    const userId = req.userId;

    try {
        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const { authorized, message, board } = await checkBoardMembership(card.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        // Delete associated files from disk before deleting the card
        if (card.attachments && card.attachments.length > 0) {
            card.attachments.forEach(attachment => {
                const filePath = path.join(__dirname, '..', 'public', 'uploads', path.basename(attachment.url));
                fs.unlink(filePath, (err) => {
                    if (err) console.error(`Failed to delete file ${filePath}:`, err);
                    else console.log(`Deleted file: ${filePath}`);
                });
            });
        }

        // Remove the card's ID from its parent list's cards array
        await List.findByIdAndUpdate(card.list, { $pull: { cards: card._id } });

        // Delete the card itself
        await Card.deleteOne({ _id: id });

        res.json({ message: 'Card removed successfully' });
    } catch (error) {
        console.error('Error deleting card:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card ID' });
        }
        res.status(500).json({ message: 'Server error while deleting card' });
    }
};

// @desc    Reorder cards within the same list
// @route   PUT /api/lists/:listId/cards/reorder
// @access  Private
export const reorderCardsInList = async (req, res) => {
    const { listId } = req.params;
    const { cardIdsInOrder } = req.body; // Array of card IDs in their new desired order
    const userId = req.userId;

    if (!Array.isArray(cardIdsInOrder) || cardIdsInOrder.length === 0) {
        return res.status(400).json({ message: 'Invalid card order provided' });
    }

    try {
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        const { authorized, message } = await checkBoardMembership(list.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        // Update the order field for each card based on its position in the array
        const bulkOperations = cardIdsInOrder.map((cardId, index) => ({
            updateOne: {
                filter: { _id: cardId, list: listId }, // Ensure card belongs to this list
                update: { $set: { order: index } }
            }
        }));

        const result = await Card.bulkWrite(bulkOperations);

        // Update the list's cards array to reflect the new order
        await List.findByIdAndUpdate(listId, { $set: { cards: cardIdsInOrder } });

        res.json({ message: 'Cards reordered successfully', modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('Error reordering cards in list:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card ID in order array' });
        }
        res.status(500).json({ message: 'Server error while reordering cards' });
    }
};

// @desc    Move a card between lists
// @route   PUT /api/cards/:cardId/move
// @access  Private
export const moveCardBetweenLists = async (req, res) => {
    const { cardId } = req.params;
    const { sourceListId, destinationListId, newIndex } = req.body;
    const userId = req.userId;

    if (!sourceListId || !destinationListId || newIndex === undefined) {
        return res.status(400).json({ message: 'Missing required fields for card move' });
    }

    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        // Ensure user has access to both source and destination boards
        const { authorized: srcAuth, message: srcMsg } = await checkBoardMembership(card.board, userId);
        if (!srcAuth) {
            return res.status(srcMsg === 'Board not found' ? 404 : 403).json({ message: srcMsg });
        }

        const destList = await List.findById(destinationListId);
        if (!destList) {
            return res.status(404).json({ message: 'Destination list not found' });
        }

        const { authorized: destAuth, message: destMsg } = await checkBoardMembership(destList.board, userId);
        if (!destAuth) {
            return res.status(destMsg === 'Board not found' ? 404 : 403).json({ message: destMsg });
        }

        // 1. Remove card from source list
        await List.findByIdAndUpdate(sourceListId, { $pull: { cards: cardId } });

        // 2. Add card to destination list at the specified index
        const destinationListDoc = await List.findById(destinationListId);
        if (!destinationListDoc) {
            return res.status(404).json({ message: 'Destination list not found after pull' });
        }
        destinationListDoc.cards.splice(newIndex, 0, cardId);
        await destinationListDoc.save();

        // 3. Update the card's list and board references
        card.list = destinationListId;
        card.board = destinationListDoc.board; // Update board reference if list moved to different board
        await card.save();

        // 4. Re-calculate order for cards in both source and destination lists
        const sourceListCards = await Card.find({ list: sourceListId }).sort({ order: 1 });
        const destListCards = await Card.find({ list: destinationListId }).sort({ order: 1 });

        const sourceBulkOps = sourceListCards.map((c, i) => ({
            updateOne: { filter: { _id: c._id }, update: { $set: { order: i } } }
        }));
        const destBulkOps = destListCards.map((c, i) => ({
            updateOne: { filter: { _id: c._id }, update: { $set: { order: i } } }
        }));

        if (sourceBulkOps.length > 0) await Card.bulkWrite(sourceBulkOps);
        if (destBulkOps.length > 0) await Card.bulkWrite(destBulkOps);

        res.json({ message: 'Card moved successfully', cardId });
    } catch (error) {
        console.error('Error moving card between lists:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID provided' });
        }
        res.status(500).json({ message: 'Server error while moving card' });
    }
};

// @desc    Add a comment to a card
// @route   POST /api/cards/:id/comments
// @access  Private
export const addCommentToCard = async (req, res) => {
    const { id } = req.params; // Card ID
    const { text } = req.body;
    const userId = req.userId;

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    try {
        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const { authorized, message } = await checkBoardMembership(card.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        const newComment = {
            user: userId,
            text,
            createdAt: new Date()
        };

        card.comments.push(newComment);
        const updatedCard = await card.save();

        // Populate the new comment's user for the response
        const populatedComment = updatedCard.comments[updatedCard.comments.length - 1];
        await User.populate(populatedComment, { path: 'user', select: 'username email' });

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card ID' });
        }
        res.status(500).json({ message: 'Server error while adding comment' });
    }
};

// @desc    Delete a comment from a card
// @route   DELETE /api/cards/:cardId/comments/:commentId
// @access  Private (Only comment owner or board owner can delete)
export const deleteCommentFromCard = async (req, res) => {
    const { cardId, commentId } = req.params;
    const userId = req.userId;

    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const { authorized, message, board } = await checkBoardMembership(card.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        const comment = card.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if current user is the comment owner OR board owner
        const isCommentOwner = comment.user.equals(userId);
        const isBoardOwner = board.owner.equals(userId);

        if (!isCommentOwner && !isBoardOwner) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        comment.remove(); // Mongoose method to remove subdocument
        await card.save();

        res.json({ message: 'Comment removed successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card or comment ID' });
        }
        res.status(500).json({ message: 'Server error while deleting comment' });
    }
};

// @desc    Add a checklist to a card
// @route   POST /api/cards/:id/checklists
// @access  Private
export const addChecklistToCard = async (req, res) => {
    const { id } = req.params; // Card ID
    const { title } = req.body;
    const userId = req.userId;
    if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Checklist title is required' });
    }

    try {
        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const { authorized, message } = await checkBoardMembership(card.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        const newChecklist = {
            title,
            items: []
        };

        card.checklists.push(newChecklist);
        await card.save();

        res.status(201).json(card.checklists[card.checklists.length - 1]);
    } catch (error) {
        console.error('Error adding checklist:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card ID' });
        }
        res.status(500).json({ message: 'Server error while adding checklist' });
    }
};

// @desc    Delete a checklist from a card
// @route   DELETE /api/cards/:cardId/checklists/:checklistId
// @access  Private
export const deleteChecklistFromCard = async (req, res) => {
    const { cardId, checklistId } = req.params;
    const userId = req.userId;
    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const { authorized, message } = await checkBoardMembership(card.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

       /* const checklist = card.checklists.id(checklistId);
        if (!checklist) {
            return res.status(404).json({ message: 'Checklist not found' });
        }

        checklist.remove();
        await card.save(); */

        // remove the checklist
        card.checklists = card.checklists.filter(
            (cl) => cl._id.toString() !== checklistId
        );

        await card.save();

        res.json({ message: 'Checklist removed successfully' });
    } catch (error) {
        console.error('Error deleting checklist:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card or checklist ID' });
        }
        res.status(500).json({ message: 'Server error while deleting checklist' });
    }
};

// @desc    Add an item to a checklist
// @route   POST /api/cards/:cardId/checklists/:checklistId/items
// @access  Private
export const addChecklistItem = async (req, res) => {
    const { cardId, checklistId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Checklist item text is required' });
    }

    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const { authorized, message } = await checkBoardMembership(card.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        const checklist = card.checklists.id(checklistId);
        if (!checklist) {
            return res.status(404).json({ message: 'Checklist not found' });
        }

        const newItem = { text, completed: false };
        checklist.items.push(newItem);
        await card.save();

        res.status(201).json(checklist.items[checklist.items.length - 1]);
    } catch (error) {
        console.error('Error adding checklist item:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card or checklist ID' });
        }
        res.status(500).json({ message: 'Server error while adding checklist item' });
    }
};

// @desc    Update a checklist item (e.g., toggle completed)
// @route   PUT /api/cards/:cardId/checklists/:checklistId/items/:itemId
// @access  Private
export const updateChecklistItem = async (req, res) => {
    const { cardId, checklistId, itemId } = req.params;
    const { text, completed } = req.body;
    const userId = req.userId;

    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const { authorized, message } = await checkBoardMembership(card.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        const checklist = card.checklists.id(checklistId);
        if (!checklist) {
            return res.status(404).json({ message: 'Checklist not found' });
        }

        const item = checklist.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Checklist item not found' });
        }

        if (text !== undefined) item.text = text;
        if (completed !== undefined) item.completed = completed;

        await card.save();

        res.json(item);
    } catch (error) {
        console.error('Error updating checklist item:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid IDs provided' });
        }
        res.status(500).json({ message: 'Server error while updating checklist item' });
    }
};

// @desc    Delete a checklist item
// @route   DELETE /api/cards/:cardId/checklists/:checklistId/items/:itemId
// @access  Private
export const deleteChecklistItem = async (req, res) => {
    const { cardId, checklistId, itemId } = req.params;
    const userId = req.userId;

    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const { authorized, message } = await checkBoardMembership(card.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        const checklist = card.checklists.id(checklistId);
        if (!checklist) {
            return res.status(404).json({ message: 'Checklist not found' });
        }

        const item = checklist.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Checklist item not found' });
        }

        item.remove();
        await card.save();

        res.json({ message: 'Checklist item removed successfully' });
    } catch (error) {
        console.error('Error deleting checklist item:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid IDs provided' });
        }
        res.status(500).json({ message: 'Server error while deleting checklist item' });
    }
};

// @desc    Upload an attachment to a card
// @route   POST /api/cards/:id/attachments
// @access  Private
export const uploadAttachment = async (req, res) => {
    const { id } = req.params; // Card ID
    const userId = req.userId;
    try {
        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const { authorized, message } = await checkBoardMembership(card.board, userId);
        if (!authorized) {
            // If user is not authorized, delete the uploaded file
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting unauthorized file:', err);
                });
            }
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const newAttachment = {
            filename: req.file.originalname,
            url: `/uploads/${req.file.filename}`, // URL to access the file
            mimetype: req.file.mimetype,
            uploadedBy: userId,
            uploadedAt: new Date()
        };

        card.attachments.push(newAttachment);
        await card.save();

        // Populate the uploadedBy user for the response
        const populatedAttachment = card.attachments[card.attachments.length - 1];
        await User.populate(populatedAttachment, { path: 'uploadedBy', select: 'name email' });

        res.status(201).json(populatedAttachment);
    } catch (error) {
        console.error('Error uploading attachment:', error);
        // If an error occurs after file upload but before saving to DB, delete the file
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file after DB error:', err);
            });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card ID' });
        }
        res.status(500).json({ message: 'Server error while uploading attachment' });
    }
};

// @desc    Delete an attachment from a card
// @route   DELETE /api/cards/:cardId/attachments/:attachmentId
// @access  Private (Only uploader or board owner can delete)
export const deleteAttachment = async (req, res) => {
    const { cardId, attachmentId } = req.params;
    const userId = req.userId;

    try {
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const { authorized, message, board } = await checkBoardMembership(card.board, userId);
        if (!authorized) {
            return res.status(message === 'Board not found' ? 404 : 403).json({ message });
        }

        const attachment = card.attachments.id(attachmentId);
        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }

        // Check if current user is the uploader OR board owner
        const isUploader = attachment.uploadedBy.equals(userId);
        const isBoardOwner = board.owner.equals(userId);

        if (!isUploader && !isBoardOwner) {
            return res.status(403).json({ message: 'Not authorized to delete this attachment' });
        }

        // Delete the file from the file system
        const filePath = path.join(__dirname, '..', 'public', 'uploads', path.basename(attachment.url));
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete file from disk: ${filePath}`, err);
                // Continue even if file deletion fails, as DB record is primary
            } else {
                console.log(`Successfully deleted file from disk: ${filePath}`);
            }
        });

        // Remove the attachment from the card's attachments array
        attachment.remove();
        await card.save();

        res.json({ message: 'Attachment removed successfully' });
    } catch (error) {
        console.error('Error deleting attachment:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid card or attachment ID' });
        }
        res.status(500).json({ message: 'Server error while deleting attachment' });
    }
};

/*
module.exports = {
    createCard,
    getCardById,
    updateCard,
    deleteCard,
    reorderCardsInList,
    moveCardBetweenLists,
    addCommentToCard,
    deleteCommentFromCard,
    addChecklistToCard,
    deleteChecklistFromCard,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    uploadAttachment, // NEW
    deleteAttachment  // NEW
};
*/



// ** LisyColumns & CardItems  ** //
// new approach to get alternate solution
// import Board from '../models/board.model.js';
// import List from '../models/list.model.js';
// import Card from '../models/card.model.js';
// import Card from '../models/card.model.js';
// import List from '../models/list.model.js';


// ---------- CARDS ----------


export const moveCard = async (req, res) => {
    // const { cardId, fromListId, toListId, toIndex } = req.body;
    // console.log(req.body)
    
    try {
        const { cardId, fromListId, toListId, toIndex } = req.body;

        if (!cardId || !fromListId || !toListId || typeof toIndex !== 'number') {
        return res.status(400).json({ message: 'Missing required fields' });
        }

         const card = await Card.findById(cardId);
         if (!card) return res.status(404).json({ msg: 'Card not found' });

        const fromList = await List.findById(fromListId);
        const toList = await List.findById(toListId);

        if (!fromList || !toList) {
            return res.status(404).json({ message: 'List not found' });
        }

         const board = await Board.findById(card.board);


        // ✅ Remove card from source list
        const cardIndex = fromList.cards.indexOf(cardId);
        if (cardIndex === -1) {
        return res.status(404).json({ message: 'Card not found in source list' });
        }

        fromList.cards.splice(cardIndex, 1);

        // ✅ If moving in the same list, reorder only
        // ✅ If moving in the same list, reorder only
        if (fromListId === toListId) {
          fromList.cards.splice(toIndex, 0, cardId);
          await fromList.save();
        } else {
          // ✅ Otherwise, move to destination list
          toList.cards.splice(toIndex, 0, cardId);
          await Promise.all([fromList.save(), toList.save()]);

          // ✅ Update card’s list reference
          card.list = toListId;
          await card.save();
        }

        // ✅ Add activity directly into board.activity
        board.activity.push({
          user: req.user.id,
          action: "moved",
          entity: "card",
          entityId: card._id,
          details: `Card '${card.title}' moved from '${fromList.name}' to '${toList.name}'`
        });
        await board.save();

        res.status(200).json({ message: "Card moved successfully" });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};



// Get all cards for a specific list
export const getCardsByList = async (req, res) => {
  try {
    const { listId } = req.params;
    const cards = await Card.find({ list: listId }).sort({ order: 1 });
    res.status(200).json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching cards" });
  }
};

export const createNewCard = async (req, res) => {
  try {
    const { title, description, listId, boardId, members, labels, dueDate } = req.body;

    if (!title || !listId || !boardId) {
      return res.status(400).json({ message: 'Title, listId, and boardId are required' });
    }

    // Validate ObjectIds for members and labels
    const validMembers = (members || []).filter(id => mongoose.Types.ObjectId.isValid(id));
    const validLabels = (labels || []).filter(id => mongoose.Types.ObjectId.isValid(id));

    // Find list and determine card order
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: 'List not found' });

    const order = list.cards.length;

    const newCard = new Card({
      title,
      description,
      list: listId,
      board: boardId,
      members: validMembers,
      labels: validLabels,
      dueDate,
      order
    });

    await newCard.save();

    // Push card ID to the List
    await List.findByIdAndUpdate(listId, { $push: { cards: newCard._id } });

     // ✅ Add activity
    const board = await Board.findById(boardId);
    board.activity.push({
      user: req.user.id,
      action: "created",
      entity: "card",
      entityId: newCard._id,
      details: `Card '${newCard.title}' created in list '${list.name}'`
    });
    await board.save();

    res.status(201).json(newCard);

  } catch (err) {
    console.error('[Card Create Error]', err);
    res.status(500).json({ message: err.message });
  }
};




/*
export const updateCardOrder = async (req, res) => {
  try {
    const { listId, newCardOrder } = req.body;
    const list = await List.findByIdAndUpdate(listId, { cards: newCardOrder }, { new: true });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
*/
// import List from "../models/List.js";
// import Card from "../models/Card.js";




export const updateEditCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: 'Invalid card ID' });
    }

    const updateFields = { ...req.body };

    // Optional: Validate members/labels if they're being updated
    if (updateFields.members) {
      updateFields.members = updateFields.members.filter(id =>
        mongoose.Types.ObjectId.isValid(id)
      );
    }

    if (updateFields.labels) {
      updateFields.labels = updateFields.labels.filter(id =>
        mongoose.Types.ObjectId.isValid(id)
      );
    }

    const updatedCard = await Card.findByIdAndUpdate(cardId, updateFields, { new: true });
    if (!updatedCard) return res.status(404).json({ message: 'Card not found' });

    // ✅ Add activity
    const board = await Board.findById(updatedCard.board);
    board.activity.push({
      user: req.user.id,
      action: "updated",
      entity: "card",
      entityId: updatedCard._id,
      details: `Card '${updatedCard.title}' was updated`
    });
    await board.save();

    res.status(200).json(updatedCard);

  } catch (err) {
    console.error('[Card Update Error]', err);
    res.status(500).json({ message: err.message });
  }
};


export const deleteDeleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    await Card.findByIdAndDelete(cardId);

    // ✅ Add activity
    const board = await Board.findById(card.board);
    board.activity.push({
      user: req.user.id,
      action: "deleted",
      entity: "card",
      entityId: cardId,
      details: `Card '${card.title}' was deleted`
    });
    await board.save();

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// card.controller.js
/*
export const moveCard = async (req, res) => {
  try {
    const cardId = req.params.id;
    const { list, order } = req.body;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { list, order },
      { new: true }
    );

    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
*/

/*
export const moveCardController = async (req, res) => {
  const { cardId } = req.params;
  const { targetCardId, targetListId } = req.body;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    // If moved to another list
    if (targetListId && targetListId !== card.list.toString()) {
      // Remove from old list
      await List.findByIdAndUpdate(card.list, {
        $pull: { cards: card._id },
      });

      // Add to new list
      await List.findByIdAndUpdate(targetListId, {  
        $push: { cards: card._id },
      });

      card.list = targetListId;
    }

    if (targetCardId) {
      const targetCard = await Card.findById(targetCardId);
      card.order = targetCard.order + 1;
    }

    await card.save();
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
*/

// import Card from '../models/Card.js';
// import List from '../models/List.js';
// import Card from '../models/Card.js';
// import List from '../models/List.js';

export const moveCardController = async (req, res) => {
  const { cardId } = req.params;
  const { targetCardId, targetListId } = req.body;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const sourceListId = card.list.toString();
    const newListId = targetListId || sourceListId;
    const movingToNewList = newListId !== sourceListId;

    // Move card to new list if needed
    if (movingToNewList) {
      await List.findByIdAndUpdate(sourceListId, { $pull: { cards: card._id } });
      await List.findByIdAndUpdate(newListId, { $push: { cards: card._id } });
      card.list = newListId;
    }

    // Fix labels: convert names to ObjectIds (if labels are strings)
    if (card.labels && card.labels.length > 0 && typeof card.labels[0] === 'string' && !card.labels[0].match(/^[0-9a-fA-F]{24}$/)) {
      const labelDocs = await Label.find({ name: { $in: card.labels } });
      card.labels = labelDocs.map(label => label._id);
    }

    // Fetch all cards in target list except the moved card
    let cardsInList = await Card.find({ list: newListId, _id: { $ne: cardId } }).sort({ order: 1 });

    // Debug logs:
    // console.log('Cards in list:', cardsInList.map(c => c._id.toString()));
    // console.log('targetCardId:', targetCardId);

    // Determine new position
    if (targetCardId) {
      const index = cardsInList.findIndex(c => c._id.toString() === targetCardId);
      if (index === -1) return res.status(404).json({ message: "Target card not found" });
      cardsInList.splice(index + 1, 0, card); // Insert after target card
    } else {
      cardsInList.push(card); // Move to end
    }

    // Reorder all cards
    for (let i = 0; i < cardsInList.length; i++) {
      cardsInList[i].order = i;
      await cardsInList[i].save();
    }

    await card.save();

    res.status(200).json(card);
  } catch (err) {
    console.error('[Move Card Error]', err);
    res.status(500).json({ message: err.message });
  }
};

// import Card from "../models/Card.js";

// ------------------------
// CHECKLISTS
// ------------------------

// Add checklist
export const addChecklist = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title } = req.body;

    if (!title) return res.status(400).json({ message: "Checklist title is required" });

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const checklist = { title, items: [] };
    card.checklists.push(checklist);
    await card.save();

    // ✅ Add activity
    const board = await Board.findById(card.board);
    board.activity.push({
      user: req.user.id,
      action: "added",
      entity: "checklist",
      entityId: card._id,
      details: `Checklist '${title}' added to card '${card.title}'`
    });
    await board.save();

    res.status(201).json(card.checklists.slice(-1)[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete checklist
export const deleteChecklist = async (req, res) => {
  try {
    const { cardId, checklistId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const checklistTitle = checklist.title;
    checklist.remove();
    await card.save();

    // ✅ Add activity
    const board = await Board.findById(card.board);
    board.activity.push({
      user: req.user.id,
      action: "deleted",
      entity: "checklist",
      entityId: card._id,
      details: `Checklist '${checklistTitle}' removed from card '${card.title}'`
    });
    await board.save();

    res.status(200).json({ message: "Checklist removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ------------------------
// CHECKLIST ITEMS
// ------------------------

// Add checklist item
export const addChecklistItems = async (req, res) => {
  try {
    const { cardId, checklistId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Item text is required" });

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    checklist.items.push({ text, completed: false });
    await card.save();

    // ✅ Add activity
    const board = await Board.findById(card.board);
    board.activity.push({
      user: req.user.id,
      action: "added",
      entity: "checklist item",
      entityId: card._id,
      details: `Item '${text}' added to checklist '${checklist.title}' in card '${card.title}'`
    });
    await board.save();

    res.status(201).json(checklist.items.slice(-1)[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Toggle checklist item completion
export const toggleChecklistItems= async (req, res) => {
  try {
    const { cardId, checklistId, itemId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const item = checklist.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.completed = !item.completed;
    await card.save();

    // ✅ Add activity
    const board = await Board.findById(card.board);
    board.activity.push({
      user: req.user.id,
      action: item.completed ? "completed" : "reopened",
      entity: "checklist item",
      entityId: card._id,
      details: `Item '${item.text}' in checklist '${checklist.title}' on card '${card.title}' was marked as ${item.completed ? "completed" : "incomplete"}`
    });
    await board.save();

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete checklist item
export const deleteChecklistItems = async (req, res) => {
  try {
    const { cardId, checklistId, itemId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const checklist = card.checklists.id(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    const item = checklist.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const itemText = item.text;
    item.remove();
    await card.save();

    // ✅ Add activity
    const board = await Board.findById(card.board);
    board.activity.push({
      user: req.user.id,
      action: "deleted",
      entity: "checklist item",
      entityId: card._id,
      details: `Item '${itemText}' removed from checklist '${checklist.title}' in card '${card.title}'`
    });
    await board.save();

    res.status(200).json({ message: "Checklist item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// import Card from "../models/Card.js";

// ---------- ADD COMMENT ----------
export const addComment = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const newComment = { text, user: req.user.id, createdAt: new Date() };
    card.comments.push(newComment);
    await card.save();

    // ✅ Add activity
    const board = await Board.findById(card.board);
    board.activity.push({
      user: req.user.id,
      action: "commented",
      entity: "card",
      entityId: card._id,
      details: `Comment added on card '${card.title}'`
    });
    await board.save();

    const populatedCard = await Card.findById(card._id).populate("comments.user", "username");
    res.status(201).json(populatedCard.comments.slice(-1)[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ---------- DELETE COMMENT ----------
export const deleteComment = async (req, res) => {
  try {
    const { cardId, commentId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    // const comment = card.comments.id(commentId);
    // if (!comment) return res.status(404).json({ message: "Comment not found" });

    card.comments = card.comments.filter((c) => c._id.toString() !== commentId);
    await card.save();

    // Only owner can delete their own comment
    // if (comment.user.toString() !== req.userId) {
    //  return res.status(403).json({ message: "Not authorized to delete this comment" });
    // }

    // comment.deleteOne();
    // await card.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

