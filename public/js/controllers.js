var rssApp = angular.module('rssApp', []);

rssApp.factory('Data', function ($http) {
    $http.defaults.useXDomain = true;
    function callUrl(url, articleTag) {

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
        getCnn: function () {
            var url = 'http://rss.cnn.com/rss/cnn_topstories.rss';
            return callUrl(url, 'item');
        },
        getVerge: function () {
            var url = 'http://www.theverge.com/rss/frontpage';
            return callUrl(url, 'entry');
        },
        getHackerNews: function () {
            var url = 'https://news.ycombinator.com/rss';
            return callUrl(url, 'item');
        }
    };
})
;

function RssCtrl($scope, Data) {
    $scope.cnnFeed = Data.getCnn();
    $scope.vergeFeed = Data.getVerge();
    $scope.hackerNewsFeed = Data.getHackerNews();
}