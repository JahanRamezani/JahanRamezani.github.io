$(document).ready(function() {
  init();
});



// =====================
// VINYL DATA
// =====================
const vinyls = [
  { img: 'assets/1.jpg', audio: 'assets/1.mp3', artist: 'Alvvays', genre: 'Rock' },
  { img: 'assets/2.jpeg', audio: 'assets/2.mp3', artist: 'King Gizzard & The Lizard Wizard', genre: 'Rock' },
  { img: 'assets/3.jpg', audio: 'assets/3.mp3', artist: 'Talking Heads', genre: 'New Wave' },
  { img: 'assets/4.jpg', audio: 'assets/4.mp3', artist: 'Carole King', genre: 'Folk' },
  { img: 'assets/5.jpg', audio: 'assets/5.mp3', artist: 'The Beach Boys', genre: 'Pop' },
  { img: 'assets/6.jpg', audio: 'assets/6.mp3', artist: 'Midlake', genre: 'Folk' },
  { img: 'assets/7.jpg', audio: 'assets/7.mp3', artist: 'Derya Yildirim & Grup Şimşek', genre: 'Folk' },
  { img: 'assets/8.jpg', audio: 'assets/8.mp3', artist: 'King Gizzard & The Lizard Wizard', genre: 'Blues' },
  { img: 'assets/9.jpg', audio: 'assets/9.mp3', artist: 'Clairo', genre: 'Pop' },
  { img: 'assets/10.jpg', audio: 'assets/10.mp3', artist: 'Leah Senior', genre: 'Folk' },
  { img: 'assets/11.jpg', audio: 'assets/11.mp3', artist: 'The Beths', genre: 'Rock' },
  { img: 'assets/12.jpg', audio: 'assets/12.mp3', artist: 'King Gizzard & The Lizard Wizard', genre: 'House' },
];

let currentAudio = null;



// =====================
// INIT FUNCTION
// =====================
function init() {
  setupHeader();
  setupShelf();
  setupBasket();
  setupSortable();
  setupClickPopup();
}



// =====================
// HEADER SETUP
// =====================
function setupHeader() {
  // Example: retrieve name from previous page via localStorage
  const playerName = localStorage.getItem('playerName') || "Name's Vinyl Shelf";
  $('#playerNameTitle').text(playerName + "'s Vinyl Shelf");

  $('#finishBtn').on('click', function() {
    window.location.href = 'close.html';
  });
}



// =====================
// SHELF SETUP
// =====================
function setupShelf() {
  const $shelf = $('.shelf');
  $shelf.empty();

  for (let i = 0; i < 8; i++) {
    $shelf.append('<ul class="slot connected-sortable"></ul>');
  }
}



// =====================
// BASKET SETUP
// =====================
function setupBasket() {
  const $basket = $('.basket');
  $basket.empty();

  const $basketList = $('<ul class="songs connected-sortable"></ul>');

  vinyls.forEach((vinyl, index) => {
    const $item = $('<li class="draggable-item"></li>');
    $item.append(`<img src="${vinyl.img}" data-audio="${vinyl.audio}" data-artist="${vinyl.artist}" data-genre="${vinyl.genre}" />`);
    $basketList.append($item);
  });

  $basket.append($basketList);
}



// =====================
// SORTABLE SETUP
// =====================
function setupSortable() {
  $('.songs, .slot').sortable({
    connectWith: '.connected-sortable',
    placeholder: 'placeholder',
    start: function(event, ui) {
      // Hide vinyl popup while dragging
      $('.vinyl-form').remove();

      // Stop audio if dragging out of player
      if (ui.item.closest('.record-player').length && currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
    },
    receive: function(event, ui) {
      const $target = $(this);

      // Limit 1 vinyl in record player
      if ($target.closest('.record-player').length && $target.children().length > 1) {
        const oldItem = $target.children().first();
        ui.sender.append(oldItem);
      }

      // Play audio if vinyl in record player
      if ($target.closest('.record-player').length) {
        const audioFile = $target.find('img').data('audio');
        if (currentAudio) currentAudio.pause();
        currentAudio = new Audio(audioFile);
        currentAudio.play();
      }

      // Show popup only for shelf
      if ($target.closest('.shelf').length) {
        showVinylForm(ui.item);
      }
    }
  }).disableSelection();
}



// =====================
// CLICK TO REOPEN POPUP
// =====================
function setupClickPopup() {
  $(document).on('click', '.draggable-item img', function() {
    const $vinyl = $(this).parent();
    if ($vinyl.closest('.shelf').length) {
      showVinylForm($vinyl);
    }
  });
}



// =====================
// VINYL POPUP FORM
// =====================
function showVinylForm($vinyl) {
  $('.vinyl-form').remove();

  const validArtists = ["Alvvays", "King Gizzard & The Lizard Wizard", "Talking Heads", "Carole King", "The Beach Boys", "Midlake", "Derya Yildirim & Grup Şimşek", "Clairo", "Leah Senior", "The Beths"];
  const validGenres = ["Rock", "Pop", "New Wave", "Folk", "Blues", "House"];

  let formHTML = `<div class="vinyl-form">
      <label>Artist:
        <select id="artistSelect">`;
  validArtists.forEach(a => formHTML += `<option value="${a}">${a}</option>`);
  formHTML += `</select></label>
      <label>Genre:
        <select id="genreSelect">`;
  validGenres.forEach(g => formHTML += `<option value="${g}">${g}</option>`);
  formHTML += `</select></label>
      <button id="saveVinyl">Save</button>
    </div>`;

  $('body').append(formHTML);

  $('#saveVinyl').on('click', function() {
    const selectedArtist = $('#artistSelect').val();
    const selectedGenre = $('#genreSelect').val();

    if (selectedArtist !== $vinyl.find('img').data('artist') ||
        selectedGenre !== $vinyl.find('img').data('genre')) {
      alert('Incorrect Artist or Genre! Please try again.');
      return;
    }

    $vinyl.data('artist', selectedArtist);
    $vinyl.data('genre', selectedGenre);
    $vinyl.data('detailsEntered', true);
    $('.vinyl-form').remove();
  });
}
