///
/// Test of chaining objects based on name
///



(function(){ 
    var active = false;
    this.clickDownOnEntity = function(entityID, mouseEvent) {

        var name = getEntityName(entityID);
        // print("obj name is " + name);


        if (name == "q-a") {
            print("clicked A");

            target = findItemByName(entityID, "q-b");
            if (target) {
                Entities.editEntity(target, { color: { red: 255, green: 255, blue: 255} });
            }
        } else if (name == "q-b") {
            print("clicked B");

            target = findItemByName(entityID, "q-c");
            if (target) {
                Entities.editEntity(target, { color: { red: 255, green: 255, blue: 255} });
            }
            
        } else if (name == "q-c") {
            print("clicked C");
        } 
    }; 


    function getEntityName(entityID) {
        return Entities.getEntityProperties(entityID, "name").name;
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

})