
///
/// Object which could or could not be the subject of the hacking search
///

(function() {

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
        print("CodeBlock::getEntityUserData() using default val");
        return defaultVal;
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
            print("CodeBlock::preload()");
            this.entityID = entityID;
        },

        clickDownOnEntity: function(entityID, mouseEvent) {
            if (this.isTarget()) {
                this.handleHacking();
            } else {
                Entities.editEntity(entityID, { color: { red: 0, green: 0 , blue: 255} });
            }
        },


        handleHacking: function() {
            Entities.editEntity(this.entityID, { color: { red: 255, green: 0 , blue: 0} });

            var objID = findItemByName(this.entityID, "gameState");
            Entities.callEntityMethod(objID, 'dataFound');
        },

        setTarget: function(isTarget) {
            setEntityUserDataEntry(this.entityID, "hackTarget", isTarget);
        },

        isTarget: function() {
            var ret = getEntityUserDataEntry(this.entityID, "hackTarget", false);
            return ret;
        },

        setInactive: function() {
            print("CodeBlock::setInactive()");

            setEntityUserDataEntry(this.entityID, "hackTarget", false);

            Entities.editEntity(this.entityID, { color: { red: 0, green: 255, blue: 0} });
        },

        setActive: function() {
            print("CodeBlock::setActive()");

            Entities.editEntity(this.entityID, { color: { red: 25, green: 25, blue: 25} });
        },
    };

    return new CodeBlock();

});