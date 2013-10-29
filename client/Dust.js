var $ = require('jquery-browserify'),
    Vector = require('./Vector'),
    AABB = require('./AABB')
    Body = require('./Body'),
    World = require('./World');

module.exports = Dust;

function Dust() {
    var self = this;

    this.socket = io.connect('http://172.16.0.20:9966');
    this.width  = $('#canvainer').width(),
    this.height = $('#canvainer').height(),
    this.renderer = this.createRenderer();
    window.renderer = this.renderer;
    this.world = this.initWorld();

    window.particleArray = [];
    for (var i = 0; i < this.width; i++) {
        window.particleArray[i] = [];
        for (var j = 0; j < this.height; j++) {
            window.particleArray[i][j] = 0;
        };
    };
    

    $(window).resize(function() {
        self.width = $('#canvainer').width();
        self.height = $('#canvainer').height();
        
        self.resizeRenderer(self.width, self.height);
    });
};

Dust.prototype.createRenderer = function() {
    htmlCanvas = "<canvas width=" + "\"" + this.width + "\"" + "height=" + "\"" + this.height + "\"" + "></canvas>";

    $('#canvainer').append(htmlCanvas);

    return $('canvas').get(0).getContext('2d');
}

Dust.prototype.resizeRenderer = function(w, h) {
    this.renderer.width = w;
    this.renderer.height = h;
}

Dust.prototype.initWorld = function() {
    // Define world
    var gravity = new Vector(0.0, 50),
        worldBounds = new AABB(0, 0, this.width, this.height);

    var world = new World({
        forces: gravity,
        bounds: worldBounds
    });
    
    var body = new Body(20, 20, 100, 100);
    world.pushBody(body);

    return world;
}

Dust.prototype.updateWorld = function(dt) {
    this.world.update(dt);
}

Dust.prototype.drawWorld = function() {
    var self = this;

    this.renderer.clearRect(0, 0, this.width, this.height);
    this.renderer.fillStyle = 'black';

    // Draw newtonian bodies
    for (var i = 0; i < this.world.bodies.length; i++) {
        var b = this.world.bodies[i];
        this.renderer.fillRect(b.pos.x, b.pos.y, b.w, b.h);
    };
    
    this.renderer.fillStyle = 'yellow';
    // Draw sand
    for (var i = 0; i < this.world.sands.length; i++) {
        var s = this.world.sands[i];
        this.renderer.fillRect(s.x, s.y, 1, 1);
    };
}

Dust.prototype.spawnDust = function(x, y) {
    var n = 50,
        area = 10;
    for (var i = 0; i < n; i++) {
        x = Math.round((x - area/2) + area*Math.random());
        y = Math.round((y - area/2) + area*Math.random());
        this.world.pushSand(new Vector(x, y));
    };
}

Dust.prototype.spawnSquare = function(x, y) {
    var body = new Body(20, 20, x - 10, y - 10);
    this.world.pushBody(body);
}
