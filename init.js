var path = require('path');
var fs = require('fs');

var searchConfig = 'search-engines.js';
var defaultEngine = '';

function makeQuery(word, engine) {

    return engine.url.replace(/\{0\}/, encodeURIComponent(word));
}

function runSearch(engine) {
    Recipe.run(function(recipe) {
        var wordrange = recipe.wordRangeForRange(recipe.selection);
        var word = recipe.textInRange(wordrange);
        if (!word) return;
        var win = new Window();
        win.frame = {x: 0, y: 0, width: 720, height: 450};
        win.title = 'Search '+ word + ' on '+ engine.name;
        win.buttons = ["OK"];
        win.onButtonClick = function() { win.close(); };
        win.url = makeQuery(word, engine);
        win.run();
        win.center();
    });
}

var searchcfg = JSON.parse(fs.readFileSync(path.join(__dirname, searchConfig), 'utf-8'));
var engines = {};
var shortcut = '';
searchcfg.engines.forEach(function(engine) {
    engines[engine.id] = engine;
    if (searchcfg.defaultEngine === engine.id)  {
        defaultEngine = engine.id;
    }
    Hooks.addMenuItem('Go/Search/' + engine.name, shortcut, function() {
        runSearch(engine);
    });
});
