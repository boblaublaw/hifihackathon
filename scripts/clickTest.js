//  changeColorOnClickDown.js
(function(){ 
    var clicked = false;
    this.clickDownOnEntity = function(entityID, mouseEvent) {
        print("boooooom");

        if (clicked){
            Entities.editEntity(entityID, { color: { red: 0, green: 0 , blue: 0} });
            clicked = false;
        }else{
            Entities.editEntity(entityID, { color: { red: 255, green: 255, blue: 255} });
            clicked = true; 
        }
    }; 
})