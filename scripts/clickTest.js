//  changeColorOnClickDown.js
(function(){ 
    var clicked = false;
    this.clickDownOnEntity = function(entityID, mouseEvent) {
        print("boooooom");

        if (clicked){
            Entities.editEntity(entityID, { color: { red: 64, green: 64, blue: 64} });
            clicked = false;
        }else{
            Entities.editEntity(entityID, { color: { red: 255, green: 255, blue: 255} });
            clicked = true; 
        }
    }; 
})