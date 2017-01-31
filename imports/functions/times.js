Handlebars.registerHelper('for', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += 3;
    return accum;
});