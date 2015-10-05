// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ngTwitter'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });


})

.controller('AppCtrl', function($scope, $ionicPlatform, $twitterApi, $cordovaOauth, $ionicModal) {
  var twitterKey = 'STORAGE.TWITTER.KEY';
  var clientId = 'KC7Wl26aAQuYH9SeXPUs4Xumu';
  var clientSecret = 'R30BeSPdD4JTK46D0SUahus8uNlHBsb8DOFGdEQGBqov6WIZfi';
  var myToken = '';

  $scope.tweet = {};
  $scope.tweet.message = "#tedXWilmington";
  

  $ionicPlatform.ready(function() {
    myToken = JSON.parse(window.localStorage.getItem(twitterKey));
    if (myToken === '' || myToken === null) {
      $cordovaOauth.twitter(clientId, clientSecret).then(function(succ) {
        myToken = succ;
        window.localStorage.setItem(twitterKey, JSON.stringify(succ));
        $twitterApi.configure(clientId, clientSecret, succ);
        $scope.showHashtagResults();
      }, function(error) {
        console.log(error);
      });
    } else {
      $twitterApi.configure(clientId, clientSecret, myToken);
      $scope.showHashtagResults();
    }
  });

  $scope.showHashtagResults = function() {
    $twitterApi.searchTweets("#test").then(function(data) {
      $scope.tweetArray = []
      var dataArray = data.statuses;
      for(key in dataArray){
        $scope.tweetArray.push(dataArray[key]);
      }
      console.log(data);
    });
  };

  $scope.refresh = function() {
    $scope.showHashtagResults();
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.correctTimestring = function(string) {
    return new Date(Date.parse(string));
  };

  $scope.submitTweet = function() {
    $twitterApi.postStatusUpdate($scope.tweet.message).then(function(result) {
      $scope.showHashtagResults();
    });
  }

  $ionicModal.fromTemplateUrl('tweet-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })  

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };
});
