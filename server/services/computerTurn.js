import DAL from "../DAL/DAL.js";
import { runAttack } from "./battle.service.js";
import { isHQ, isTerritor, validId, validSoldiers } from "./utils.js";
const actions = []
export async function computerTurn(id) {

    const game = await DAL.getGame(id)
    const playerTer = game.territories.filter(val =>val.owner === 'player')
    const computerTer = game.territories.filter(val =>val.owner === 'computer')
    let reinforceId = 0
    if (isAnDef(game.territories)){
        reinforceId = bestWaydef(computerTer)
    }else{
        reinforceId = bestWayattack(computerTer)
    }
    await DAL.compReinforce(id, reinforceId, 3)
    actions.push({ type: "reinforce", territoryId: reinforceId, soldiersAdded: 3 })
    await attack(id, game.territories)
    actions.push({type: 'move', fromId: 3, toId: 4, soldiers: 2})
    return actions

}

function isAnDef(territories) {
    return !!territories.find(val => val.distanceFromComputerHQ <= 2 && val.owner === 'player')
}

function bestWaydef(territories){
    const sorted = territories.sort((a,b) =>  a.distanceFromComputerHQ - b.distanceFromComputerHQ)
    if (sorted[0] === sorted[1]){
        const filterd = sorted.filter(val => val.distanceFromComputerHQ === sorted[0])
        const sortedBySold = filterd.sort((a,b) =>  a.soldiers - b.soldiers )
        if (sortedBySold[0] === sortedBySold[1]){
            const filterdSold = sorted.filter(val => val.distanceFromComputerHQ === sortedBySold[0])
            const sortById = filterd.sort((a,b) => a.id - b.id)
            return sortById[0].id
    }
    return sortedBySold[0].id
    }
    return sorted[0].id
}

function bestWayattack(territories){
    const sorted = territories.sort((a,b) => a.distanceFromPlayerHQ - b.distanceFromPlayerHQ)
    if (sorted[0] === sorted[1]){
        const filterd = sorted.filter(val => val.distanceFromComputerHQ === sorted[0])
        const sortedBySold = filterd.sort((a,b) => b.soldiers - a.soldiers)
        if (sortedBySold[0] === sortedBySold[1]){
            const filterdSold = sorted.filter(val => val.distanceFromComputerHQ === sortedBySold[0])
            const sortById = filterd.sort((a,b) => a.id - b.id)
            return sortById[0].id
    }
    return sortedBySold[0].id
    }
    return sorted[0].id
}


async function attack(id,territories){
    const game = await DAL.getGame(id) 
    const computerTer = game.territories.filter(val =>val.owner === 'computer')
    const allScore = getScore(computerTer, territories)
    const whoAttack = toAttackNormal(allScore)
    if (whoAttack.score === 0){
        actions.push({ "skip": true })
        return
    }else{
        await DAL.startAttack(id,whoAttack.id, whoAttack.soldiers -1)
        const winner = runAttack(whoAttack.soldiers -1, whoAttack.score.soldiers)
              if (winner.win){
        
                if (isHQ(whoAttack)){
                    await DAL.finsh(id, 'computer')
                    }
                    else {
                       await DAL.attack(id, whoAttack.id, 'computer', winner.surviv)
                    }
                    actions.push({ type: "attack", fromId: whoAttack.id, toId: whoAttack.score.id, soldiers: whoAttack.soldiers -1, winner: 'computer'})
                    return
            }
            else {
                if (isHQ(territories.find(val => val.id === whoAttack.score.id))){
                    await DAL.finsh(id, 'player')
                    }
                    else{
                       await DAL.attack(id, whoAttack.score.id, 'player', winner.surviv)
                    }
                    actions.push({ type: "attack", fromId: whoAttack.id, toId: whoAttack.score.id, soldiers: whoAttack.soldiers -1, winner: 'player'})
                    return
            }
    }
}


function toAttackHQ(){
    // const game = await DAL.getGame(id)
    // const is = game.territories.filter(val => val.owner === 'computer' && val.neighbors.includes(17))
    // if (is[0]){
    //     const preferred = is.sort()
    // }
    
}

function toAttackNormal(territories){
    return territories.sort((a,b) => a.score - b.score)[0]

}

function getScore(compTer, territories){
    const newTer = []
    for(let ter of compTer){
        let terScore = []
        for(let to of ter.neighbors){  
            let plaeyer = territories.find(val => val.id === to)

                   let sentSoldiers = ter.soldiers - 1;
                    let advantageRatio = sentSoldiers / plaeyer.soldiers;
                    let progress = ter.distanceFromPlayerHQ - plaeyer.distanceFromPlayerHQ;
                    let soldierAdvantage = sentSoldiers - to.soldiers;
                    let protectsHeadquarters = Math.max(
                    0,
                    3 - to.distanceFromComputerHQ
                    ) * 25;

                    let progressScore = progress * 10;

                    let headquartersScore = to.headquarters ? 1000 : 0;

                    let score = progressScore
                    + soldierAdvantage
                    + protectsHeadquarters
                    + headquartersScore;

                    terScore.push({score, advantageRatio ,id:plaeyer.id, soldiers:plaeyer.soldiers })

        }
        let preferred = terScore.sort((a, b) => b.score = a.score)
        let filterd = preferred.filter(val => val.advantageRatio >=1.35)
        if (!filterd[0])
            ter.score = {score: 0, advantageRatio:0 ,id: -1}
        else ter.score = filterd[0]
        newTer.push(ter)
    }
    return newTer
}