var path = require('path'),
    router = require('express').Router(),
    mocks = require(path.resolve('simple_api/api/mock')),
    uuid = require('uuid');

router.post('/news', function (req, res, next) {
    var body = req.body,
        news = {
            id: uuid.v1(),
            title: body.title,
            imageSrc: body.imageSrc,
            text: body.text
        };

    mocks.news.push(news);

    res.json(news);
});

router.get('/news/:uuid', function (req, res, next) {
    var body = req.body,
        news = mocks.news.filter(function (news) {
                    return news.id === req.params.uuid;
                })[0];

    if (news) {
        return res.json(news);
    } else {
        res.status(404).json({error: "not found"});
    }
});

router.get('/news', function (req, res, next) {
    var news = mocks.news,
        limit = Number(req.query.limit) || news.length,
        offset = Number(req.query.offset) || 0;

    res.json(news.slice(offset, limit + offset));
});

router.post('/event', function (req, res, next) {
    var body = req.body,
        event = {
            id: uuid.v1(),
            title: body.title,
            imageSrc: body.imageSrc,
            text: body.text,
            startDate: body.startDate,
            endDate: body.endDate
        };

    mocks.events.push(event);

    res.json(event);
});

router.get('/event/:uuid', function (req, res, next) {
    var body = req.body,
        event = mocks.events.filter(function (event) {
                    return event.id === req.params.uuid;
                })[0];

    if (news) {
        return res.json(news);
    } else {
        res.status(404).json({error: "not found"});
    }
});

router.get('/events', function (req, res, next) {
    var startDate = Number(req.query.start) || false,
        endDate = Number(req.query.end) || false,
        events = mocks.events.filter(function (event) {
            var result = true;

            if ((startDate && startDate > event.startDate) || (endDate && endDate < event.endDate)) {
                result = false;
            }

            return result;
        }),
        limit = Number(req.query.limit) || news.length,
        offset = Number(req.query.offset) || 0;

    res.json(events.slice(offset, limit + offset));
});

module.exports = router;
