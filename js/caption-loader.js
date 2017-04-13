var captionsContainerId = "captions-container";


// Gets game with the highest priority
  function getTopGame() {
      // Get top games. EndAt 0 makes it so we won't accidentally get any private games.
      var dbRef = firebase.database().ref("games/").orderByPriority().limitToFirst(1).endAt(0);
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
          return allGames[0];
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
  
  function getPickerInfo(id) {
      var user;
      return firebase.database().ref("users/" + id).once('value', function(snapshot) {
          user = snapshot.val();
      }).then(function() {
          return user;
      });
  }
  
  function addPickerInfoToDiv(div, pickerId) {
      // Div that contains all 
      var pickerDiv = document.createElement('div');
      pickerDiv.className = 'userInfo'
      div.append(pickerDiv);
      // The user's profile photo
      var pickerPhoto = new Image();
      pickerPhoto.src = loadingGifPath;
      pickerPhoto.className = 'center-block'
      var photoContainer
      
      var pickerName = document.createElement('p');
      //pickerName.className = "row"
      pickerName.innerHTML = "ABBY SCHMIEDTHAGHA";
      pickerDiv.appendChild(pickerPhoto);
      pickerDiv.appendChild(pickerName);
      div.appendChild(pickerDiv);
      return getPickerInfo(pickerId).then(function(picker) {
          pickerName.innerHTML = picker.displayName;
          putImageInElem(picker.imagePath, pickerPhoto);
      });
  }
  
  function getCaptionHTML(caption) {
      var captionText = caption.card.cardText;
      // TODO sanitize this - currently is vulnerable to running random JS
      // that a user uses as their input.
      var userInput = caption.userInput[0];
      return captionText.replace("%s", "<u>" + userInput + "</u>");
  }
  
  function populateCaptions(div, game) {
      var captions = game.captions;
      for(var captionId in captions) {
          var captionContainer = document.createElement('div');
          captionContainer.className = 'row caption';
          var captionHTML = getCaptionHTML(captions[captionId]);
          // Div that contains the caption info (captioner name + photo, text, upvote count)
          var captionDiv = document.createElement('div');
          captionDiv.className = 'captionText'
          addPickerInfoToDiv(captionContainer, captions[captionId].userId);
          captionDiv.innerHTML = captionHTML;
          captionContainer.append(captionDiv);
          
          var voteContainer = document.createElement('div');
          voteContainer.className = "text-center captionVotes";
          voteContainer.innerHTML = "0 <br/> votes";
          if(captions[captionId].votes) {
              voteContainer.innerHTML = Object.keys(captions[captionId].votes).length;
          }
          console.log(voteContainer);
          
          captionContainer.append(voteContainer);
          
          div.append(captionContainer);
      }
  }

  // The div parameter is the whole screen div.
  function loadCaptionScreen(div) {
      div.innerHTML = "";
      getTopGame().then(function(topGame) {
          // Div that will hold the main game image
          var imgHolder = document.createElement('div');
          imgHolder.className = 'row';
          // Div that holds the picker's photo and name
          var pickerDiv = document.createElement('div');
          pickerDiv.id = 'gameCreator';
          pickerDiv.className = 'row';
          // Div that will hold all the captions
//          var captionsDiv = document.createElement('div');
//          captionsDiv.className = "row caption";
          // Div that holds number of upvotes
          var upvotesDiv = document.createElement('div');
          
          // image tag that will be used to hold the main image
          var img = new Image();
          // Make sure everything is in the correct place before populating them.
          img.src = loadingGifPath;
          img.className = 'gameImage';
          imgHolder.append(img);
          div.append(imgHolder);
          // Add div that has picker name and photo
          div.append(pickerDiv);
          // Add div that has all the captions in it
//          div.append(captionsDiv);
          // Add div with upvote count
          div.append(upvotesDiv);
          
          putImageInElem(topGame.imagePath, img);
          //addPickerInfoToDiv(pickerDiv, topGame.picker);
          populateCaptions(div, topGame);
          console.log(topGame.captions);
      });
  }