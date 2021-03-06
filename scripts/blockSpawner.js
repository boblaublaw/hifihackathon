
///
/// When attached to an object, this script will create a bunch of other objects,
/// which themselves have scripts attached to them
///

// is block 0 always the target?
var DEBUG_MODE = false;

// dimensions of the play area
var SPAWN_WIDTH = 4
var SPAWN_HEIGHT = 4
var SPAWN_DEPTH = 3
var BLOCK_SPACING = 1.2;

(function() {

    var targetScript = Script.resolvePath("http://rawgit.com/boblaublaw/hifihackathon/master/scripts/codeBlock.js");
    var blueCubeURL = "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/cubeHell.fbx";
    var redCubeURL = "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/redCube.fbx";

    // These are generic functions
    //

    function findItemByName(searchingPointEntityID, itemName) {
        // find the database entity
        // print("Looking for item: " + itemName);
        var entitiesInZone = Entities.findEntities(Entities.getEntityProperties(searchingPointEntityID).position, (Entities.getEntityProperties(searchingPointEntityID).dimensions.x)*1000); 
        
        for (var i = 0; i < entitiesInZone.length; i++) {
            if (Entities.getEntityProperties(entitiesInZone[i]).name == itemName) {
                // print(itemName + " found! " + entitiesInZone[i]);
                return entitiesInZone[i];
            }
        }
        print("Item " + itemName + " not found");
        return null;
    };

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

    function setEntityUserDataEntry(id, name, value) {
        var data = getEntityUserData(id);
        data[name] = value;
        var json = JSON.stringify(data)
        Entities.editEntity(id, { userData: json });
    };

    function getEntityUserDataEntry(id, name, defaultVal) {
        var results = getEntityUserData(id);
        // print("getEntityUserData - " + name);

        if (name in results) {
            // print("found val - " + results[name]);
            return results[name];
        }

        print("using default val");
        return defaultVal;
    }

    //
    // This is the meat of the object
    //

    // the "constructor" for our class. pretty simple, it just sets our _this, so we can access it later.
    var _this;
    Spawner = function() {
        _this = this;
    };

    Spawner.prototype = {

        preload: function(entityID) {
            print("Spawner::preload()");

            this.entityID = entityID;
        },


        //
        // For Vive controllers to interact with 
        //
        startEquip: function(id, params) {
            print("BlockSpawner::startEquip()");
            
            _this.triggerSpawner();
        },

        startNearTrigger: function() {
            _this.triggerSpawner();
        },


        clickDownOnEntity: function(entityID, mouseEvent) {
            print("Spawner::got click()");

            _this.triggerSpawner();
        },

        triggerSpawner: function() {
            if (!this.isActive()) {
                // Tell the gameState object that we've started another game
                // It is up to the gameState to tell if we already have a game running or not
                Script.setTimeout(function() {
                    var objID = findItemByName(_this.entityID, "gameState");
                    Entities.callEntityMethod(objID, "gameStart");
                }, 5);

                this.createBlockWall();

                this.setActive(true);

                this.activateWall();
            } else {
                print("active");

                this.cleanupBlockWall();

                this.setActive(false);
            }
        },

        activateWall: function() {
            var num = getEntityUserDataEntry(_this.entityID, "creationCount", -1);

            for (var i=0; i<num; i++) {
                this.activateBlock(i);
            }

            // now pick a block to be the new target

            var target;
            if (DEBUG_MODE === true) {
                target = "block0";
            } else {
                var x = Math.floor(Math.random() * num);
                target = "block" + x;
            }

            var objID = findItemByName(this.entityID, target);

            // need to let the objects get set up... 
            Script.setTimeout(function() {
                Entities.callEntityMethod(objID, 'setTarget', [true]);
            }, 1000);
        },

        activateBlock: function(i) {
            Script.setTimeout( function() {
                var name = "block" + i;
                // print(name);
                var objID = findItemByName(_this.entityID, name);
                if (objID !== null) {
                    Entities.callEntityMethod(objID, 'setActive');
                }
            }, 2);
        },
        
        cleanupBlockWall: function() {
            print("Spawner::cleanupBlockWall()");

            var num = getEntityUserDataEntry(this.entityID, "creationCount", -1);

            for (var i=0; i<num; i++) {
                var name = "block" + i;

                var objID = findItemByName(this.entityID, name);
                if (objID !== null) {
                    Entities.deleteEntity(objID);
                }
            }
        },

        createBlockSwarm: function() {
            print("Spawner::createBlockSwarm()");

            this.createBlock(0);
            this.createBlock(1);
        },

        createBlockWall: function() {
            print("Spawner::createBlockWall()");

            var width = SPAWN_WIDTH;
            var height = SPAWN_HEIGHT;
            var depth = SPAWN_DEPTH;

            var num = width * height * depth;

            var i = 0;
            
            for( var d=0; d<depth; d++) {
                for( var h=0; h<height; h++) {
                    for( var w=0; w<width; w++) {
                        this.createBlock(i, w, h, d);
                        i += 1;
                    }
                }
            }

            setEntityUserDataEntry(this.entityID, "creationCount", num);
            // print("set count at " + num);
        },

        createBlock: function(num, widthOffset, heightOffset, depthOffset) {
            print("Spawner::createBlock(" + num + ")");

            // calculate the position of each block based on the array constants:
            var xVal = (BLOCK_SPACING * -1 * SPAWN_WIDTH / 2) + (widthOffset * BLOCK_SPACING);
            var yVal = heightOffset * BLOCK_SPACING;
            // Z vals are hand tuned:
            var zVal = -0.5 + depthOffset * BLOCK_SPACING;
            
            var blockPosition = { x: xVal, y: yVal, z: zVal}; 

            var qscale = 0.25;
            var blockDimensions = { x: qscale, y: qscale, z: qscale };

            var floorID = findItemByName(_this.entityID, "cyberfloorBacking");
            
            print ("FOUND cyberfloor: " + floorID);

            var blockID = Entities.addEntity({
                type: "Model",
                modelURL: blueCubeURL,
                shapeType: "box",
                name: "block" + num,
                position: blockPosition,
                dimensions: { x: qscale, y: qscale, z: qscale },
                script: targetScript,
                parentID: floorID,
                userData: JSON.stringify({
                    grabbableKey: {
                        grabbable: true
                    }
                }),
                dynamic: false
            });

            setEntityUserDataEntry(blockID, 'grabbableKey', { wantsTrigger: true });

            return blockID;
        },

        setActive: function(active) {
            print("BlockSpawner::SetActive(" + active);

            setEntityUserDataEntry(this.entityID, "active", active);
        },

        isActive: function() {
            print("BlockSpawner::isActive()");
            var ret = getEntityUserDataEntry(this.entityID, "active", false);
            // print(ret);
            return ret;
        },

        resetBlocks: function() {
            print("BlockSpawner::resetBlocks()");

            var num = getEntityUserDataEntry(_this.entityID, "creationCount", -1);

            // have to do this so that the block number is properly handled
            // in the setTimeout method
            for (var i=0; i<num; i++) {
                this.putBlockInInactiveState(i);
            }

            // once that is done, now let's set up the board game again
            Script.setTimeout( function() {
                _this.activateWall();
            }, 1000);                
        },

        putBlockInInactiveState: function(i) {
            Script.setTimeout( function() {

                var name = "block" + i;
                print(name);
                var objID = findItemByName(_this.entityID, name);
                if (objID !== null) {
                    Entities.callEntityMethod(objID, 'setInactive');
                }
            }, 2);
        },
    };

    return new Spawner();

});