///
/// Test of chaining objects based on name
///


(function(){ 

    this.clickDownOnEntity = function(entityID, mouseEvent) {

        var name = getEntityName(entityID);
        // print("obj name is " + name);


        if (name == "q-a") {
            print("clicked A");

            target = findItemByName(entityID, "q-b");
            if (target) {
                Entities.editEntity(target, { color: { red: 255, green: 255, blue: 255} });
                markObjectActiveState(target, true);
            }
        } else if (name == "q-b") {
            print("clicked B");
            
            if (!isObjectActive(entityID)) {
                print ("b is NOT ACTIVE");
            } else {
                target = findItemByName(entityID, "q-c");
                if (target) {
                    Entities.editEntity(target, { color: { red: 255, green: 255, blue: 255} });
                    markObjectActiveState(target, true);
                }
            }
            
        } else if (name == "q-c") {
            print("clicked C");

            if (!isObjectActive(entityID)) {
                print ("c is NOT ACTIVE");
            } else {
                print ("C BOOMTOWN");
            }
        } 
    }; 


    function getEntityName(entityID) {
        return Entities.getEntityProperties(entityID).name;
    };

    function markObjectActiveState(entityID, bActive) {
        var data = {};
        data["active"] = bActive;
        setEntityUserData(entityID, data);
    };
    
    function isObjectActive(entityID) {
        var results = getEntityUserData(entityID);
        if ("active" in results) {
            print("zzz");
            print(results.active);
            return results.active;
        }
        
        return false;
    };

    
    function findItemByName(searchingPointEntityID, itemName) {
        // find the database entity
        print("Looking for item: " + itemName);
        var entitiesInZone = Entities.findEntities(Entities.getEntityProperties(searchingPointEntityID).position, (Entities.getEntityProperties(searchingPointEntityID).dimensions.x)*10); 
        
        for (var i = 0; i < entitiesInZone.length; i++) {
            if (Entities.getEntityProperties(entitiesInZone[i]).name == itemName) {
                print(itemName + " found! " + entitiesInZone[i]);
                return entitiesInZone[i];
            }
        }
        print("Item " + itemName + " not found");
        return null;
    };


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

})