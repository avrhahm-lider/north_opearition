function battlAlgorithm(sentSoldiers,defendingSoldiers){
    const attackLuck = 0.6 + Math.random() * 0.4;
    const defenseLuck = 0.6 + Math.random() * 0.4;

    return{
        attackPower: sentSoldiers * attackLuck,
        defensePower: defendingSoldiers * defenseLuck
    }
}

function winner(powers) {
    if (powers.attackPower > powers.defensePower)
        return true
    return false
}

function survivors(powers, sentSoldiers, defendingSoldiers) {
    if (winner(powers)){
   return Math.max(
  1,
  Math.ceil(sentSoldiers * (powers.attackPower - powers.defensePower) / powers.attackPower)
);
    }
  return Math.max(
  1,
  Math.ceil(defendingSoldiers * (powers.defensePower - powers.attackPower) / powers.defensePower)
);  
}

export function runAttack(sentSoldiers,defendingSoldiers){
    const powers = battlAlgorithm(sentSoldiers, defendingSoldiers)
    return {
        win: winner(powers),
        surviv: survivors(powers, sentSoldiers,defendingSoldiers)
        
    }

}



