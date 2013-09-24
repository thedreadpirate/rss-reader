var rssApp = angular.module('rssApp', ['ngResource']);

rssApp.directive("feed", function () {
    return {
        restrict: "E",
        template: '<div>Hello world</div>'
    };
});

rssApp.factory('Data', function ($http) {
    $http.defaults.useXDomain = true;
    function callUrl(url, articleTag) {

        return $http.get(url)
            .then(function (result) {
                var results = new Array();
                $($.parseXML(result.data)).find(articleTag + ":lt(3)").each(function () { // or "item" or whatever suits your feed
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
            var cnnUrl = 'http://rss.cnn.com/rss/cnn_topstories.rss';
            return callUrl(cnnUrl, 'item');
        },
        getVerge: function () {
            var vergeUrl = 'http://www.theverge.com/rss/frontpage';
            return callUrl(vergeUrl, 'entry');
        }
    };
})
;

function RssCtrl($scope, Data) {
    $scope.cnnFeed = Data.getCnn();
    $scope.vergeFeed = Data.getVerge();
}