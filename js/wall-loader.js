  // Initialize Firebase
  var loadingGifPath = "img/LoadingImage.gif";
  
  function createElementWithClassName(elemType, name) {
      var newDiv = document.createElement(elemType);
      if(name) {
          newDiv.className = name;
      }
      return newDiv;
  }
  
  function getTopComment(game, commentContainer) {
      //get top comment out of game, insert it into the comment container div.
      var topScore = -1;
      var topComment = {card : {cardText : "No top comment yet! Download Snaption to submit one!"},
        userInput: {0 : ""}};
      var allComments = game.captions;
      if (allComments) {
          for(var commentId in allComments) {
              var curComment = allComments[commentId];
              var score = curComment.votes && Object.keys(curComment.votes).length;
              if(score && score > topScore) {
                  topComment = curComment;
              }
          }
      }
      return topComment;
  }
  
  function populateWallDiv(game, containerDiv) {
      // Get top comment
      var topComment = getTopComment(game, captionCol);
      var topCommentText = getCaptionHTML(topComment);
      
      
      // Picker div creation
      var creatorRow = createElementWithClassName('div', 'wallGameCreator row');
      // Add picker name
      var creatorPara = createElementWithClassName('p');
      creatorRow.append(creatorPara);
      addPickerNameToDiv(game.picker, creatorPara);
      
      var imageRow = createElementWithClassName('div', 'row');
      // Populating caption row
      var captionRow = createElementWithClassName('div', 'row caption');
      var captionCol = createElementWithClassName('div', 'col captionText');
      var userInfoCol = createElementWithClassName('div', 'col userInfo');
      addPickerNameAndPhotoToDiv(captionRow, topComment.userId);
      captionRow.append(captionCol);
      
      // Adding divs to the container
      containerDiv.append(creatorRow);
      containerDiv.append(imageRow);
      containerDiv.append(captionRow);
      
      
      
      var img = new Image();
      img.className = 'gameImage center-block';
      img.src = loadingGifPath;
      // Doing it this way ensures games will be loaded in order
      // Also allows for a loading image
      imageRow.append(img);
      // TODO make images clickable to go to game???
      putImageInElem(game.imagePath, img);
      
      // Inserting top comment text
      captionCol.innerHTML = topCommentText;
      
      
      
  }
  
  function putWallInDivs(leftDiv, rightDiv) {
      var allGamesPromise = getTopGames(20);
      allGamesPromise.then(function(allGames) {
          for(var gameNum = 0; gameNum < allGames.length; gameNum += 1) {
              var game = allGames[gameNum];
              var div = rightDiv;
              // switch columns every other game
              if(gameNum % 2) {
                  div = leftDiv;
              }
              var containerDiv = document.createElement('div');
              containerDiv.className = 'container-fluid';
              div.append(containerDiv);
              populateWallDiv(game, containerDiv);
          }
      });
  }