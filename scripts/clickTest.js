//  changeColorOnClickDown.js
(function(){ 
    var clicked = false;
    this.clickDownOnEntity = function(entityID, mouseEvent) { 
        if (clicked){
            Entities.editEntity(entityID, { color: { red: 64, green: 64, blue: 64} });
            clicked = false;w
        }else{
            Entities.editEntity(entityID, { color: { red: 255, green: 255, blue: 255} });
            clicked = true; 
        }
    }; 
})