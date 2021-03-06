
///
/// Object which could or could not be the subject of the hacking search
///
/// Assumes an object called "blockSpawner" and "gameState"
///

(function() {

    var blueCubeURL = "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/cubeHell.fbx";
    var redCubeURL = "https://dl.dropboxusercontent.com/u/16918424/hifihackathon/assets/redCube.fbx";

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
        if (name in results) {
            return results[name];
        }
        // print("CodeBlock::getEntityUserData() using default val");
        return defaultVal;
    };

    function findItemByName(searchingPointEntityID, itemName) {
        // find the database entity
        // print("Looking for item: " + itemName);
        var entitiesInZone = Entities.findEntities(Entities.getEntityProperties(searchingPointEntityID).position, (Entities.getEntityProperties(searchingPointEntityID).dimensions.x)*100); 
        
        for (var i = 0; i < entitiesInZone.length; i++) {
            if (Entities.getEntityProperties(entitiesInZone[i]).name == itemName) {
                // print(itemName + " found! " + entitiesInZone[i]);
                return entitiesInZone[i];
            }
        }
        print("Item " + itemName + " not found");
        return null;
    };

    //
    // This is the meat of the object
    //

    // the "constructor" for our class. pretty simple, it just sets our _this, so we can access it later.
    var _this;
    CodeBlock = function() {
        _this = this;
    };

    CodeBlock.prototype = {

        preload: function(entityID) {
            // print("CodeBlock::preload()");
            this.entityID = entityID;

            var timeoutID = Script.setInterval(this.tryRotation, 100);
            setEntityUserDataEntry(this.entityID, "timeoutID", timeoutID);
        },

        unload: function() {
            var timeoutID = getEntityUserDataEntry(this.entityID, "timeoutID", null);
            if (timeoutID !== null) {
                Script.clearInterval(timeoutID);
            }
        },


        //
        // For Vive controllers to interact with 
        //
        startEquip: function(id, params) {
            print("BlockSpawner::startEquip()");
            
            _this.searchCubeForTarget();
        },

        clickDownOnEntity: function(entityID, mouseEvent) {
            print("CodeBlock::clickDownOnEntity()");

            _this.searchCubeForTarget();
        },

        startNearTrigger: function() {
            _this.searchCubeForTarget();
        },

        searchCubeForTarget: function() {
            this.toggleRotationState();

            if (this.isTarget()) {
                print("bingo!");
                this.targetFound(); 
            } 
        },

        targetFound: function() {
            print("CodeBlock::targetFound() starting");

            // temporary visual effect to indicate success:
            // Entities.editEntity(this.entityID, { visible: false });

            var objID = findItemByName(this.entityID, "gameState");
            print ("we found " + objID);
            Entities.callEntityMethod(objID, 'dataFound');
            print("CodeBlock::targetFound() finishing");
        },

        setTarget: function(isTarget) {
            print("CodeBlock::setTarget()");

            setEntityUserDataEntry(this.entityID, "hackTarget", isTarget);
        },

        isTarget: function() {
            print("CodeBlock::isTarget()");
            var ret = getEntityUserDataEntry(this.entityID, "hackTarget", false);
            return ret;
        },

        setInactive: function() {
            print("CodeBlock::setInactive()");
            setEntityUserDataEntry(this.entityID, "hackTarget", false);

            // var blockDimensions = { x: .5, y: .5, z: .5 };
            Entities.editEntity(this.entityID, { modelURL: redCubeURL } ); // , dimensions: blockDimensions });
        },

        //
        // setActive puts each block in a "reset" state for a visual cue that the board is about to start over
        // 
        setActive: function() {
            print("CodeBlock::setActive()");
            Entities.editEntity(this.entityID, { visible: true });

            var qscale = 0.5;
            var blockDimensions = { x: qscale, y: qscale, z: qscale };
            Entities.editEntity(this.entityID, { modelURL: blueCubeURL } ); // , dimensions: blockDimensions });
        },

        isRotating: function() {
            var ret = getEntityUserDataEntry(this.entityID, "isRotating", false);
            return ret;
        },

        setRotating: function(rotating) {
            setEntityUserDataEntry(_this.entityID, "isRotating", rotating);

            var lastIndex = getEntityUserDataEntry(_this.entityID, "lastVectorIndex", 0);

            var nextIndex = lastIndex + 1;
            if (nextIndex > 2) {
                nextIndex = 0;
            }
            setEntityUserDataEntry(_this.entityID, "lastVectorIndex", nextIndex);

            // randomly pick what direction we want this to rotate in and STORE it
            var axes = [Vec3.UNIT_X, Vec3.UNIT_Y, Vec3.UNIT_Z];

            var lastVec = axes[lastIndex];
            var nextVec = axes[nextIndex];
            
            setEntityUserDataEntry(_this.entityID, "orgVector", lastVec);
            setEntityUserDataEntry(_this.entityID, "targVector", nextVec);

            // print("picked: " + lastIndex);
        },

        toggleRotationState: function() {
            var state = false;

            if (_this.isRotating() === false) {
                state = true;
            }

            state = true;
            _this.setRotating(state);
        },

        tryRotation: function() {
            // print("CodeBlock::tryRotation()");

            if (!_this.isRotating()) {
                return;
            }

            // pull the stored vector for the direction we are going to rotate
            var from = getEntityUserDataEntry(_this.entityID, "orgVector", null);
            var targ = getEntityUserDataEntry(_this.entityID, "targVector", null);
            if ((from !== null) && (targ !== null)) {
                var rotation = Quat.rotationBetween(from, targ);
                var properties = Entities.getEntityProperties(_this.entityID, ["rotation"]);
                Entities.editEntity(_this.entityID, 
                                    {rotation: Quat.mix(properties.rotation, rotation, 0.1)});
            }
        },
    };

    return new CodeBlock();

});

