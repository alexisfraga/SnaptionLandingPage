  // Initialize Firebase
  var loadingGifPath = "img/LoadingImage.gif";
  
  var config = {
    apiKey: "AIzaSyAa9WDzfmNN5j3i8jn0smpHkZypMmxFCMI",
    authDomain: "vertical-prototype-81b3e.firebaseapp.com",
    databaseURL: "https://vertical-prototype-81b3e.firebaseio.com",
    projectId: "vertical-prototype-81b3e",
    storageBucket: "vertical-prototype-81b3e.appspot.com",
    messagingSenderId: "917089676170"
  };
  firebase.initializeApp(config);
  
  // Return a list of games
  function getTopGames(numGames) {
      // Get top games. EndAt 0 makes it so we won't accidentally get any private games.
      var dbRef = firebase.database().ref("games/").orderByPriority().limitToFirst(numGames).endAt(0);
      var allGames = [];
      // Because dbRef.once()... is an asynchronous function, return the whole thing (which is a promise)
      // The .then() says to resolve the promise, and when it does, to return the allGames object.
      return dbRef.once('value', function(snapshot) {
          // Add each child game to the list of games.
          snapshot.forEach(function(childSnapshot) {
              var value = childSnapshot.val();
              // .push puts the item at the end of the array
              allGames.push(value);
          });
      }).then(function() {
          return allGames;
      });
  }
  
  // This is asynchronous, so images could potentially be inserted out of order.
  // img should be an Image object
  function putImageInDiv(imageId, img) {
      var imgRef = firebase.storage().ref("images/" + imageId);
      imgRef.getDownloadURL().then(function(url) {
          img.src = url;
      });
  }
  
  function getTopComment(game, commentContainer) {
      //get top comment out of game, insert it into the comment container div.
  }
  
  function putWallInDivs(leftDiv, rightDiv) {
      var allGamesPromise = getTopGames(20);
      allGamesPromise.then(function(allGames) {
          for(var gameNum = 0; gameNum < allGames.length; gameNum += 1) {
              var gameId = allGames[gameNum].id;
              var div = rightDiv;
              // switch columns every other game
              if(gameNum % 2) {
                  div = leftDiv;
              }
              var img = new Image();
              img.src = loadingGifPath;
              // Doing it this way ensures games will be loaded in order
              // Also allows for a loading image
              div.append(img);
              // TODO put in top comment
              // TODO make images clickable to go to game???
              putImageInDiv(gameId, img);
          }
      });
  }