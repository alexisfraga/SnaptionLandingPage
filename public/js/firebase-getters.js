  var config = {
    apiKey: "AIzaSyAa9WDzfmNN5j3i8jn0smpHkZypMmxFCMI",
    authDomain: "vertical-prototype-81b3e.firebaseapp.com",
    databaseURL: "https://vertical-prototype-81b3e.firebaseio.com",
    projectId: "vertical-prototype-81b3e",
    storageBucket: "vertical-prototype-81b3e.appspot.com",
    messagingSenderId: "917089676170"
  };
  firebase.initializeApp(config);

  function getPickerInfo(id) {
      var user;
      return firebase.database().ref("users/" + id).once('value', function(snapshot) {
          user = snapshot.val();
      }).then(function() {
          return user;
      });
  }
  
  function addPickerNameToDiv(pickerId, div) {
      return getPickerInfo(pickerId).then(function(picker) {
          console.log(picker);
          div.innerHTML = picker.displayName;
      });
  }
  
  function getCaptionHTML(caption) {
      var captionText = caption.card.cardText;
      // TODO sanitize this - currently is vulnerable to running random JS
      // that a user uses as their input.
      var userInput = caption.userInput[0];
      return captionText.replace("%s", "<u>" + userInput + "</u>");
  }
  
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
  
  // Async method to insert an image into a given image tag.
  // Doesn't automatically set loading gif - that should be done
  // during image creation
  function putImageInElem(imagePath, elem) {
      var imgRef = firebase.storage().ref(imagePath);
      imgRef.getDownloadURL().then(function(url) {
          elem.src = url;
      });
  }