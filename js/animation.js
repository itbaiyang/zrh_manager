app.animation('.fad', function () {
    return {
        enter: function (element, done) {
            element.css({
                opacity: 0
            });
            element.animate({
                opacity: 1
            }, 1000, done);
        },
        leave: function (element, done) {
            element.css({
                opacity: 1
            });
            element.animate({
                opacity: 0
            }, 1000, done);
        }
    };
});
