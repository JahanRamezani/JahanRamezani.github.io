$(document).ready(() => {
  init();
  setupTabs();
});

// ---------------------
// Vinyl Data
// ---------------------
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
  { img: 'assets/12.jpg', audio: 'assets/12.mp3', artist: 'King Gizzard & The Lizard Wizard', genre: 'Microtonal' },
];

let currentAudio = null;

// ---------------------
// Initialize
// ---------------------
function init() {
  setupBasket();       // Populate basket with vinyls
  setupSortable();     // Make shelf, basket, and player draggable
  setupClickPopup();   // Click vinyl to show info popup
  setupNameInput();    // Handle player's name
}

// ---------------------
// Tabs
// ---------------------
function setupTabs() {
  $("ul.tabs li").click(function () {
    const tabId = $(this).attr("data-tab");

    $("ul.tabs li").removeClass("current");
    $(".tab-content").removeClass("current");

    $(this).addClass("current");
    $("#" + tabId).addClass("current");
  });
}

// ---------------------
// Basket
// ---------------------
function setupBasket() {
  const $basket = $('.basket');
  $basket.empty();

  vinyls.forEach(vinyl => {
    const $item = $('<div class="draggable-item"></div>');
    $item.append(`<img src="${vinyl.img}" 
                        data-audio="${vinyl.audio}" 
                        data-artist="${vinyl.artist}" 
                        data-genre="${vinyl.genre}" />`);
    $basket.append($item);
  });
}

// ---------------------
// Sortable
// ---------------------
function setupSortable() {
  $('.connected-sortable').sortable({
    connectWith: '.connected-sortable',
    placeholder: 'placeholder',
    start: (event, ui) => {
      // Hide vinyl popup when dragging starts
      $('.vinyl-form').hide();

      // Stop any playing audio if dragging from player
      if (ui.item.closest('.record-player').length && currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
    },
    receive: (event, ui) => {
      const $target = $(event.target);

      // Swap vinyl if target already has one
      if (($target.hasClass('slot') || $target.hasClass('record-player')) && $target.children().length > 1) {
        const $existingVinyl = $target.children().first();
        ui.sender.append($existingVinyl);
      }

      // Play audio immediately if vinyl dropped in record player
      if ($target.hasClass('record-player')) {
        const audioFile = ui.item.find('img').data('audio');
        if (currentAudio) currentAudio.pause();
        currentAudio = new Audio(audioFile);
        currentAudio.play();
      }

      // Show vinyl popup only for shelf slots
      if ($target.hasClass('slot')) {
        showVinylForm(ui.item);
      }
    }
  }).disableSelection();
}


// ---------------------
// Click Popup
// ---------------------
function setupClickPopup() {
  $(document).on('click', '.draggable-item img', function () {
    const $vinyl = $(this).parent();
    if ($vinyl.closest('.slot').length) {
      showVinylForm($vinyl);
    }
  });
}

// ---------------------
// Vinyl Popup Form
// ---------------------
function showVinylForm($vinyl) {
  const validArtists = [...new Set(vinyls.map(v => v.artist))];
  const validGenres = [...new Set(vinyls.map(v => v.genre))];

  const $artistSelect = $('#artistSelect').empty().append('<option value="">--Select Artist--</option>');
  validArtists.forEach(a => $artistSelect.append(`<option value="${a}">${a}</option>`));

  const $genreSelect = $('#genreSelect').empty().append('<option value="">--Select Genre--</option>');
  validGenres.forEach(g => $genreSelect.append(`<option value="${g}">${g}</option>`));

  // Fill with previously selected values if any
  if ($vinyl.data('artist')) $artistSelect.val($vinyl.data('artist'));
  if ($vinyl.data('genre')) $genreSelect.val($vinyl.data('genre'));

  $('.vinyl-form').show();

  $('#saveVinyl').off('click').on('click', () => {
    const selectedArtist = $artistSelect.val();
    const selectedGenre = $genreSelect.val();

    if (!selectedArtist || !selectedGenre) {
      alert('Please select both artist and genre.');
      return;
    }

    if (selectedArtist !== $vinyl.find('img').data('artist') ||
        selectedGenre !== $vinyl.find('img').data('genre')) {
      alert('Incorrect Artist or Genre! Try again.');
      return;
    }

    // Save user selections to vinyl
    $vinyl.data({ artist: selectedArtist, genre: selectedGenre, detailsEntered: true });
    $('.vinyl-form').hide();
  });
}

// ---------------------
// Name Input
// ---------------------
function setupNameInput() {
  const $nameInput = $('#playerNameInput');
  const $shelfTitle = $('#shelfTitle');

  const savedName = localStorage.getItem('playerName');
  if (savedName) {
    $nameInput.val(savedName);
    $shelfTitle.text(`${savedName}'s Vinyl Shelf`);
  }

  $nameInput.on('blur', function() {
    const name = $nameInput.val().trim();
    if (name) {
      localStorage.setItem('playerName', name);
      $shelfTitle.text(`${name}'s Vinyl Shelf`);
    }
  });
}

