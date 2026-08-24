import { readFile } from "fs/promises";
import { client } from "../db/supa_base.js";
import { db } from "../db/mongoDB.js";
import { da } from "zod/v4/locales";
import { Db, ObjectId } from "mongodb";

const colectionName = "game";
const mapName = "map";
async function startGame(playerName, maps) {
  const res = [];
  for (let ter of maps) {
    if (ter.distanceFromComputerHQ === 0 || ter.distanceFromComputerHQ === 6)
      ter.soldiers = 8;
    else ter.soldiers = 4;
    ter.owner = ter.startOwner;
    if (ter.id === 4){
        
    }
    res.push(ter);
  }
  const game = creteGameObj(playerName, res);
  return { id: data.insertedId, ...game };
}

function creteGameObj(playerName, territories) {
  return {
    playerName,
    round: 1,
    phase: "reinforce",
    status: "playing",
    winner: null,
    territories,
  };
}

async function getGame(id) {
  return db.collection(colectionName).findOne({ _id: new ObjectId(id) });
}
async function reinforce(id, territories) {
  db.collection(colectionName).updateOne(
    { _id: new ObjectId(id) },
    { $set: { territories: territories } }
  );
}

function startAttack(id, terId, soldiers){
      db.collection(colectionName).updateOne(
    { _id: new ObjectId(id), 'territories.id': terId },
    {$inc: { 'territories.$.soldiers': -soldiers} }
  );
}

async function attack(id, terId, win, soldiers) {
    db.collection(colectionName).updateOne(
    { _id: new ObjectId(id), 'territories.id': terId },
    { $set: { 'territories.$.owner': win}, $inc: { 'territories.$.soldiers': +soldiers} }
  );
}

async function move(id, fromId, toId, soldiers) {
    await  db.collection(colectionName).updateOne(
    { _id: new ObjectId(id), 'territories.id': fromId },
    {$inc: { 'territories.$.soldiers': -soldiers} }
  );
    db.collection(colectionName).updateOne(
    { _id: new ObjectId(id), 'territories.id': toId },
    {$inc: { 'territories.$.soldiers': +soldiers} }
  );

}

async function endTurn(req, res) {
  try {
  } catch (err) {
    console.log(err);
    res.status(err.status || 500);
  }
}
const tableName = "map";
async function loadmapDB() {
  const data = await db.collection(mapName).find().toArray;
  return data;
}

async function insertMap(map) {
  return await db.collection(mapName).insertMany(map);
}

async function readMap(path) {
  const data = await readFile(path, "utf-8");
  console.log(data);
  return JSON.parse(data);
}

async function finsh(id, winner) {
  return await db.collection(colectionName).updateOne({_id: new ObjectId(id)}, {$set:{winner, status: 'finished'}})
}

async function changePhase(id, status) {
  return await db.collection(colectionName).updateOne({_id: new ObjectId(id)}, {$set:{phase: status}})
}

async function compReinforce(id, terId) {
  db.collection(colectionName).updateOne(
    { _id: new ObjectId(id) , 'territories.id': terId},
    {$inc: { 'territories.$.soldiers': -soldiers}}
  );
}

export default {
  startGame,
  loadmapDB,
  insertMap,
  readMap,
  getGame,
  reinforce,
  finsh,
  startAttack,
  attack,
  changePhase,
  move,
  compReinforce
};
