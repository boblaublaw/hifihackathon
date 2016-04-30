
///
/// When attached to an object, this script will create a bunch of other objects,
/// which themselves have scripts attached to them
///

(function() {

    var targetScript = Script.resolvePath("./codeBlock.js");

    //
    // These are generic functions
    //

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
        print("getEntityUserData - " + name);

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


        clickDownOnEntity: function(entityID, mouseEvent) {
            print("Spawner::got click()");

            if (!this.isActive()) {
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

            // set block 0 as the hack target
            var objID = findItemByName(this.entityID, "block0");

            // need to let the objects get set up... 
            Script.setTimeout(function() {
                Entities.callEntityMethod(objID, 'setTarget', [true]);
            }, 1000);
        },


        activateBlock: function(i) {
            Script.setTimeout( function() {
                var name = "block" + i;
                print(name);
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

            var width = 2;
            var height = 2;
            var depth = 2;

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

            var xVal = 0 + widthOffset * 0.5;
            var yVal = 0 + heightOffset * 0.5;
            var zVal = 0 + depthOffset * 0.5;
            
            var blockPosition = { x: xVal, y: yVal, z: zVal}; 
            var blockDimensions = { x: .2, y: .2, z: .2 };

            var blockID = Entities.addEntity({
                type: "Box",
                name: "block" + num,
                position: blockPosition,
                dimensions: blockDimensions,
                color: { red: 150, green: 150, blue: 150},
                script: targetScript,
                dynamic: false
            });

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