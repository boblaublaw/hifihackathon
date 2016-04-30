
///
/// When attached to an object, this script will create a bunch of other objects,
/// which themselves have scripts attached to them
///

(function() {

    var targetScript = Script.resolvePath("./clickTest.js");

    //
    // These are generic functions for setting data on an object.
    //

    // FIXME fetch from a subkey of user data to support non-destructive modifications
    function setEntityUserData(id, data) {
        var json = JSON.stringify(data)
        Entities.editEntity(id, { userData: json });
    };

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

    function setEntityUserDataEntry(id, name, value) {
        var data = {};
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
            } else {
                print("active");
            }
        },


        createBlockSwarm: function() {
            print("Spawner::createBlockSwarm()");

            this.createBlock(0);
            this.createBlock(1);
        },

        createBlockWall: function() {
            print("Spawner::createBlockWall()");

            var width = 6;
            var height = 4;

            var num = width * height;

            for( var h=0; h<height; h++) {
                for( var w=0; w<width; w++) {
                    var i = h*height + w;

                    this.createBlock(i, w, h);
                }
            }

            setEntityUserDataEntry(this.entityID, "creationCount", num);
        },

        createBlock: function(num, widthOffset, heightOffset) {
            print("Spawner::createBlock(" + num + ")");

            var xVal = 0 + widthOffset * 0.5;
            var yVal = 0 + heightOffset * 0.5;
            
            var blockPosition = { x: xVal, y: yVal, z: 0}; 
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
            // var data = {};
            // data["active"] = active;
            // setEntityUserData(this.entityID, data);

            print("active state: " + active);

            setEntityUserDataEntry(this.entityID, "active", true);
        },

        isActive: function() {
            print("isActive");
            var ret = getEntityUserDataEntry(this.entityID, "active", false);
            print(ret);
            return ret;
            
            // var results = getEntityUserData(this.entityID);

            // if ("active" in results) {
            //     print(" found active");
            //     return results.active;
            // }

            // return false;
        },

    };

    return new Spawner();

});