///
/// game state
///

var GAME_TIME_SECONDS = 20;
var WINS_NEEDED = 2;
var worldItems = [ "floor", "leftwall", "rightwall", "ceiling", "farwall", "gamewall"];

(function () {
    
    // These are generic functions for setting data on an object.

    // FIXME do non-destructive modification of the existing user data
    function getEntityUserData(id) {
        var results = null;
        var properties = Entities.getEntityProperties(id, "userData");
        if (properties.userData) {
            try {
                results = JSON.parse(properties.userData);
            } catch(err) {
                print("err");
                print("properties.userData");
            }
        }
        return results ? results : {};
    };

    function findItemByName(searchingPointEntityID, itemName) {
        // find the database entity
        print("Looking for item: " + itemName);
        var entitiesInZone = Entities.findEntities(Entities.getEntityProperties(searchingPointEntityID).position, (Entities.getEntityProperties(searchingPointEntityID).dimensions.x)*100); 
        
        for (var i = 0; i < entitiesInZone.length; i++) {
            if (Entities.getEntityProperties(entitiesInZone[i]).name == itemName) {
                print(itemName + " found! " + entitiesInZone[i]);
                return entitiesInZone[i];
            }
        }
        print("Item " + itemName + " not found");
        return null;
    };

    function setEntityUserDataEntry(id, name, value) {
        var data = getEntityUserData(id);
        data[name] = value;
        var json = JSON.stringify(data)
        Entities.editEntity(id, { userData: json });
    };

    function getEntityUserDataEntry(id, name, defaultVal) {
        var results = getEntityUserData(id);
        print("getEntityUserData - " + name);

        if (name in results) {
            // print("found val - " + results[name]);
            return results[name];
        }

        print("using default val");

        return defaultVal;
    }

    function offsetY(id, name, offset) {
        var objID = findItemByName(id, name);
        print("offsetY: Id for " + name + " is " + JSON.stringify(objID));
        var properties = Entities.getEntityProperties(objID, "position");
        print("offsetY: old position of floor is " + JSON.stringify(properties.position));
        properties.position.y += offset;
        print("offsetY: new position of floor is " + JSON.stringify(properties.position));
        Entities.editEntity(objID, properties);
    }

    // the "constructor" for our class. pretty simple, it just sets our _this, so we can access it later.
    var _this;
    GameState = function() {
        _this = this;
    };


    // This is the meat of the object

    GameState.prototype = {

        preload: function(entityID) {
            print("GameState::preload()");

            this.entityID = entityID;
            this.setScore(0);
            this.timerID = null;
            this.realWorld = true;
        },

        setScore: function(score) {
            var data = {};
            data["score"] = score;
            setEntityUserDataEntry(this.entityID, "score", score);

            print("new score " + score);
        },

        getScore: function() {
            print("GameState::getScore()");

            var score = getEntityUserDataEntry(this.entityID, "score", -1);
            return score;
        },

        clickDownOnEntity: function(entityID, mouseEvent) {
            print("GameState::got click()");
        },

        //
        // starts the timer for the game
        //
        gameStart: function() {
            print("GameState::gameStart()");

            if (this.realWorld) {
                // puzzle beginning, turn off reality so virtual reality appears:
                this.saveWorld();
            }

            // see if we already have a game running
            var running = getEntityUserDataEntry(_this.entityID, "gameStarted", false);
            if (running === true) {
                return;
            }
            setEntityUserDataEntry(_this.entityID, "gameStarted", true);
            
            // just call this function in the future
            var timeoutID = Script.setTimeout(_this.gameLost, GAME_TIME_SECONDS * 1000);
            this.timeoutID = timeoutID;
            //setEntityUserDataEntry(_this.entityID, "timeoutID", timeoutID);
        },

        gameLost: function() {
            print("GameState::gameLost()");
            setEntityUserDataEntry(_this.entityID, "gameStarted", false);

            _this.gameLost();
        },

        // called when players WIN the game
        gameWon: function() {
            print("GameState::gameWon");
            if (_this.timeoutID !== null) {
                print("attempting to cancel 2 " + _this.timeoutID);
                Script.clearInterval(_this.timeoutID);
            }

            print("A WINNER IS YOU!");
            _this.gameEnd();
        },

        // called when players lose the game
        gameLost: function() {
            print("GameState::gameLost");
            print("GAME OVER MAN, GAME OVER");
            _this.gameEnd();
        },

        // called whether they win or lose:
        gameEnd: function() {
            _this.restoreWorld();
        },

        saveWorld: function() {
            print("GameState::saveWorld()")
            this.realWorld = false;

            for (var i = 0; i < worldItems.length; i++) {
                offsetY(this.entityID, worldItems[i], -3);
            }
        },

        restoreWorld: function() {
            print("GameState::restoreWorld()")
            this.realWorld = true;
            for (var i = 0; i < worldItems.length; i++) {
                offsetY(this.entityID, worldItems[i], 3);
            }
        },

        //
        // Gets called when the users 'win the game' and find the cube with the data
        //
        dataFound: function() {
            print("GameState::dataFound()");

            var score = this.getScore();
            this.setScore(score + 1);
            score = this.getScore();

            print(score);
            
            if (score === WINS_NEEDED) {
                _this.gameWon();
            } else {
                var objID = findItemByName(this.entityID, "blockSpawner");
                print(JSON.stringify(objID));

                Script.setTimeout(function() {
                    Entities.callEntityMethod(objID, 'resetBlocks');
                }, 0);
            }
        },
    };
    
   // entity scripts always need to return a newly constructed object of our type
   return new GameState();
});