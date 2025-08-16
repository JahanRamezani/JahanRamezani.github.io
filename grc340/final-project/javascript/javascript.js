$(document).ready(init);

// ---------------------------
// Vinyl Data
// ---------------------------
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
  { img: 'assets/12.jpg', audio: 'assets/12.mp3', artist: 'King Gizzard & The Lizard Wizard', genre: 'House' }
];

// ---------------------------
// Global Audio
// ---------------------------
let currentAudio = null;

// ---------------------------
// Initialize Everything
// ---------------------------
function init() {
  setupBasket();
  setupShelf();
  setupRecordPlayer();
  setupSortable();
  setupClickPopup();
}

// ---------------------------
// Basket Setup (2-row grid)
// ---------------------------
function setupBasket() {
  const $basket = $(".basket");
  vinyls.forEach(vinyl => {
    const $item = $(`
      <div class="draggable-item" 
           data-audio="${vinyl.audio}" 
           data-artist="${vinyl.artist}" 
           data-genre="${vinyl.genre}">
        <img src="${vinyl.img}" />
      </div>
    `);
    $basket.append($item);
  });
}

// ---------------------------
// Shelf Setup
// ---------------------------
function setupShelf() {
  $(".shelf .slot").each(function() {
    $(this).empty();
  });
}

// ---------------------------
// Record Player Setup
// ---------------------------
function setupRecordPlayer() {
  $(".record-player .slot").empty();
}

// ---------------------------
// Sortable Setup
// ---------------------------
function setupSortable() {
  $(".basket, .shelf .slot, .record-player .slot").sortable({
    connectWith: ".connected-sortable",
    placeholder: "placeholder",
    start: function(event, ui) {
      $(".vinyl-form").remove();

      // Stop audio if dragging out of record player
      if (ui.item.closest(".record-player").length && currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
    },
    receive: function(event, ui) {
      const $target = $(this);

      // Popup only when vinyl goes to shelf
      if ($target.closest(".shelf").length) {
        showVinylForm(ui.item);
      }

      // Only one vinyl per shelf slot
      if ($target.hasClass("slot") && $target.closest(".shelf").length && $target.children().length > 1) {
        const $old = $target.children().first();
        ui.sender.append($old);
      }

      // Play audio if vinyl dropped into record player slot
      if ($target.closest(".record-player").length) {
        const audioFile = ui.item.data("audio") || ui.item.find("img").data("audio");
        playRecord(audioFile);
      } else {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio = null;
        }
      }
    }
  }).disableSelection();
}

// ---------------------------
// Click Vinyl on Shelf to Reopen Popup
// ---------------------------
function setupClickPopup() {
  $(document).on("click", ".shelf .slot .draggable-item", function() {
    showVinylForm($(this));
  });
}

// ---------------------------
// Vinyl Popup Form
// ---------------------------
function showVinylForm($vinyl) {
  $(".vinyl-form").remove();

  const validArtists = ["Alvvays","King Gizzard & The Lizard Wizard","Talking Heads","Carole King","The Beach Boys","Midlake","Derya Yildirim & Grup Şimşek","Clairo","Leah Senior","The Beths"];
  const validGenres = ["Rock","Pop","New Wave","Folk","Blues","House"];

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

  $("body").append(formHTML);

  $("#saveVinyl").on("click", function() {
    const selectedArtist = $("#artistSelect").val();
    const selectedGenre = $("#genreSelect").val();

    if (selectedArtist !== $vinyl.data("artist") || selectedGenre !== $vinyl.data("genre")) {
      alert("Incorrect Artist or Genre! Please try again.");
      return;
    }

    $vinyl.data("detailsEntered", true);
    $(".vinyl-form").remove();
  });
}

// ---------------------------
// Play Record Audio
// ---------------------------
function playRecord(audioFile) {
  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio(audioFile);
  currentAudio.play();
}
