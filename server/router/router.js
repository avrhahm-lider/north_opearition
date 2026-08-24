import { Router } from "express";
import controlers from "../controlers/controlers.js";

export const router = Router()

router.post('',controlers.startGane )
router.get('/:id', controlers.getGame)
router.post('/:id/reinforce', controlers.reinforce)
router.post('/:id/attack', controlers.attack)
router.post('/:id/move', controlers.move)
router.post('/:id/end-turn', controlers.endTurn)