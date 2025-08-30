// server/routes/listRoutes.js
import express from "express";
import {
    createList,
    getListsByBoardId,
    updateList,
    deleteList,
    reorderLists,
    deleteDeleteList,
    updateCardOrder,
    updateListOrder
} from "../controllers/list.controller.js"; 
 import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();


// ** LisyColumns & CardItems  ** //
// new approach to get alternate solution

// router.get('/:id', getBoardByTheId); // GET single board with lists/cards
// router.post('/:boardId/lists', createList);
// router.post('/:boardId/lists/reorder', updateListOrder);
// router.post('/:boardId/lists/:listId/cards', verifyToken, createNewCard);
// router.post('/:boardId/lists/:listId/cards/reorder', verifyToken, updateCardOrder);
// router.put('/cards/:cardId', verifyToken, updateEditCard);
// router.delete('/cards/:cardId', verifyToken, deleteDeleteCard);

// router.post('/:boardId/lists/:listId/cards/reorder', verifyToken, updateCardOrder);
 router.patch('/:listId/cards/reorder', verifyToken, updateCardOrder);
  router.delete('/lists/:listId', verifyToken, deleteDeleteList);

// PUT /api/boards/:boardId/reorder-lists
// router.put('/:boardId/reorder-lists', verifyToken, updateListOrder);



// Route for creating a list within a specific board
router.post('/boards/:boardId/lists', verifyToken, createList);

// Route for getting all lists for a specific board
router.get('/boards/:boardId/lists', verifyToken, getListsByBoardId);

// Routes for individual list operations
router.route('/:id')
    .put(verifyToken, updateList)   // Update a list by ID
    .delete(verifyToken, deleteList); // Delete a list by ID

// Route for reordering lists within a board
router.put('/boards/:boardId/lists/reorder', verifyToken, reorderLists);


export default router;
