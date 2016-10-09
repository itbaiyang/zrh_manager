app.animation('.fad', function () {
    return {
        enter: function (element, done) {
            element.css({
                opacity: 0,
                height: 0
            });
            element.animate({
                opacity: 1,
                height: 100 + '%'
            }, 500, done);
        },
        leave: function (element, done) {
            element.css({
                opacity: 1
            });
            element.animate({
                opacity: 0
            }, 500, done);
        }
    };
});
