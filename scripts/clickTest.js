//  changeColorOnClickDown.js
(function(){ 
    var clicked = false;
    this.clickDownOnEntity = function(entityID, mouseEvent) { 
        if (clicked){
            Entities.editEntity(entityID, { color: { red: 0, green: 0, blue: 255} });
            clicked = false;w
        }else{
            Entities.editEntity(entityID, { color: { red: 255, green: 0, blue: 0} });
            clicked = true; 
        }
    }; 
})