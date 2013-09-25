var rssApp = angular.module('rssApp', []);

rssApp.directive('feed', function () {
    return{
        restrict: 'E',
        replace: true,
        //scope: {feed: '=cnnFeed'},
        controller: function ($scope, $element, $attrs, Data) {
            var feed_name = $attrs.site;
            $scope.feed = Data.callUrl($attrs.site, $attrs.articleTag);
        },
        template: '<div class="pure-u-1-4 l-box header" > <p ng-repeat="item in feed">{{ item.title }}</p> </div> '
    }
});

rssApp.factory('Data', function ($http) {
    $http.defaults.useXDomain = true;
    function getFeed(url, articleTag) {

        return $http.get(url)
            .then(function (result) {
                var results = new Array();
                $($.parseXML(result.data)).find(articleTag + ":lt(3)").each(function () {
                    var el = $(this);

                    results.push({title: el.find('title').text(),
                        author: el.find('author').text(),
                        description: el.find('description').text()
                    });
                });
                return results;
            });
    }

    return {

        callUrl: function (feed_info) {
            getFeed(feed_info.url, feed_info.article_tag === undefined ? 'item' : feed_info.article_tag);
        },
        getCnn: function () {
            var url = 'http://rss.cnn.com/rss/cnn_topstories.rss';
            return getFeed(url, 'item');
        },
        getVerge: function () {
            var url = 'http://www.theverge.com/rss/frontpage';
            return getFeed(url, 'entry');
        },
        getHackerNews: function () {
            var url = 'https://news.ycombinator.com/rss';
            return getFeed(url, 'item');
        }
    };
})
;

function RssCtrl($scope, Data) {
    $scope.cnnFeed = Data.getCnn();
    $scope.vergeFeed = Data.getVerge();
    $scope.hackerNewsFeed = Data.getHackerNews();
}