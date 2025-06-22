document.addEventListener('DOMContentLoaded', () => {
  // Riferimenti alle schermate
  const startScreen = document.getElementById('start-screen');
  const settingsScreen = document.getElementById('settings-screen');
  const playerScreen = document.getElementById('player-screen');
  const gameScreen = document.getElementById('game-screen');

  // Riferimenti per la parte Settings
  const numPlayersSelect = document.getElementById('num-players-select');
  const numRoundsSelect = document.getElementById('num-rounds-select');
  const btnSettingsNext = document.getElementById('btn-settings-next');
  
  // Riferimenti per la fase giocatori
  const playerInputs = document.getElementById('player-inputs');
  const btnStartGame = document.getElementById('btn-start-game');
  const playerForm = document.getElementById('player-form');

  // Back-arrows
  const settingsBackArrow = document.getElementById('settings-back-arrow');
  const playerBackArrow = document.getElementById('player-back-arrow');

  // Bottone Start -> mostra le impostazioni (pagina 2)
  const btnStart = document.getElementById('btn-start');
  btnStart.addEventListener('click', () => {
    startScreen.classList.remove('active');
    startScreen.classList.add('hidden');
    
    settingsScreen.classList.remove('hidden');
    settingsScreen.classList.add('active');
  });

  // Back-arrow nella schermata Impostazioni: torna allo start screen
  settingsBackArrow.addEventListener('click', () => {
    settingsScreen.classList.remove('active');
    settingsScreen.classList.add('hidden');

    startScreen.classList.remove('hidden');
    startScreen.classList.add('active');
  });

  // Bottone "Avanti" in Impostazioni: passa alla schermata dei giocatori
  btnSettingsNext.addEventListener('click', () => {
    // Leggi le impostazioni selezionate
    const numPlayers = parseInt(numPlayersSelect.value);
    const numRounds = parseInt(numRoundsSelect.value);
    
    gameState.totalRounds = numRounds;
    gameState.numPlayers = numPlayers;
    
    // Genera dinamicamente gli input per i nomi dei giocatori
    playerInputs.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
      addPlayerInput();
    }
    
    // Passa alla schermata di Registrazione Giocatori (pagina 3)
    settingsScreen.classList.remove('active');
    settingsScreen.classList.add('hidden');
    
    playerScreen.classList.remove('hidden');
    playerScreen.classList.add('active');
  });

  // Back-arrow nella schermata Registrazione: torna alla schermata Impostazioni
  playerBackArrow.addEventListener('click', () => {
    playerScreen.classList.remove('active');
    playerScreen.classList.add('hidden');
    
    settingsScreen.classList.remove('hidden');
    settingsScreen.classList.add('active');
  });

  // Gestione del form dei giocatori per avviare la partita
  playerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const players = [];
    const playerInputElements = document.querySelectorAll('.player-name');
    playerInputElements.forEach(input => {
      if (input.value.trim() !== '') {
        players.push({ name: input.value.trim(), score: 0 });
      }
    });
    
    // Assicurati che ci siano almeno 2 giocatori
    if (players.length < 2) {
      alert('Inserisci almeno 2 giocatori!');
      return;
    }
    
    console.log('Giocatori registrati:', players);
    
    // Passa alla schermata di gioco
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
    playerInputs.appendChild(inputDiv);
  }

  /* -----------------------------------------
     Gestione della Fase di Gioco (Round)
     (Per ora usiamo domande dummy per il prototipo)
     ----------------------------------------- */

  // Array di domande dummy per simulare il round
  const dummyQuestions = [
    { id: 1, text: "Domanda 1: Chi è il più divertente?", options: ["Opzione A", "Opzione B", "Opzione C", "Opzione D"], type: "chi" },
    { id: 2, text: "Domanda 2: Cosa farebbe Mario in una festa?", options: ["Opzione A", "Opzione B", "Opzione C", "Opzione D"], type: "scelta" },
    { id: 3, text: "Domanda 3: Chi è più probabile per...", options: ["Opzione A", "Opzione B", "Opzione C", "Opzione D"], type: "chi" },
    { id: 4, text: "Domanda 4: La Scelta – quale azione è corretta?", options: ["Opzione A", "Opzione B", "Opzione C", "Opzione D"], type: "scelta" },
    { id: 5, text: "Domanda 5: Completa la frase: ___", options: ["Opzione A", "Opzione B", "Opzione C", "Opzione D"], type: "completa" }
  ];

  // Stato globale della partita
  let gameState = {
    players: [],
    totalRounds: 5,  // verrà aggiornato in base all'impostazione
    numPlayers: 2,   // verrà aggiornato in base all'impostazione
    currentRound: 1,
    currentQuestionIndex: 0,
    questions: [],   // set di domande per il round (dummy per ora)
    answers: [],
    jollyUsed: false
  };

  // Funzione per avviare la partita
  function startGame(players) {
    gameState.players = players;
    // Per ora usiamo dummyQuestions per simulare il round
    gameState.questions = dummyQuestions;
    gameState.currentQuestionIndex = 0;
    gameState.answers = [];
    gameState.jollyUsed = false;
    
    showNextQuestion();
  }

  // Funzione per mostrare la prossima domanda
  function showNextQuestion() {
    const questionArea = document.getElementById('question-area');
    questionArea.innerHTML = '';  // Svuota la vecchia domanda
    
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
      // Fine round / Partita (qui in futuro gestiremo ulteriori fasi)
      questionArea.innerHTML = "<p>Round completato! (Prossime fasi in sviluppo.)</p>";
      document.getElementById('btn-next').style.display = "none";
      return;
    }
    
    const question = gameState.questions[gameState.currentQuestionIndex];
    
    // Crea il contenitore della domanda
    const container = document.createElement('div');
    container.id = 'question-container';
    
    // Testo della domanda
    const qText = document.createElement('p');
    qText.id = 'question-text';
    qText.textContent = question.text;
    container.appendChild(qText);
    
    // Container delle opzioni
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
    
    // Bottone per utilizzare il Jolly (se previsto)
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
    
    // Nascondi il pulsante "Prossima Domanda" finché non viene registrata una risposta
    document.getElementById('btn-next').style.display = "none";
  }

  // Funzione per registrare la risposta
  function recordAnswer(selectedOption, jollyUsed, optionIndex) {
    gameState.answers.push({
      questionId: gameState.questions[gameState.currentQuestionIndex].id,
      selectedOption: selectedOption,
      jollyUsed: jollyUsed,
      optionIndex: optionIndex
    });
    // Disabilita le opzioni e il bottone Jolly per evitare le repliche
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
      Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);
    }
    const btnJolly = document.getElementById('btn-jolly');
    if (btnJolly) btnJolly.disabled = true;
    
    // Mostra il pulsante "Prossima Domanda"
    document.getElementById('btn-next').style.display = "block";
  }
  
  // Bottone "Prossima Domanda"
  document.getElementById('btn-next').addEventListener('click', () => {
    gameState.currentQuestionIndex++;
    gameState.jollyUsed = false; // reset per la domanda successiva
    showNextQuestion();
  });
});