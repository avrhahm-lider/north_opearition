import { createError } from "../errors.js";
import DAL from "../DAL/DAL.js";
import { isHQ, isTerritor, validId, validSoldiers } from "./utils.js";
import { runAttack } from "./battle.service.js";


export async function attackService(param, body) {
    const {id} = param
    validId(id)
    const {skip} = body
    if (skip){
        await DAL.changePhase(id, 'move')
        return responsG(id, null)
    }
    const  { fromId, toId, soldiers} = body
      const game = await DAL.getGame(id);
      if (!game) throw createError(404);
      const fromTer = isTerritor(fromId, game.territories)
      const toTer = isTerritor(toId, game.territories)
      if (!fromTer[0]) throw createError(400, {error: "not plaeyer territory"});
      if (toTer[0]) throw createError(400, {error:"plaeyer territory"});
      
      if(!fromTer[1].neighbors.includes(toTer[1].id)) throw createError(400, {error:"not neighbors"});
      validSoldiers(fromTer, soldiers)
      DAL.startAttack(id, fromId, soldiers)
      if (game.phase !== 'attack')throw createError(400, {error: "Not in attack mode"})
        await DAL.startAttack(id, toId, soldiers)
    const winner = runAttack(soldiers, toTer[1].soldiers)
      if (winner.win){

        if (isHQ(toTer[1])){
            await DAL.finsh(id, 'player')
            }
            else {
               await DAL.attack(id, fromTer[1].id, 'player', winner.surviv)
            }
           await DAL.changePhase(id,'move')
            return responsG(id, { type: "attack", fromId, toId, soldiers, winner: 'player'})
    }
    else {
        if (isHQ(fromTer[1])){
            await DAL.finsh(id, 'computer')
            }
            else{
               await DAL.attack(id, toTer[1].id, 'computer', winner.surviv)
            }
            await DAL.changePhase(id,'move')
            return responsG(id, { type: "attack", fromId, toId, soldiers, winner: 'computer'})
    }

    
}



async function responsG(id, playerEvent){
    const newObj = {}
    const game = await DAL.getGame(id)
    game.id = game._id
    newObj.game = game
    newObj.playerEvent = playerEvent
    newObj.computerEvents = []
    return newObj
}