
///
/// When attached to an object, this script will create a bunch of other objects,
/// which themselves have scripts attached to them
///

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

            this.createBlockWall();
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
    };

    return new Spawner();

});