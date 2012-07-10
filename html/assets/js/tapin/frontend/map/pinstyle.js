define(['tapin/util/log'], function(Log){

    var PinStyle = function()
    {
        this.Icon = null;
        this.Shadow = null;

        this.setColor = function(color)
        {
            this.Icon = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
            this.Shadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
                new google.maps.Size(40, 37),
                new google.maps.Point(0, 0),
                new google.maps.Point(12, 35));
        }

    }

    PinStyle.Presets = new (function(){

        this.Default = new PinStyle();
        this.Default.setColor("FE7569");

        this.Playing = new PinStyle();
        this.Playing.setColor("00CC00");

        this.Viewed = new PinStyle();
        this.Viewed.setColor("CCCCCC");
    });
    
    return PinStyle;
});