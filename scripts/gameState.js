///
/// game state
///



(function () {
    
    // These are generic functions for setting data on an object.

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
        },

        setScore: function(score) {
            var data = {};
            data["score"] = score;
            setEntityUserData(this.entityID, data);

            print("new score " + score);
        },

        getScore: function() {
            print("GameState::getScore()");

            var results = getEntityUserData(this.entityID);

            if ("score" in results) {
                print(" found score");
                return results.score;
            }

            return -1;
        },

        clickDownOnEntity: function(entityID, mouseEvent) {
            print("got click");

            var score = this.getScore();
            this.setScore(score + 1);
        },
    };
    
   // entity scripts always need to return a newly constructed object of our type
   return new GameState();
});