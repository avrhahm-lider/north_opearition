import { createError } from "../errors.js";
import DAL from "../DAL/DAL.js";
import { isTerritor } from "./utils.js";

const MAP = "./map.json";
async function startGane(body) {
  const { playerName } = body;
  if (!playerName) createError(400, "name is empty");
  let map = await DAL.loadmapDB();
  if (!map[0]) {
    map = await DAL.readMap(MAP);
    await DAL.insertMap(map);
  }
  return DAL.startGame(playerName.trim(), map);

}

async function getGame(param) {
  const { id } = param;
  return DAL.getGame(id);
}

async function reinforce(parm, body) {
  const { territoryId } = body;
  const { id } = parm;
  const game = await DAL.getGame(id);
  if (!game) throw createError(404, "not found");
  if (game.phase !== "reinforce") throw createError(400, "phase are not in reinforce");
  if (!isTerritor(territoryId, game.territories)[0])
    throw createError(400, "not plaeyer territory");

  changeSoldier(territoryId, game.territories, 3);
  await DAL.reinforce(id, game.territories);
  await DAL.changePhase(id, 'attack')
  return responsR(id, { type: "reinforce", territoryId, soldiersAdded: 3 })
}


function changeSoldier(torrId, territories, num) {
  for (let ter of territories) {
    if (ter.id === torrId) ter.soldiers += num;
  }
}

async function responsR(id, playerEvent){
    const newObj = {}
    const game = await DAL.getGame(id)
    game.id = game._id
    newObj.game = game
    newObj.playerEvent = playerEvent
    newObj.computerEvents = []
    return newObj
}



async function endTurn(param) {
   const {id} = param
    const res = await computerTurn(id) 
    return responsG(id, null, res)
}

export default {
  startGane,
  getGame,
  reinforce,
  endTurn
};
