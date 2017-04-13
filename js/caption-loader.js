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
  
  function addPickerNameAndPhotoToDiv(div, pickerId) {
      // Div that contains all 
      var pickerDiv = document.createElement('div');
      pickerDiv.className = 'col userInfo'
      div.append(pickerDiv);
      // The user's profile photo
      var pickerPhoto = new Image();
      pickerPhoto.src = loadingGifPath;
      pickerPhoto.className = 'center-block'
      
      var pickerName = document.createElement('p');
      pickerName.innerHTML = "Username";
      pickerDiv.appendChild(pickerPhoto);
      pickerDiv.appendChild(pickerName);
      div.appendChild(pickerDiv);
      return getPickerInfo(pickerId).then(function(picker) {
          pickerName.innerHTML = picker.displayName;
          putImageInElem(picker.imagePath, pickerPhoto);
      });
  }
  
  function addPickerNameToDiv(div, pickerId) {
      return getPickerInfo(pickerId).then(function(picker) {
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
  
  function populateCaptions(div, game) {
      var captions = game.captions;
      for(var captionId in captions) {
          var captionContainer = document.createElement('div');
          captionContainer.className = 'row caption';
          var captionHTML = getCaptionHTML(captions[captionId]);
          // Div that contains the caption info (captioner name + photo, text, upvote count)
          var captionDiv = document.createElement('div');
          captionDiv.className = 'col captionText'
          addPickerNameAndPhotoToDiv(captionContainer, captions[captionId].userId);
          captionDiv.innerHTML = captionHTML;
          captionContainer.append(captionDiv);
          
          var voteContainer = document.createElement('div');
          voteContainer.className = "col text-center captionVotes";
          voteContainer.innerHTML = "<b>0</b> <br/> votes";
          if(captions[captionId].votes) {
              voteContainer.innerHTML = "<b>" + Object.keys(captions[captionId].votes).length + "</b><br/> votes";
          }
          
          captionContainer.append(voteContainer);
          div.append(captionContainer);
      }
  }

  // The div parameter is the whole screen div.
  function loadCaptionScreen(div) {
      div.innerHTML = "";
      getTopGame().then(function(topGame) {
          // Div that will hold the main game image
          var imgRow = document.createElement('div');
          imgRow.className = 'row';
          var imgCol = document.createElement('div');
          imgCol.className = 'col';
          // Div that holds the picker's photo and name
          var pickerDiv = document.createElement('div');
          pickerDiv.id = 'gameCreator';
          pickerDiv.className = 'row';
          
          // image tag that will be used to hold the main image
          var img = new Image();
          // Make sure everything is in the correct place before populating them.
          img.src = loadingGifPath;
          img.className = 'gameImage center-block';
          imgCol.append(img);
          imgRow.append(imgCol);
          div.append(pickerDiv);
          div.append(imgRow);
          
          putImageInElem(topGame.imagePath, img);
          addPickerNameToDiv(pickerDiv, topGame.picker);
          populateCaptions(div, topGame);
      });
  }