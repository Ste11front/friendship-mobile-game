document.addEventListener('DOMContentLoaded', () => {
  // --- Riferimenti alle schermate ---
  const startScreen    = document.getElementById('start-screen');
  const settingsScreen = document.getElementById('settings-screen');
  const playerScreen   = document.getElementById('player-screen');
  const gameScreen     = document.getElementById('game-screen');

  // --- Spinner numero giocatori ---
  const numPlayersValueSpan = document.getElementById('num-players-value');
  const btnDecreasePlayers  = document.getElementById('btn-decrease-players');
  const btnIncreasePlayers  = document.getElementById('btn-increase-players');
  const minPlayers = 2, maxPlayers = 8;
  let currentPlayers = minPlayers;
  function updatePlayerSpinner() {
    numPlayersValueSpan.textContent = currentPlayers;
    btnDecreasePlayers.disabled = currentPlayers <= minPlayers;
    btnIncreasePlayers.disabled = currentPlayers >= maxPlayers;
  }
  btnDecreasePlayers.addEventListener('click', () => { if (currentPlayers>minPlayers) currentPlayers-- & updatePlayerSpinner(); });
  btnIncreasePlayers.addEventListener('click', () => { if (currentPlayers<maxPlayers) currentPlayers++ & updatePlayerSpinner(); });
  updatePlayerSpinner();

  // --- Spinner numero turni ---
  const numRoundsValueSpan = document.getElementById('num-rounds-value');
  const btnDecreaseRounds  = document.getElementById('btn-decrease-rounds');
  const btnIncreaseRounds  = document.getElementById('btn-increase-rounds');
  const minRounds = 2, maxRounds = 10;
  let currentRounds = 5;
  function updateRoundsSpinner() {
    numRoundsValueSpan.textContent = currentRounds;
    btnDecreaseRounds.disabled = currentRounds <= minRounds;
    btnIncreaseRounds.disabled = currentRounds >= maxRounds;
  }
  btnDecreaseRounds.addEventListener('click', () => { if (currentRounds>minRounds) currentRounds-- & updateRoundsSpinner(); });
  btnIncreaseRounds.addEventListener('click', () => { if (currentRounds<maxRounds) currentRounds++ & updateRoundsSpinner(); });
  updateRoundsSpinner();

  // --- Navigazione schermate ---
  document.getElementById('btn-start').addEventListener('click', () => {
    startScreen.classList.replace('active','hidden');
    settingsScreen.classList.replace('hidden','active');
  });
  document.getElementById('settings-back-arrow').addEventListener('click', () => {
    settingsScreen.classList.replace('active','hidden');
    startScreen.classList.replace('hidden','active');
  });
  document.getElementById('btn-settings-next').addEventListener('click', () => {
    gameState.numPlayers  = currentPlayers;
    gameState.totalRounds = currentRounds;
    const playerInputs = document.getElementById('player-inputs');
    playerInputs.innerHTML = '';
    for(let i=0; i<currentPlayers; i++) addPlayerInput();
    settingsScreen.classList.replace('active','hidden');
    playerScreen.classList.replace('hidden','active');
  });
  document.getElementById('player-back-arrow').addEventListener('click', () => {
    playerScreen.classList.replace('active','hidden');
    settingsScreen.classList.replace('hidden','active');
  });
  document.getElementById('player-form').addEventListener('submit', e => {
    e.preventDefault();
    const players = [];
    document.querySelectorAll('.player-name').forEach(input => {
      if (input.value.trim()) players.push({ name: input.value.trim(), score: 0 });
    });
    if (players.length < 2) return alert('Inserisci almeno 2 giocatori!');
    gameState.players = players;
    playerScreen.classList.replace('active','hidden');
    gameScreen.classList.replace('hidden','active');
    startGame(players);
  });

  // --- Aggiungi input giocatore ---
  function addPlayerInput() {
    const div = document.createElement('div');
    const inp = document.createElement('input');
    inp.className = 'player-name';
    inp.type = 'text';
    inp.placeholder = 'Nome giocatore';
    div.appendChild(inp);
    document.getElementById('player-inputs').appendChild(div);
  }

  // --- Overlay OPZIONI ---
  const gear      = document.getElementById('options-gear');
  const overlay   = document.getElementById('options-overlay');
  const menuIntro = document.getElementById('menu-intro');
  const menuHome  = document.getElementById('menu-home');
  const menuSound = document.getElementById('menu-sound');
  let soundOn = true;

  function openOptions() {
    gear.textContent = '✖';
    overlay.classList.remove('hidden');
  }
  function closeOptions() {
    gear.textContent = '⚙';
    overlay.classList.add('hidden');
  }

  gear.addEventListener('click', () => {
    overlay.classList.contains('hidden') ? openOptions() : closeOptions();
  });
  menuIntro.addEventListener('click', () => {
    alert("Introduzione: [inserisci qui il testo introduttivo]");
    closeOptions();
  });
  menuHome.addEventListener('click', () => {
    [settingsScreen, playerScreen, gameScreen].forEach(s => {
      s.classList.replace('active','hidden');
    });
    startScreen.classList.replace('hidden','active');
    closeOptions();
  });
  menuSound.addEventListener('click', () => {
    soundOn = !soundOn;
    menuSound.textContent = soundOn ? 'Suono: 🔊' : 'Suono: 🔇';
    // qui gestirai play/pause dell’audio di gioco
  });

  // --- Dummy questions & game flow ---
  const dummyQuestions = [
    { id:1, text:"Domanda 1: Chi è il più divertente?", options:["A","B","C","D"] },
    { id:2, text:"Domanda 2: Cosa farebbe Mario in una festa?", options:["A","B","C","D"] },
    { id:3, text:"Domanda 3: Chi è più probabile per...", options:["A","B","C","D"] },
    { id:4, text:"Domanda 4: La Scelta – quale azione è corretta?", options:["A","B","C","D"] },
    { id:5, text:"Domanda 5: Completa la frase: ___", options:["A","B","C","D"] }
  ];
  let gameState = {
    players: [], totalRounds:5, numPlayers:2,
    currentRound:1, currentQuestionIndex:0,
    questions:[], answers:[], jollyUsed:false
  };

  function startGame(players) {
    gameState.players = players;
    gameState.questions = dummyQuestions;
    gameState.currentQuestionIndex = 0;
    gameState.answers = [];
    gameState.jollyUsed = false;
    showNextQuestion();
  }

  function showNextQuestion() {
    const qa = document.getElementById('question-area');
    qa.innerHTML = '';
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
      qa.innerHTML = "<p>Round completato! (Prossime fasi in sviluppo.)</p>";
      document.getElementById('btn-next').style.display = 'none';
      return;
    }
    const q = gameState.questions[gameState.currentQuestionIndex];
    const container = document.createElement('div');
    container.id = 'question-container';
    const qText = document.createElement('p');
    qText.id = 'question-text';
    qText.textContent = q.text;
    container.appendChild(qText);

    const oc = document.createElement('div');
    oc.id = 'options-container';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.addEventListener('click', () => recordAnswer(opt));
      oc.appendChild(btn);
    });
    container.appendChild(oc);

    const btnJolly = document.createElement('button');
    btnJolly.id = 'btn-jolly';
    btnJolly.textContent = 'Usa Jolly';
    btnJolly.addEventListener('click', () => {
      gameState.jollyUsed = true;
      btnJolly.disabled = true;
      btnJolly.textContent = 'Jolly Usato';
    });
    container.appendChild(btnJolly);

    qa.appendChild(container);
    document.getElementById('btn-next').style.display = 'none';
  }

  function recordAnswer(option) {
    gameState.answers.push({
      questionId: gameState.questions[gameState.currentQuestionIndex].id,
      selectedOption: option,
      jollyUsed: gameState.jollyUsed
    });
    document.querySelectorAll('#options-container button').forEach(b => b.disabled = true);
    const j = document.getElementById('btn-jolly');
    if (j) j.disabled = true;
    document.getElementById('btn-next').style.display = 'block';
  }

  document.getElementById('btn-next').addEventListener('click', () => {
    gameState.currentQuestionIndex++;
    gameState.jollyUsed = false;
    showNextQuestion();
  });
});
