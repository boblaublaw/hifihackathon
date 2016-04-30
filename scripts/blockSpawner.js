


(function() {

    var targetScript = Script.resolvePath("./clickTest.js");


    // the "constructor" for our class. pretty simple, it just sets our _this, so we can access it later.
    var _this;
    Spawner = function() {
        _this = this;
    };

    // This is the meat of the object

    Spawner.prototype = {

        preload: function(entityID) {
            print("Spawner::preload()");

            this.entityID = entityID;
        },


        clickDownOnEntity: function(entityID, mouseEvent) {
            print("Spawner::got click()");

            this.createBlockSwarm();
        },


        createBlockSwarm: function() {
            print("Spawner::createBlockSwarm()");

            this.createBlock(0);
            this.createBlock(1);
        },

        createBlock: function(num) {
            print("Spawner::createBlock(" + num + ")");

            var xVal = 0 + num;
            
            var blockPosition = { x: xVal, y: 0, z: 0}; 
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
    };

    return new Spawner();

});