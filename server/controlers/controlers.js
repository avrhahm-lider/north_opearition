import { attackService } from "../services/attack.js";
import { moveService } from "../services/move.js";
import services from "../services/services.js";

async function startGane(req, res) {
    try {
        const respons = await services.startGane(req.body)
        res.status(201).send(respons)
    } catch (err) {
        console.log(err);
        res.status(err.status || 500)
        
    }
}

async function getGame(req, res) {
    try {
         const respons = await services.getGame(req.params)
         if (!respons)return res.status(404).send({ "error": "המשחק לא נמצא" })
        res.status(200).send(respons)
    } catch (err) {
        console.log(err);
        res.status(err.status || 500)
        
    }
}

async function reinforce(req, res) {
    try {
        const respons = await services.reinforce(req.params, req.body)
         if (!respons)return res.status(404).send({ "error": "המשחק לא נמצא" })
        res.status(200).send(respons)
    } catch (err) {
        console.log(err);
        
        res.status((err.status || 500)).send(err.message)
        
    }
}

async function attack(req, res) {
    try {
        const respons = await attackService(req.params, req.body)
         if (!respons)return res.status(404).send({ "error": "המשחק לא נמצא" })
        res.status(200).send(respons)
    } catch (err) {
        console.log(err);
        res.status((err.status || 500)).send(err.message)
        
    }
}


async function move(req, res) {
    try {
        const respons = await moveService(req.params, req.body)
         if (!respons)return res.status(404).send({ "error": "המשחק לא נמצא" })
        res.status(200).send(respons)
    } catch (err) {
        console.log(err);
        res.status((err.status || 500)).send(err.message)
        
    }

}

async function endTurn(req, res) {
    try {
        const respons = await services.endTurn(req.params, req.body)
         if (!respons)return res.status(404).send({ "error": "המשחק לא נמצא" })
        res.status(200).send(respons)
    } catch (err) {
        console.log(err);
        res.status((err.status || 500)).send(err.message)
        
    }
}

export default {
    startGane,
    getGame,
    reinforce,
    attack,
    move,
    endTurn
}