///
/// Test of chaining objects based on name
///



(function(){ 
    var active = false;
    this.clickDownOnEntity = function(entityID, mouseEvent) {

        print("obj name is " + getEntityName(entityID));
        
        // check if name is A or b
        print("got click");
        var boomtown = null;
        boomtown = findItemByName(entityID, "quimby");
        if (boomtown) {
            Entities.editEntity(entityID, { color: { red: 255, green: 255, blue: 255} });
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