// The Mariotto Mystery - Point and Click Adventure Game

class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
        this.musicPlaying = false;
        this.backgroundMusic = null;
    }

    preload() {
        // Carregando assets
        this.load.image('titleScreen', 'assets/images/title_screen.png');
        this.load.audio('happyMusic', 'assets/audio/happy_music.mp3');
        this.load.audio('puzzleMusic', 'assets/audio/puzzle_music.mp3');
        this.load.audio('battleMusic', 'assets/audio/battle_music.mp3');
    }

    create() {
        // Adicionando imagem de fundo
        this.add.image(400, 300, 'titleScreen').setScale(0.8);

        // Configurando música de fundo
        this.backgroundMusic = this.sound.add('happyMusic', { loop: true, volume: 0.5 });
        
        // Botão Play
        const playButton = this.add.rectangle(400, 450, 200, 60, 0x4CAF50)
            .setInteractive()
            .on('pointerdown', () => this.startGame())
            .on('pointerover', () => playButton.setFillStyle(0x45a049))
            .on('pointerout', () => playButton.setFillStyle(0x4CAF50));

        this.add.text(400, 450, 'JOGAR', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Botão de Música
        this.musicButton = this.add.rectangle(100, 50, 80, 40, 0x2196F3)
            .setInteractive()
            .on('pointerdown', () => this.toggleMusic());

        this.musicButtonText = this.add.text(100, 50, '♪ ON', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Botão de Créditos
        const creditsButton = this.add.rectangle(700, 50, 100, 40, 0xFF9800)
            .setInteractive()
            .on('pointerdown', () => this.showCredits());

        this.add.text(700, 50, 'CRÉDITOS', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Iniciar música automaticamente
        this.backgroundMusic.play();
        this.musicPlaying = true;
    }

    toggleMusic() {
        if (this.musicPlaying) {
            this.backgroundMusic.pause();
            this.musicButtonText.setText('♪ OFF');
            this.musicPlaying = false;
        } else {
            this.backgroundMusic.resume();
            this.musicButtonText.setText('♪ ON');
            this.musicPlaying = true;
        }
    }

    showCredits() {
        // Criar overlay de créditos
        const creditsOverlay = this.add.rectangle(400, 300, 600, 400, 0x000000, 0.8);
        
        const creditsText = this.add.text(400, 200, 'CRÉDITOS\n\n' +
            'Desenvolvido por: Manus AI\n' +
            'Música: Pixabay (Royalty Free)\n' +
            'Conceito: Usuário\n' +
            'Engine: Phaser 3\n\n' +
            'Agradecimentos especiais a todos\n' +
            'que contribuíram para este projeto!', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);

        const closeButton = this.add.rectangle(400, 450, 100, 40, 0xf44336)
            .setInteractive()
            .on('pointerdown', () => {
                creditsOverlay.destroy();
                creditsText.destroy();
                closeButton.destroy();
                closeButtonText.destroy();
            });

        const closeButtonText = this.add.text(400, 450, 'FECHAR', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }

    startGame() {
        this.scene.start('GameScene');
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.inventory = [];
        this.keys = 0;
        this.currentRoom = 'patio';
        this.dialogBox = null;
        this.inventoryUI = null;
        this.currentMusic = null;
        this.puzzleMusic = null;
        this.battleMusic = null;
    }

    preload() {
        // Carregando imagens das salas
        this.load.image('patio', 'assets/images/patio.png');
        this.load.image('sala1a', 'assets/images/sala1a.png');
        this.load.image('sala1b', 'assets/images/sala1b.png');
        this.load.image('cozinha', 'assets/images/cozinha.png');
        this.load.image('area_verde', 'assets/images/area_verde.png');
        this.load.image('coordenacao', 'assets/images/coordenacao.png');
        this.load.image('secretaria', 'assets/images/secretaria.png');
        this.load.image('sala_professores', 'assets/images/sala_professores.png');
        this.load.image('direcao', 'assets/images/direcao.png');
        this.load.image("wc", "assets/images/wc.png");
        this.load.image("key_item", "assets/images/key_item.png");
        this.load.image("laboratorio_sr_f", "assets/images/laboratorio_sr_f.png");
        
        // Carregando músicas
        this.load.audio('puzzleMusic', 'assets/audio/puzzle_music.mp3');
        this.load.audio('battleMusic', 'assets/audio/battle_music.mp3');
    }

    create() {
        // Configurar músicas
        this.puzzleMusic = this.sound.add('puzzleMusic', { loop: true, volume: 0.3 });
        this.battleMusic = this.sound.add('battleMusic', { loop: true, volume: 0.4 });
        
        // Criar UI do inventário
        this.createInventoryUI();
        
        // Criar caixa de diálogo
        this.createDialogBox();
        
        // Carregar sala inicial
        this.loadRoom('patio');
        
        // Mostrar introdução
        this.showDialog("Bem-vindo à Escola Mariotto! O cientista Mini M. foi sequestrado pelo vilão Sr. F. Você deve encontrar as chaves para salvá-lo!");
    }

    createInventoryUI() {
        // Fundo do inventário
        this.inventoryBg = this.add.rectangle(700, 100, 180, 200, 0x333333, 0.8);
        
        this.add.text(700, 30, 'INVENTÁRIO', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Container para os itens do inventário
        this.inventoryContainer = this.add.container(610, 70);

        // Contador de chaves
        this.keysText = this.add.text(700, 60, 'Chaves: 0/5', {
            fontSize: '14px',
            fill: '#ffff00',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }

    addItemToInventory(item) {
        this.inventory.push(item);
        this.updateInventoryUI();
        this.showDialog(`Você pegou: ${item.name}`);
    }

    removeItemFromInventory(item) {
        this.inventory = this.inventory.filter(i => i.id !== item.id);
        this.updateInventoryUI();
    }

    updateInventoryUI() {
        this.inventoryContainer.removeAll(true);
        let xOffset = 0;
        let yOffset = 0;
        this.inventory.forEach((item, index) => {
            const itemImage = this.add.image(xOffset, yOffset, item.textureKey).setScale(0.5).setInteractive();
            itemImage.setOrigin(0, 0);
            itemImage.on('pointerdown', () => this.useItem(item));
            this.inventoryContainer.add(itemImage);
            xOffset += 40; // Ajuste para espaçamento
            if (xOffset >= 160) { // Quebra de linha para nova linha de itens
                xOffset = 0;
                yOffset += 40;
            }
        });
        this.keysText.setText(`Chaves: ${this.keys}/5`);
    }

    useItem(item) {
        this.showDialog(`Você usou: ${item.name}`);
        // Lógica para usar o item dependendo do contexto e da sala
        // Exemplo: if (this.currentRoom === 'laboratorio_quimica' && item.id === 'acido') { ... }
    }

    createDialogBox() {
        // Caixa de diálogo (inicialmente invisível)
        this.dialogBg = this.add.rectangle(400, 500, 750, 150, 0x000000, 0.8).setVisible(false);
        this.dialogText = this.add.text(400, 500, '', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5).setVisible(false);
    }

    showDialog(text) {
        this.dialogBg.setVisible(true);
        this.dialogText.setVisible(true);
        this.dialogText.setText(text);
        
        // Auto-fechar após 3 segundos
        this.time.delayedCall(3000, () => {
            this.dialogBg.setVisible(false);
            this.dialogText.setVisible(false);
        });
    }

    loadRoom(roomName) {
        if (this.currentMusic) {
            this.currentMusic.stop();
        }
        this.currentRoom = roomName;
        
        // Limpar sala anterior
        if (this.roomImage) {
            this.roomImage.destroy();
        }
        
        // Carregar nova sala
        this.roomImage = this.add.image(400, 300, roomName);
        
        // Adicionar interatividade baseada na sala
        this.setupRoomInteractions(roomName);

        // Tocar música da sala
        if (roomName === 'sala1a' || roomName === 'sala1b') {
            this.currentMusic = this.puzzleMusic;
        } else if (roomName === 'patio') {
            // O pátio pode ter uma música ambiente ou nenhuma
            // Por enquanto, não toca nada específico para o pátio, a música do título já parou
            this.currentMusic = null;
        }

        if (this.currentMusic) {
            this.currentMusic.play();
        }
    }

    playBattleMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
        }
        this.currentMusic = this.battleMusic;
        this.currentMusic.play();
    }

    stopBattleMusic() {
        if (this.currentMusic === this.battleMusic) {
            this.currentMusic.stop();
            // Retorna para a música da sala atual após o combate
            if (this.currentRoom === 'sala1a' || this.currentRoom === 'sala1b') {
                this.currentMusic = this.puzzleMusic;
                this.currentMusic.play();
            } else {
                this.currentMusic = null;
            }
        }
    }

    setupRoomInteractions(roomName) {
        // Remover interações anteriores
        this.input.removeAllListeners();
        
        switch(roomName) {
            case 'patio':
                this.setupPatioInteractions();
                break;
            case 'sala1a':
                this.setupSala1AInteractions();
                break;
            case 'sala1b':
                this.setupSala1BInteractions();
                break;
            case 'cozinha':
                this.setupCozinhaInteractions();
                break;
            case 'area_verde':
                this.setupAreaVerdeInteractions();
                break;
            case 'coordenacao':
                this.setupCoordenacaoInteractions();
                break;
            case 'secretaria':
                this.setupSecretariaInteractions();
                break;
            case 'sala_professores':
                this.setupSalaProfessoresInteractions();
                break;
            case 'direcao':
                this.setupDirecaoInteractions();
                break;
            case 'wc':
                this.setupWCInteractions();
                break;
        }
    }

    setupPatioInteractions() {
        // Área clicável para ir para Sala 1A
        const sala1AArea = this.add.rectangle(200, 200, 100, 80, 0x00ff00, 0.3)
            .setInteractive()
            .on('pointerdown', () => {
                this.loadRoom('sala1a');
                this.showDialog("Você entrou na Sala 1°A. Há um enigma matemático na lousa!");
            });

        // Área clicável para ir para o Laboratório do Sr. F. (apenas se tiver todas as chaves)
        if (this.keys >= 5) {
            const srFLabArea = this.add.rectangle(400, 300, 200, 100, 0xFF0000, 0.5)
                .setInteractive()
                .on("pointerdown", () => {
                    this.loadRoom("laboratorio_sr_f");
                    this.showDialog("Você encontrou o laboratório do Sr. F.! Prepare-se para o desafio final!");
                    this.solveFinalPuzzle();
                });
            this.add.text(400, 300, "Laboratório\ndo Sr. F.", { 
                fontSize: "16px", 
                fill: "#ffffff",
                align: "center"
            }).setOrigin(0.5);
        }  this.add.text(600, 150, 'Sala 1°B', { fontSize: '14px', fill: '#333' }).setOrigin(0.5);
    }

    setupSala1AInteractions() {
        // Enigma matemático
        const mathPuzzle = this.add.rectangle(400, 250, 200, 100, 0xffff00, 0.5)
            .setInteractive()
            .on("pointerdown", () => this.solveMathPuzzle());

        this.add.text(400, 250, "Enigma\nMatemático", { 
            fontSize: "16px", 
            fill: "#333",
            align: "center"
        }).setOrigin(0.5);

        // Capanga (inimigo)
        const capanga = this.add.rectangle(600, 400, 100, 100, 0x8B0000, 0.7)
            .setInteractive()
            .on("pointerdown", () => this.startBattle("Capanga da Matemática"));

        this.add.text(600, 400, "Capanga", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        // Botão voltar
        this.addBackButton();
    }

    startBattle(enemyName) {
        this.playBattleMusic();
        this.showDialog(`Você encontrou um ${enemyName}! Prepare-se para o combate!`);
        // Simular combate (pode ser um mini-game futuro)
        this.time.delayedCall(3000, () => {
            this.showDialog(`Você derrotou o ${enemyName} e encontrou uma chave!`);
            this.stopBattleMusic();
            this.keys++;
            this.keysText.setText(`Chaves: ${this.keys}/5`);
            this.addItemToInventory({ id: `key${this.keys}`, name: `Chave ${this.keys}`, textureKey: 'key_item' });
            
            if (this.keys >= 5) {
                this.showDialog("Você coletou todas as chaves! Agora pode enfrentar o Sr. F.!");
            }
        });
    }

    setupSala1BInteractions() {
        // Experimento científico
        const scienceExperiment = this.add.rectangle(400, 250, 200, 100, 0x0000FF, 0.5)
            .setInteractive()
            .on("pointerdown", () => this.solveScienceExperiment());

        this.add.text(400, 250, "Experimento\nCientífico", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        // Capanga (inimigo)
        const capanga = this.add.rectangle(600, 400, 100, 100, 0x8B0000, 0.7)
            .setInteractive()
            .on("pointerdown", () => this.startBattle("Capanga da Ciência"));

        this.add.text(600, 400, "Capanga", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        // Botão voltar
        this.addBackButton();
    }

    addBackButton() {
        const backButton = this.add.rectangle(100, 550, 120, 40, 0x666666)
            .setInteractive()
            .on('pointerdown', () => {
                this.loadRoom('patio');
                this.showDialog("Você voltou ao pátio.");
            });

        this.add.text(100, 550, 'VOLTAR', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }

    solveMathPuzzle() {
        // Simular resolução de enigma
        this.showDialog("Você resolveu o enigma matemático! Encontrou uma chave!");
        this.keys++;
        this.keysText.setText(`Chaves: ${this.keys}/5`);
        
        if (this.keys >= 5) {
            this.showDialog("Você coletou todas as chaves! Agora pode enfrentar o Sr. F.!");
        }
    }

    solveScienceExperiment() {
        // Simular resolução de experimento
        this.showDialog("Você completou o experimento científico! Encontrou uma chave!");
        this.keys++;
        this.keysText.setText(`Chaves: ${this.keys}/5`);
        
        if (this.keys >= 5) {
            this.showDialog("Você coletou todas as chaves! Agora pode enfrentar o Sr. F.!");
        }
    }
}

// Configuração do jogo
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2c3e50',
    scene: [TitleScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Inicializar o jogo
const game = new Phaser.Game(config);



    setupCozinhaInteractions() {
        this.showDialog("Você está na Cozinha. Cheira a comida deliciosa!");
        // Enigma da Cozinha
        const enigmaCozinha = this.add.rectangle(400, 250, 200, 100, 0x8B4513, 0.5)
            .setInteractive()
            .on("pointerdown", () => this.solveCozinhaPuzzle());
        this.add.text(400, 250, "Enigma\nCulinário", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        // Capanga da Cozinha
        const capangaCozinha = this.add.rectangle(600, 400, 100, 100, 0x8B0000, 0.7)
            .setInteractive()
            .on("pointerdown", () => this.startBattle("Capanga da Cozinha"));
        this.add.text(600, 400, "Capanga", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        this.addBackButton();
    }

    solveCozinhaPuzzle() {
        this.showDialog("Você resolveu o enigma culinário! Encontrou uma chave!");
        this.keys++;
        this.keysText.setText(`Chaves: ${this.keys}/5`);
        
        if (this.keys >= 5) {
            this.showDialog("Você coletou todas as chaves! Agora pode enfrentar o Sr. F.!");
        }
    }

    setupAreaVerdeInteractions() {
        this.showDialog("Você está na Área Verde. Que ar puro!");
        // Enigma da Área Verde
        const enigmaAreaVerde = this.add.rectangle(400, 250, 200, 100, 0x228B22, 0.5)
            .setInteractive()
            .on("pointerdown", () => this.solveAreaVerdePuzzle());
        this.add.text(400, 250, "Enigma\nBotânico", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        // Capanga da Área Verde
        const capangaAreaVerde = this.add.rectangle(600, 400, 100, 100, 0x8B0000, 0.7)
            .setInteractive()
            .on("pointerdown", () => this.startBattle("Capanga da Área Verde"));
        this.add.text(600, 400, "Capanga", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        this.addBackButton();
    }

    solveAreaVerdePuzzle() {
        this.showDialog("Você resolveu o enigma botânico! Encontrou uma chave!");
        this.keys++;
        this.keysText.setText(`Chaves: ${this.keys}/5`);
        
        if (this.keys >= 5) {
            this.showDialog("Você coletou todas as chaves! Agora pode enfrentar o Sr. F.!");
        }
    }

    setupCoordenacaoInteractions() {
        this.showDialog("Você está na Coordenação. Silêncio, por favor!");
        // Enigma da Coordenação
        const enigmaCoordenacao = this.add.rectangle(400, 250, 200, 100, 0x800080, 0.5)
            .setInteractive()
            .on("pointerdown", () => this.solveCoordenacaoPuzzle());
        this.add.text(400, 250, "Enigma\nAdministrativo", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        // Capanga da Coordenação
        const capangaCoordenacao = this.add.rectangle(600, 400, 100, 100, 0x8B0000, 0.7)
            .setInteractive()
            .on("pointerdown", () => this.startBattle("Capanga da Coordenação"));
        this.add.text(600, 400, "Capanga", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        this.addBackButton();
    }

    solveCoordenacaoPuzzle() {
        this.showDialog("Você resolveu o enigma administrativo! Encontrou uma chave!");
        this.keys++;
        this.keysText.setText(`Chaves: ${this.keys}/5`);
        
        if (this.keys >= 5) {
            this.showDialog("Você coletou todas as chaves! Agora pode enfrentar o Sr. F.!");
        }
    }

    setupSecretariaInteractions() {
        this.showDialog("Você está na Secretaria. Precisa de algo?");
        // Enigma da Secretaria
        const enigmaSecretaria = this.add.rectangle(400, 250, 200, 100, 0x4682B4, 0.5)
            .setInteractive()
            .on("pointerdown", () => this.solveSecretariaPuzzle());
        this.add.text(400, 250, "Enigma\nBurocrático", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        // Capanga da Secretaria
        const capangaSecretaria = this.add.rectangle(600, 400, 100, 100, 0x8B0000, 0.7)
            .setInteractive()
            .on("pointerdown", () => this.startBattle("Capanga da Secretaria"));
        this.add.text(600, 400, "Capanga", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        this.addBackButton();
    }

    solveSecretariaPuzzle() {
        this.showDialog("Você resolveu o enigma burocrático! Encontrou uma chave!");
        this.keys++;
        this.keysText.setText(`Chaves: ${this.keys}/5`);
        
        if (this.keys >= 5) {
            this.showDialog("Você coletou todas as chaves! Agora pode enfrentar o Sr. F.!");
        }
    }

    setupSalaProfessoresInteractions() {
        this.showDialog("Você está na Sala dos Professores. Cuidado para não atrapalhar!");
        // Enigma da Sala dos Professores
        const enigmaProfessores = this.add.rectangle(400, 250, 200, 100, 0xDAA520, 0.5)
            .setInteractive()
            .on("pointerdown", () => this.solveProfessoresPuzzle());
        this.add.text(400, 250, "Enigma\nPedagógico", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        // Capanga da Sala dos Professores
        const capangaProfessores = this.add.rectangle(600, 400, 100, 100, 0x8B0000, 0.7)
            .setInteractive()
            .on("pointerdown", () => this.startBattle("Capanga da Sala dos Professores"));
        this.add.text(600, 400, "Capanga", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        this.addBackButton();
    }

    solveProfessoresPuzzle() {
        this.showDialog("Você resolveu o enigma pedagógico! Encontrou uma chave!");
        this.keys++;
        this.keysText.setText(`Chaves: ${this.keys}/5`);
        
        if (this.keys >= 5) {
            this.showDialog("Você coletou todas as chaves! Agora pode enfrentar o Sr. F.!");
        }
    }

    setupDirecaoInteractions() {
        this.showDialog("Você está na Direção. Ambiente sério aqui!");
        // Enigma da Direção
        const enigmaDirecao = this.add.rectangle(400, 250, 200, 100, 0x808080, 0.5)
            .setInteractive()
            .on("pointerdown", () => this.solveDirecaoPuzzle());
        this.add.text(400, 250, "Enigma\nDiretivo", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        // Capanga da Direção
        const capangaDirecao = this.add.rectangle(600, 400, 100, 100, 0x8B0000, 0.7)
            .setInteractive()
            .on("pointerdown", () => this.startBattle("Capanga da Direção"));
        this.add.text(600, 400, "Capanga", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        this.addBackButton();
    }

    solveDirecaoPuzzle() {
        this.showDialog("Você resolveu o enigma diretivo! Encontrou uma chave!");
        this.keys++;
        this.keysText.setText(`Chaves: ${this.keys}/5`);
        
        if (this.keys >= 5) {
            this.showDialog("Você coletou todas as chaves! Agora pode enfrentar o Sr. F.!");
        }
    }

    setupWCInteractions() {
        this.showDialog("Você está no WC. Mantenha a higiene!");
        // Enigma do WC
        const enigmaWC = this.add.rectangle(400, 250, 200, 100, 0xADD8E6, 0.5)
            .setInteractive()
            .on("pointerdown", () => this.solveWCPuzzle());
        this.add.text(400, 250, "Enigma\nHigiênico", { 
            fontSize: "16px", 
            fill: "#333",
            align: "center"
        }).setOrigin(0.5);

        // Capanga do WC
        const capangaWC = this.add.rectangle(600, 400, 100, 100, 0x8B0000, 0.7)
            .setInteractive()
            .on("pointerdown", () => this.startBattle("Capanga do WC"));
        this.add.text(600, 400, "Capanga", { 
            fontSize: "16px", 
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        this.addBackButton();
    }

    solveWCPuzzle() {
        this.showDialog("Você resolveu o enigma higiênico! Encontrou uma chave!");
        this.keys++;
        this.keysText.setText(`Chaves: ${this.keys}/5`);
        
        if (this.keys >= 5) {
            this.showDialog("Você coletou todas as chaves! Agora pode enfrentar o Sr. F.!");
        }
    } }

    addBackButton() {
        const backButton = this.add.rectangle(100, 550, 120, 40, 0x666666)
            .setInteractive()
            .on("pointerdown", () => {
                this.loadRoom("patio");
                this.showDialog("Você voltou ao pátio.");
            });

        this.add.text(100, 550, "VOLTAR", {
            fontSize: "16px",
            fill: "#ffffff",
            fontFamily: "Arial"
        }).setOrigin(0.5);
    }

    solveMathPuzzle() {
        // Simular resolução de enigma
        this.showDialog("Você resolveu o enigma matemático! Encontrou uma chave!");
        this.keys++;
        this.keysText.setText(`Chaves: ${this.keys}/5`);
        
        if (this.keys >= 5) {
            this.showDialog("Você coletou todas as chaves! Agora pode enfrentar o Sr. F.!");
        }
    }

    solveScienceExperiment() {
        // Simular resolução de experimento
        this.showDialog("Você completou o experimento científico! Encontrou uma chave!");
        this.keys++;
        this.keysText.setText(`Chaves: ${this.keys}/5`);
        
        if (this.keys >= 5) {
            this.showDialog("Você coletou todas as chaves! Agora pode enfrentar o Sr. F.!");
        }
    }

}

// Configuração do jogo
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#2c3e50",
    scene: [TitleScene, GameScene],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Inicializar o jogo
const game = new Phaser.Game(config);



    solveFinalPuzzle() {
        this.showDialog("O Sr. F. lançou o puzzle final! Resolva-o para sobrecarregar o laboratório!");
        // Lógica do puzzle final (multi-área)
        // Por enquanto, uma simulação simples
        this.time.delayedCall(5000, () => {
            this.showDialog("Você resolveu o puzzle final! O laboratório do Sr. F. está sobrecarregado!");
            this.endGame(true);
        });
    }

    endGame(win) {
        if (win) {
            this.showDialog("Parabéns! Você resgatou o Mini M. e salvou a Escola Mariotto!");
            // Redirecionar para uma tela de vitória ou reiniciar o jogo
            this.time.delayedCall(5000, () => {
                this.scene.start("TitleScene");
            });
        } else {
            this.showDialog("Game Over! O Sr. F. te pegou. Tente novamente!");
            // Redirecionar para uma tela de derrota ou reiniciar o jogo
            this.time.delayedCall(5000, () => {
                this.scene.start("TitleScene");
            });
        }
    }


