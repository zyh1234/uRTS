define(function() {
    function Pathfinding() {
        this.target = null;
        this.path = null;
        this.pathIndex = 0;
        this.complete = false;
    }

    Pathfinding.prototype.onStart = function() {
        this.position = this.entity.getComponent('Transform');
        this.motor    = this.entity.getComponent('MovementSystem');
        this.terrain  = this.entity.field.getComponent('Terrain');
    };

    Pathfinding.prototype.search = function(target) {
        this.setTarget(target);
        if (this.target) {
            this.path = this.terrain.search(this.position.x, this.position.y, this.target.x, this.target.y);
            this.pathIndex = 0;
            this.complete = false;
        }
    };

    Pathfinding.prototype.move = function() {
        if (!this.path) return;

        if (!this.motor.isMoving()) {
            var x = this.path[this.pathIndex].x;
            var y = this.path[this.pathIndex].y;
            this.motor.moveTo({ x: x, y: y });
        }
    };

    Pathfinding.prototype.isPathing = function() {
        return !!this.path;
    };

    Pathfinding.prototype.isComplete = function() {
        return this.complete;
    };

    Pathfinding.prototype.setTarget = function(target) {
        if (this.target) this.target.occupied = null;
        this.target = target;
        if (this.target) this.target.occupied = this.player;
    };

    Pathfinding.prototype.clearPath = function() {
        this.path = null;
        this.pathIndex = 0;
    };

    Pathfinding.prototype.onTargetReached = function() {
        if (!this.path) return;

        this.pathIndex++;
        if (this.pathIndex >= this.path.length) {
            this.entity.broadcast('PathComplete');
        }
    };

    Pathfinding.prototype.onPathComplete = function() {
        this.complete = true;
        this.clearPath();
    };

    return Pathfinding;
});