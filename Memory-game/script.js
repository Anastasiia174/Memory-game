var uniqueEmoji = [
{
    class: 'dog',
    content: '🐶'
}, {
    class: 'unicone',
    content: '🦄'
}, {
    class: 'pig',
    content: '🐨'
}, {
    class: 'frog',
    content: '🐸'
}, {
    class: 'crab',
    content: '🦀'
}, {
    class: 'tiger',
    content: '🐯'
}];
var emoji = uniqueEmoji.concat(uniqueEmoji);

var cards = Array.from(document.querySelectorAll('.game-card'));
shuffleCards(cards, emoji);

var game = document.getElementById('game');
var popup = document.querySelector('.popup');
var popup_msg = document.querySelector('.popup-message');
var popup_btn = document.querySelector('.popup-button');

var clickedCards = [];
var matchedCards = 0;

var timerSettings = {
    minutes: 1,
    seconds: 0
};
var timerID = 0;

var winMessage = animateText(popup_msg.dataset.win);
var loseMessage = animateText(popup_msg.dataset.lose);
/*listening clicking*/
game.addEventListener('click', function(event) {
    var element = event.target;
    //если открыты две карты и они не совпали, то закрываем
    if (clickedCards.length === 2 && element.nodeName === 'DIV' && !element.parentElement.classList.contains('rotated')) {
        clickedCards.forEach(function(card) {
            if (card.lastElementChild.classList.contains('not-match')) {
                card.classList.toggle('rotated');
                card.lastElementChild.classList.remove('not-match');
            }
        });
        clickedCards.splice(0, clickedCards.length);
    }
    //проверяем, что кликнутая карточка не совпала ранее и не является уже открытой
    if (element.nodeName == 'DIV'
        && element.parentElement.nodeName == 'LI'
        && !element.parentElement.lastElementChild.classList.contains('match')
        && !element.parentElement.classList.contains('rotated')
        ) {
        element.parentElement.classList.toggle('rotated');
        clickedCards.push(element.parentElement);
        //устанавливаем таймер
        if (timerID === 0) {
            startTimer(timerSettings.minutes, timerSettings.seconds);
        }
        //если кликнуты две карты, проверяем, что это не одна и та же карта и сравниваем 
        if (clickedCards.length === 2) {
            var cardToCompare = clickedCards[clickedCards.length - 2];
            var notTheSame = element.parentElement.compareDocumentPosition(cardToCompare);
            if (notTheSame) {
                if (cardToCompare.className === element.parentElement.className) {
                    element.parentElement.lastElementChild.classList.add('match');
                    cardToCompare.lastElementChild.classList.add('match');
                    clickedCards.splice(0, clickedCards.length);
                    matchedCards += 2;

                } else {
                    cardToCompare.lastElementChild.classList.add('not-match');
                    element.parentElement.lastElementChild.classList.add('not-match');
                }
            }
        }
    }
    //выигрыш
    if (matchedCards == cards.length) {
        clearTimeout(timerID);
        popup_btn.innerText = popup_btn.dataset.win;
        popup_msg.innerHTML = winMessage;
        popup.classList.remove('display-none');
    }
});

popup_btn.addEventListener('click', function(event) {
    popup.classList.add('display-none');
    clickedCards = [];
    matchedCards = 0;
    timerID = 0;
    closeCards();
    document.querySelector(".timer").innerText = '';
    setTimeout(function() {
        shuffleCards(cards, emoji);
    }, 200);
});

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

function shuffleCards(cards, pictures) {
    pictures = shuffle(pictures);
    cards.forEach(function(card, index) {
        if (card.classList.item(1)) {
            card.classList.remove(card.classList.item(1));
        }
        card.lastElementChild.innerText = pictures[index].content;
        card.classList.add(pictures[index].class);
});
}

function startTimer(minutes, seconds) {
    var m = minutes;
    var s = seconds;
    if (s == 0) {
      if (m == 0) {
        clearTimeout(timerID);
        popup_msg.innerHTML = loseMessage;
        popup_btn.innerText = popup_btn.dataset.lose;
        popup.classList.remove('display-none');
        return;
      }
      m--;
      if (m < 10) m = "0" + m;
      s = 59;
    }
    else s--;
    if (s < 10) s = "0" + s;
    document.querySelector(".timer").innerText = m + ":" + s;
    timerID =  setTimeout(function() {
        startTimer(m, s);
    }, 1000);
}

function closeCards() {
    var openedCards = Array.from(document.querySelectorAll('.rotated'));
    openedCards.forEach(function(card) {
        card.classList.remove('rotated');
        if (card.lastElementChild.classList.contains('match')) {
            card.lastElementChild.classList.remove('match');
        }
        if (card.lastElementChild.classList.contains('not-match')) {
            card.lastElementChild.classList.remove('not-match');
        }
    });
}

function animateText(text) {
    var arrLetters = text.split('');
    var animatedText = arrLetters.map(function(letter, index) {
        var currentLetter = document.createElement('div');
        currentLetter.classList.add('animated-letter');
        var currentDelay = index * 0.1;
        currentLetter.style.animationDelay = currentDelay + 's';
        currentLetter.innerText = letter;
        return currentLetter.outerHTML;
    });
    return animatedText.join('');
}