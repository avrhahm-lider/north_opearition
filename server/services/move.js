import DAL from "../DAL/DAL.js";
import { computerTurn } from "./computerTurn.js";
import { isHQ, isTerritor, validId, validSoldiers  } from "./utils.js";

export async function moveService(param, body) {
    const {id} = param
    validId(id)
    const  { fromId, toId, soldiers} = body
    const game = await DAL.getGame(id);
    if (!game) throw createError(404);
    const fromTer = isTerritor(fromId, game.territories)
    const toTer = isTerritor(toId, game.territories)
    if (!fromTer[0]) throw createError(400, {error: "not plaeyer territory"});
    if (!toTer[0]) throw createError(400, {error:"not plaeyer territory"});   
    if(!fromTer[1].neighbors.includes(toTer[1].id)) throw createError(400, {error:"not neighbors"});
    validSoldiers(fromTer[1], soldiers)
    if (game.phase !== 'move')throw createError(400, {error: "Not in attack mode"})
        await DAL.move(id, fromId, toId, soldiers)
    const res = await computerTurn(id) 
    return responsG(id, {type: 'move', fromId, toId, soldiers}, res)
    
}

async function responsG(id, playerEvent, computerEvents){
    const newObj = {}
    const game = await DAL.getGame(id)
    game.id = game._id
    newObj.game = game
    newObj.playerEvent = playerEvent
    newObj.computerEvents = []
    return newObj
}