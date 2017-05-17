$(document).ready(function() {
    const $newsList = $('.newsList'),
        $loading = $('.loading'),
        $nextNews = $('.newsList__nav-next'),
        $prevNews = $('.newsList__nav-previous'),
        $addNews = $('.addNews'),
        $filter = $('.newsList__filter-imput'),
        $popup = $('.popup'),
        $popup_content = $('.popup_content'),
        appData = {
            news: [],
            offset: 0,
            limit: 5
        };

    $popup.find('.popup_wrapper').on('click', function() {
        $popup.hide();
    });

    function showPopup(item) {
        $popup_content.html(item);
        $popup.show();
    }

    function renderNews(data) {
        return $('<li>')
            .attr('data-id', data.id)
            .addClass('newsList__item')
            .append(
                $('<img>')
                    .addClass('newsList__item-img')
                    .attr('src', data.imageSrc)
            )
            .append(
                $('<h3>')
                    .addClass('newsList__item-title')
                    .text(data.title)
                    .on('click', function() {
                        // showPopup(data.text);

                        $.ajax(
                            `/api/news/${data.id}`,
                            {
                                dataType: 'json',
                                method: 'GET',
                                success: function(newsItem) {
                                    console.log('newsItem', newsItem);
                                    showPopup(
                                        $('<div>')
                                            .append(
                                                $('<h3>').text(newsItem.title)
                                            )
                                            .append(
                                                $('<div>').text(newsItem.text)
                                            )
                                    );
                                }
                            }
                        );

                    })
            );
    }

    function getNews(limit=5, offset=0) {
        //get last five news
        $.ajax(
            '/api/news',
            {
                data: {limit, offset},
                dataType: 'json',
                method: 'GET',
                success: function(data) {
                    $loading.hide();

                    if (data && !data.length) {
                        $prevNews.hide();
                        return ;
                    } else {
                        $prevNews.show();
                    }

                    appData.news = data;
                    $newsList.text('');
                    data.forEach(function(newsItem) {
                        $newsList.append( renderNews(newsItem) );
                    });
                },
                error: function() {
                    console.log('error', arguments);
                }
            })
    }

    $prevNews.on('click', function() {
        appData.offset += appData.limit;

        if (appData.offset > 0) {
            $nextNews.show();
        }

        getNews(appData.limit, appData.offset);
    });

    $nextNews.on('click', function() {
        appData.offset -= appData.limit;

        if (appData.offset < 0) {
            appData.offset = 0;
            $nextNews.hide();
        }

        getNews(appData.limit, appData.offset);
    });

    $addNews.on('submit', function(event) {
        event.preventDefault();

        const $title = $addNews.find('.addNews__title'),
            $image = $addNews.find('.addNews__image'),
            $body = $addNews.find('.addNews__body'),
            isValid = $title.val() && $image.val() && $body.val();

        if (isValid) {
            $.ajax(
                '/api/news',
                {
                    method: 'POST',
                    data: {
                        title: $title.val(),
                        imageSrc: $image.val(),
                        text: $body.val()
                    },
                    success: function() {
                        $title.val('');
                        $image.val('');
                        $body.val('');

                        getNews(appData.limit, appData.offset);

                        alert('News added');
                    }
                }
            );
        }
    });

    $filter.on('keyup', function(event) {
        console.log('search', $filter.val());
        if ($filter.val()) {
            $newsList.find('.newsList__item-title').each(function(index, title) {
                const rxSearch = new RegExp($filter.val(), 'i');
                    $title = $(title),
                    $newsItem = $title.closest('.newsList__item');

                if ($title.text().search(rxSearch) === -1) {
                    $newsItem.hide();
                } else {
                    $newsItem.show();
                }
            });
        }
    });

    getNews(appData.limit, appData.offset);
});
