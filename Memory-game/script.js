/*for randomizing array*/
function shuffle(arr) { 
    var j, temp;
    for(var i = arr.length - 1; i > 0; i--){
        j = Math.floor(Math.random()*(i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

var cards = Array.from(document.querySelectorAll('li'));

var uniqueEmoji = [
{   
    class: 'dog',
    content: '🐶'
}, 
{   
    class: 'unicone',
    content: '🦄'
},
{   
    class: 'pig',
    content: '🐨'
},
{   
    class: 'frog',
    content: '🐸'
},
{   
    class: 'crab',
    content: '🦀'
},
{   
    class: 'tiger',
    content: '🐯'
}];
var emoji = uniqueEmoji.concat(uniqueEmoji);
emoji = shuffle(emoji);

cards.forEach(function(card, index) {
    card.lastElementChild.innerText = emoji[index].content;
    card.classList.add(emoji[index].class)
});


/*listening clicking*/

var game = document.getElementById('game');
var clickedCards = [];

game.addEventListener('click', function(event) {
    var element = event.target;

    if (clickedCards.length === 2 && element.nodeName === 'DIV' && !element.parentElement.classList.contains('rotated')) {
        clickedCards.forEach(function(card) {
            if (card.lastElementChild.classList.contains('not-match')) {
                card.lastElementChild.classList.remove('not-match');
                card.classList.toggle('rotated');
            }
        });
        clickedCards.splice(0, clickedCards.length);
    }
    
    if (element.nodeName == 'DIV' 
        && element.parentElement.nodeName == 'LI' 
        && !element.parentElement.lastElementChild.classList.contains('match')
        && !element.parentElement.classList.contains('rotated')
        ) {
        element.parentElement.classList.toggle('rotated');
        clickedCards.push(element.parentElement);
        
        if (clickedCards.length === 2) {
            var cardToCompare = clickedCards[clickedCards.length - 2];
            var notTheSame = element.parentElement.compareDocumentPosition(cardToCompare);
            if (notTheSame) {
                if (cardToCompare.className === element.parentElement.className) {
                    element.parentElement.lastElementChild.classList.add('match');
                    cardToCompare.lastElementChild.classList.add('match');
                    clickedCards.splice(0, clickedCards.length);
                } else {
                    cardToCompare.lastElementChild.classList.add('not-match');
                    element.parentElement.lastElementChild.classList.add('not-match');
                }
            }
        }
    }

});