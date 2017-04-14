var captionsContainerId = "captions-container";

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
          if(picker) {
              pickerName.innerHTML = picker.displayName;
              putImageInElem(picker.imagePath, pickerPhoto);
          } else {
              pickerName.remove();
              pickerPhoto.remove();
          }
      });
  }
  
  function populateCaptions(game, div) {
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
      getTopGames(1).then(function(topGames) {
          var topGame = topGames[0];
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
          addPickerNameToDiv(topGame.picker, pickerDiv);
          populateCaptions(topGame, div);
      });
  }