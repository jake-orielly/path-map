import Agent from "./Agent.js"
import utilities from "./utilities.js"
import goals from "./goals.js"

class Dwarf extends Agent {
    constructor(x, y, img, vue) {
        super(x, y, img, vue);
        this.type = "dwarf"
        this.pathHash = {};
    }

    getPath() {
        let curr, result, minVal, newX, newY, newVal;
        this.path = [];
        this.pathHash = {};
        let loopCount = 0;
        let emergencyMax = 1000;
        curr = this.getNextStep(this.getX(), this.getY());
        if (this.vue.map[this.getY()][this.getX()].value) {
            while (curr) {
                this.path.push(curr);
                this.pathHash[`${curr[0]}-${curr[1]}`] = true;
                curr = this.getNextStep(curr[0], curr[1]);
                loopCount++;
                if (loopCount > emergencyMax) {
                    console.error("While loop out of control in dwarf getPath")
                    break;
                }
            }
            result = this.path[this.path.length - 1];
            // If we couldn't find a path to a goal, don't do anything
            if (!(utilities.getType(this.vue.map[result[1]][result[0]]) in goals))
                this.path = [];
        }
        else if (this.getMonsterPenalty(this.getX(), this.getY(), 0)) {
            minVal = this.getMonsterPenalty(this.getX(), this.getY(), 0);
            // Keeps movement "random-y", avoids getting stuck in loop
            for (let dir of utilities.shuffleArray(utilities.cardinalDirs)) {
                newX = this.getX() + dir[0];
                newY = this.getY() + dir[1];
                newVal = this.getMonsterPenalty(newX, newY, 0);
                if (this.vue.onBoard(newX, newY) && 
                    newVal < minVal &&
                    this.vue.isValidMove(newX, newY) &&
                    utilities.getType(this.vue.map[newY][newX]) != "dwarf") {
                    minVal = newVal;
                    this.path = [[newX, newY]]
                }
            }
        }
        else
            this.path = [];
    }

    getNextStep(x, y) {
        let minVal, chosenDir, newX, newY, newVal, newTile;
        // Our cue to stop searching
        if (utilities.getType(this.vue.map[y][x]) in goals)
            return;
        for (let dir of utilities.cardinalDirs) {
            newX = x + dir[1];
            newY = y + dir[0];
            if (this.vue.onBoard(newX, newY)  && !this.pathHash[`${newX}-${newY}`]) {
                newTile = this.vue.map[newY][newX];
                if (utilities.getType(newTile) == "dwarf" || utilities.getType(newTile) == "monster")
                    continue;
                if (utilities.getType(newTile) in goals)
                    newVal = goals[utilities.getType(newTile)].value;
                else if (!isNaN(parseInt(newTile.value)))
                    newVal = newTile.value + this.getMonsterPenalty(newX, newY, 2);
                if ((minVal == undefined && newVal) || newVal < minVal) {
                    minVal = newVal;
                    chosenDir = [newX, newY];
                }
            }
        }
        return chosenDir;
    }

    getMonsterPenalty(x,y,maxDistance) {
        let monsters = this.vue.agents.filter(agent => agent.type == "monster");
        if (!monsters.length)
            return 0;
        let monsterDistances = (monsters.length ? monsters.map(m => Math.abs(x - m.x) + Math.abs(y - m.y)) : [0]);
        let minDistance = Math.min(...monsterDistances);
        // This formula is based mostly on trial and error and general "feeling"
        if (maxDistance)
            return (minDistance != 0 && minDistance <= maxDistance ? Math.pow(maxDistance + 1 - minDistance, 1.5) : 0);
        else 
            return (minDistance != 0 ? -1 * Math.pow(minDistance, 1.5) : 0);
    }
}

export default Dwarf;