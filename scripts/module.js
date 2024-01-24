module.exports={
    /*This toggles the contents appearing in the dropdown menu based on an ID*/
    toggleDropdown: function(ID) {
        document.getElementById(ID).classList.toggle("showContents");}
    //TODO add disable
    /*This disables showing the dropdown menu contents if clicking off the menu*/
    // disableDropdownOOB: function(){}
};

