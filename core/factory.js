define(function(require) {
    var _ = require('underscore');
    var Entity = require('core/entity');

    var Components = {
        'Appearance': require('components/appearance'),
        'Transform': require('components/transform'),
        'MovementSystem': require('components/movementSystem'),
        'Pathfinding': require('components/pathfinding'),
        'Storage': require('components/storage'),
        'WorkerAI': require('components/workerAI'),
        'WarriorAI': require('components/warriorAI'),
        'ResourceAI': require('components/resourceAI')
    };

    // FIXME: This sucks. Find some way to make RequireJS dynamically load files.
    var Prefabs = {
        worker: require('json!prefabs/worker.json'),
        base: require('json!prefabs/base.json'),
        warrior: require('json!prefabs/warrior.json'),
        resource: require('json!prefabs/resource.json')
    };

    function create(name, attributes) {
        if (!(name in Prefabs)) throw "ArgumentError: " + name + " is not a valid prefab.";

        var prefab = Prefabs[name];
        var entity = new Entity();
        entity.field = attributes.field;
        entity.player = attributes.player;

        for (var component in prefab.components) {
            var defaults = prefab.components[component];
            var options = _.extend({}, defaults, attributes[component]);
            entity.addComponent(new Components[component](options));
        }

        entity.setTag(attributes.tag || prefab.tag);

        return entity;
    }

    return {
        Entity: Entity,
        Components: Components,
        create: create
    };
});