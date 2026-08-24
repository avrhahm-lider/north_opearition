import { ObjectId } from "mongodb";
import { createError } from "../errors.js";

export function isTerritor(terId, territories) {
  let isTer = territories.find((val) => val.id === terId && val.owner === "player");
  if (isTer) return [true, isTer];
  isTer = territories.find((val) => val.id === terId)
  return [false, isTer];
}
export function validId(id){
    if (!ObjectId.isValid(id))
        throw createError(400, {error: "invalid id"})
}

export function isHQ(ter){
    if (ter.distanceFromComputerHQ === 0 || ter.distanceFromComputerHQ === 6)
        return true
    return false
}

export function validSoldiers(ter, numOf){
    if (ter.distanceFromComputerHQ === 0 || ter.distanceFromComputerHQ === 6){
    if ((ter.soldiers - numOf) < 4) throw createError(400,{error: "There are not enough soldiers to send."} )
    }
    else if ((ter.soldiers - numOf) < 1) throw createError(400,{error: "There are not enough soldiers to send."} )
}