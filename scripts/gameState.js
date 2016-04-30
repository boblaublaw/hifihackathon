///
/// game state
///



(function () {

    // the "constructor" for our class. pretty simple, it just sets our _this, so we can access it later.
    function GameState() {
        _this = this;
    }

    var _this;
    GameState.prototype = {
        _this = this;
    };

    GameState.prototype = {

        preload: function(entityID) {
            print("GameState::preload()");

            this.entityID = entityID;

            setScore(0);
        },

        setScore: function(score) {
            var data = {};
            data["score"] = score;
            setEntityUserData(this.entityID, data);
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
    }
    
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

});