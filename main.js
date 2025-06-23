document.addEventListener('DOMContentLoaded', () => {
  // Riferimenti alle schermate
  const startScreen = document.getElementById('start-screen');
  const settingsScreen = document.getElementById('settings-screen');
  const playerScreen = document.getElementById('player-screen');
  const gameScreen = document.getElementById('game-screen');

  /* --- Controlli per il numero di giocatori (spinner) --- */
  const numPlayersValueSpan = document.getElementById('num-players-value');
  const btnDecreasePlayers = document.getElementById('btn-decrease-players');
  const btnIncreasePlayers = document.getElementById('btn-increase-players');
  const minPlayers = 2;
  const maxPlayers = 8;
  let currentPlayers = minPlayers; // Valore iniziale

  function updatePlayerSpinner() {
    numPlayersValueSpan.textContent = currentPlayers;
    btnDecreasePlayers.disabled = (currentPlayers <= minPlayers);
    btnIncreasePlayers.disabled = (currentPlayers >= maxPlayers);
  }
  
  btnDecreasePlayers.addEventListener('click', () => {
    if (currentPlayers > minPlayers) {
      currentPlayers--;
      updatePlayerSpinner();
    }
  });
  
  btnIncreasePlayers.addEventListener('click', () => {
    if (currentPlayers < maxPlayers) {
      currentPlayers++;
      updatePlayerSpinner();
    }
  });
  
  updatePlayerSpinner();

  /* --- Controlli per il numero di turni (spinner) --- */
  const numRoundsValueSpan = document.getElementById('num-rounds-value');
  const btnDecreaseRounds = document.getElementById('btn-decrease-rounds');
  const btnIncreaseRounds = document.getElementById('btn-increase-rounds');
  const minRounds = 2;
  const maxRounds = 10;
  let currentRounds = 5; // Valore iniziale

  function updateRoundsSpinner() {
    numRoundsValueSpan.textContent = currentRounds;
    btnDecreaseRounds.disabled = (currentRounds <= minRounds);
    btnIncreaseRounds.disabled = (currentRounds >= maxRounds);
  }
  
  btnDecreaseRounds.addEventListener('click', () => {
    if (currentRounds > minRounds) {
      currentRounds--;
      updateRoundsSpinner();
    }
  });
  
  btnIncreaseRounds.addEventListener('click', () => {
    if (currentRounds < maxRounds) {
      currentRounds++;
      updateRoundsSpinner();
    }
  });
  
  updateRoundsSpinner();

  /* --- Navigazione tra le schermate --- */
  
  // Pulsante "Inizia" nella Pagina 1: vai alla schermata Impostazioni (Pagina 2)
  const btnStart = document.getElementById('btn-start');
  btnStart.addEventListener('click', () => {
    startScreen.classList.remove('active');
    startScreen.classList.add('hidden');
    settingsScreen.classList.remove('hidden');
    settingsScreen.classList.add('active');
  });
  
  // Back-arrow nella schermata Impostazioni: torna allo start screen
  const settingsBackArrow = document.getElementById('settings-back-arrow');
  settingsBackArrow.addEventListener('click', () => {
    settingsScreen.classList.remove('active');
    settingsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    startScreen.classList.add('active');
  });
  
  // Pulsante "Avanti" nella schermata Impostazioni: passa alla schermata Registrazione Giocatori (Pagina 3)
  const btnSettingsNext = document.getElementById('btn-settings-next');
  btnSettingsNext.addEventListener('click', () => {
    const numPlayers = currentPlayers;
    const numRounds = currentRounds;
    gameState.numPlayers = numPlayers;
    gameState.totalRounds = numRounds;
    
    // Genera dinamicamente gli input per i nomi dei giocatori
    const playerInputs = document.getElementById('player-inputs');
    playerInputs.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
      addPlayerInput();
    }
    
    settingsScreen.classList.remove('active');
    settingsScreen.classList.add('hidden');
    playerScreen.classList.remove('hidden');
    playerScreen.classList.add('active');
  });
  
  // Back-arrow nella schermata Registrazione: torna alla schermata Impostazioni
  const playerBackArrow = document.getElementById('player-back-arrow');
  playerBackArrow.addEventListener('click', () => {
    playerScreen.classList.remove('active');
    playerScreen.classList.add('hidden');
    settingsScreen.classList.remove('hidden');
    settingsScreen.classList.add('active');
  });
  
  // Form Registrazione Giocatori: avvia la partita
  const playerForm = document.getElementById('player-form');
  playerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const players = [];
    const playerInputElements = document.querySelectorAll('.player-name');
    playerInputElements.forEach(input => {
      if (input.value.trim() !== '') {
        players.push({ name: input.value.trim(), score: 0 });
      }
    });
    
    if (players.length < 2) {
      alert('Inserisci almeno 2 giocatori!');
      return;
    }
    
    console.log('Giocatori registrati:', players);
    playerScreen.classList.remove('active');
    playerScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    gameScreen.classList.add('active');
    startGame(players);
  });
  
  // Funzione per aggiungere un campo input per il nome di un giocatore
  function addPlayerInput() {
    const inputDiv = document.createElement('div');
    const input = document.createElement('input');
    input.classList.add('player-name');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Nome giocatore');
    inputDiv.appendChild(input);
    document.getElementById('player-inputs').appendChild(inputDiv);
  }
  
  /* --- Gestione dell'ingranaggio e menù contestuale globale --- */
  
  const optionsGear = document.getElementById('options-gear');
  const contextMenu = document.getElementById('context-menu');
  
  optionsGear.addEventListener('click', () => {
    if (contextMenu.classList.contains('hidden')) {
      optionsGear.textContent = "✖";
      contextMenu.classList.remove('hidden');
    } else {
      optionsGear.textContent = "⚙";
      contextMenu.classList.add('hidden');
    }
  });
  
  // Eventi per il menù contestuale
  const menuIntro = document.getElementById('menu-intro');
  const menuHome = document.getElementById('menu-home');
  
  menuIntro.addEventListener('click', () => {
    alert("Introduzione: [Inserisci qui il testo introduttivo del gioco]");
    optionsGear.textContent = "⚙";
    contextMenu.classList.add('hidden');
  });
  
  menuHome.addEventListener('click', () => {
    // Riporta a start screen: nasconde eventuali schermate attive e mostra lo start screen
    settingsScreen.classList.remove('active');
    settingsScreen.classList.add('hidden');
    playerScreen.classList.remove('active');
    playerScreen.classList.add('hidden');
    gameScreen.classList.remove('active');
    gameScreen.classList.add('hidden');
    
    startScreen.classList.remove('hidden');
    startScreen.classList.add('active');
    
    optionsGear.textContent = "⚙";
    contextMenu.classList.add('hidden');
  });
  
  /* --- Gestione della Fase di Gioco (Round) --- */
  
  const dummyQuestions = [
    { id: 1, text: "Domanda 1: Chi è il più divertente?", options: ["Opzione A", "Opzione B", "Opzione C", "Opzione D"], type: "chi" },
    { id: 2, text: "Domanda 2: Cosa farebbe Mario in una festa?", options: ["Opzione A", "Opzione B", "Opzione C", "Opzione D"], type: "scelta" },
    { id: 3, text: "Domanda 3: Chi è più probabile per...", options: ["Opzione A", "Opzione B", "Opzione C", "Opzione D"], type: "chi" },
    { id: 4, text: "Domanda 4: La Scelta – quale azione è corretta?", options: ["Opzione A", "Opzione B", "Opzione C", "Opzione D"], type: "scelta" },
    { id: 5, text: "Domanda 5: Completa la frase: ___", options: ["Opzione A", "Opzione B", "Opzione C", "Opzione D"], type: "completa" }
  ];
  
  let gameState = {
    players: [],
    totalRounds: 5,
    numPlayers: 2,
    currentRound: 1,
    currentQuestionIndex: 0,
    questions: [],
    answers: [],
    jollyUsed: false
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
    const questionArea = document.getElementById('question-area');
    questionArea.innerHTML = '';
    
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
      questionArea.innerHTML = "<p>Round completato! (Prossime fasi in sviluppo.)</p>";
      document.getElementById('btn-next').style.display = "none";
      return;
    }
    
    const question = gameState.questions[gameState.currentQuestionIndex];
    const container = document.createElement('div');
    container.id = 'question-container';
    
    const qText = document.createElement('p');
    qText.id = 'question-text';
    qText.textContent = question.text;
    container.appendChild(qText);
    
    const optionsContainer = document.createElement('div');
    optionsContainer.id = 'options-container';
    question.options.forEach((option, index) => {
      const btnOption = document.createElement('button');
      btnOption.textContent = option;
      btnOption.addEventListener('click', () => {
        recordAnswer(option, gameState.jollyUsed, index);
      });
      optionsContainer.appendChild(btnOption);
    });
    container.appendChild(optionsContainer);
    
    const btnJolly = document.createElement('button');
    btnJolly.id = 'btn-jolly';
    btnJolly.textContent = "Usa Jolly";
    btnJolly.addEventListener('click', () => {
      gameState.jollyUsed = true;
      btnJolly.disabled = true;
      btnJolly.textContent = "Jolly Usato";
    });
    container.appendChild(btnJolly);
    
    questionArea.appendChild(container);
    document.getElementById('btn-next').style.display = "none";
  }
  
  function recordAnswer(selectedOption, jollyUsed, optionIndex) {
    gameState.answers.push({
      questionId: gameState.questions[gameState.currentQuestionIndex].id,
      selectedOption: selectedOption,
      jollyUsed: jollyUsed,
      optionIndex: optionIndex
    });
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
      Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);
    }
    const btnJolly = document.getElementById('btn-jolly');
    if (btnJolly) btnJolly.disabled = true;
    document.getElementById('btn-next').style.display = "block";
  }
  
  document.getElementById('btn-next').addEventListener('click', () => {
    gameState.currentQuestionIndex++;
    gameState.jollyUsed = false;
    showNextQuestion();
  });
});