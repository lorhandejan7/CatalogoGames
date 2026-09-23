
const gamesData = [
    {
        id: 1,
        title: "God of War Ragnarök",
        platform: "ps",
        platformName: "PlayStation 5",
        price: 249.90,
        condition: "Lacre de Fábrica",
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600",
        discCondition: "Perfeito (10/10)",
        caseCondition: "Lacrado",
        manual: "Não possui (Edição Padrão)",
        description: "Mídia física original lacrada de fábrica para PlayStation 5. Acompanha encarte original sem detalhes."
    },
    {
        id: 2,
        title: "Halo Infinite",
        platform: "xbox",
        platformName: "Xbox Series X",
        price: 139.90,
        condition: "Excelente Estado",
        image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=600",
        discCondition: "Sem riscos (9.5/10)",
        caseCondition: "Original sem trincos",
        manual: "Folheto promocional incluído",
        description: "Jogo seminovo em estado impecável. Mídia testada e higienizada. Funciona no Xbox One e Series X via Smart Delivery."
    },
    {
        id: 3,
        title: "The Last of Us Part II",
        platform: "ps",
        platformName: "PlayStation 4",
        price: 119.00,
        condition: "Bom Estado",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600",
        discCondition: "Com micro-riscos superficiais (8/10)",
        caseCondition: "Marcas leves de uso",
        manual: "Completo com Panfletos",
        description: "Edição em 2 discos (Disco de Dados e Disco de Jogo). Mídia 100% funcional sem travamentos."
    },
    {
        id: 4,
        title: "Forza Horizon 5",
        platform: "xbox",
        platformName: "Xbox One / Series X",
        price: 199.90,
        condition: "Lacre de Fábrica",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600",
        discCondition: "Perfeito (10/10)",
        caseCondition: "Lacrado",
        manual: "Não possui",
        description: "Produto totalmente novo. Mídia física steelbook/capa padrão em estoque limitado."
    },
    {
        id: 5,
        title: "Demon's Souls",
        platform: "ps",
        platformName: "PlayStation 5",
        price: 179.50,
        condition: "Excelente Estado",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600",
        discCondition: "Limpíssimo (10/10)",
        caseCondition: "Excelente estado de conservação",
        manual: "Não acompanha",
        description: "Um dos títulos de lançamento do PS5 em física impecável. Item de colecionador."
    },
    {
        id: 6,
        title: "Gears 5",
        platform: "xbox",
        platformName: "Xbox One",
        price: 69.90,
        condition: "Bom Estado",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=600",
        discCondition: "Mídia testada (8.5/10)",
        caseCondition: "Pequena trinca na parte superior traseira",
        manual: "Incluso",
        description: "Ótimo custo beneficio para os fãs de ação no Xbox. Mídia rodando perfeitamente."
    }
];

// Estado da Aplicação
let activePlatform = 'all';
let searchQuery = '';
let selectedCondition = 'all';
let selectedSort = 'default';
let cart = [];

// Elementos DOM
const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const platformFilters = document.getElementById('platformFilters');
const conditionFilter = document.getElementById('conditionFilter');
const sortFilter = document.getElementById('sortFilter');
const noResults = document.getElementById('noResults');

// Elementos do Modal
const gameModal = document.getElementById('gameModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

// Elementos do Carrinho
const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotalValue = document.getElementById('cartTotalValue');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    setupEventListeners();
});

// Configuração dos Eventos
function setupEventListeners() {
    // Busca
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderCatalog();
    });

    // Filtro por Plataforma
    platformFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('#platformFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            activePlatform = e.target.getAttribute('data-platform');
            renderCatalog();
        }
    });

    // Filtro por Condição
    conditionFilter.addEventListener('change', (e) => {
        selectedCondition = e.target.value;
        renderCatalog();
    });

    // Ordenação
    sortFilter.addEventListener('change', (e) => {
        selectedSort = e.target.value;
        renderCatalog();
    });

    // Modal
    modalClose.addEventListener('click', closeModal);
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) closeModal();
    });

    // Carrinho Sidebar
    cartToggle.addEventListener('click', () => cartSidebar.classList.add('open'));
    cartClose.addEventListener('click', () => cartSidebar.classList.remove('open'));
}

// Lógica do Filtro e Renderização
function renderCatalog() {
    let filtered = gamesData.filter(game => {
        const matchesPlatform = activePlatform === 'all' || game.platform === activePlatform;
        const matchesSearch = game.title.toLowerCase().includes(searchQuery);
        const matchesCondition = selectedCondition === 'all' || game.condition === selectedCondition;
        return matchesPlatform && matchesSearch && matchesCondition;
    });

    // Aplicar Ordenação
    if (selectedSort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'title-asc') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Render na Tela
    gamesGrid.innerHTML = '';

    if (filtered.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        filtered.forEach(game => {
            const card = document.createElement('div');
            card.className = `game-card platform-${game.platform}`;
            card.innerHTML = `
                <div class="card-banner">
                    <img src="${game.image}" alt="${game.title}">
                    <span class="platform-badge badge-${game.platform}">${game.platformName}</span>
                    <span class="condition-badge">${game.condition}</span>
                </div>
                <div class="card-info">
                    <h4 class="game-title">${game.title}</h4>
                    <div class="media-specs">
                        <span class="spec-tag"><i class="fa-solid fa-compact-disc"></i> Disco: ${game.discCondition.split(' ')[0]}</span>
                    </div>
                    <div class="card-bottom">
                        <span class="price">R$ ${game.price.toFixed(2).replace('.', ',')}</span>
                        <div class="card-actions">
                            <button class="btn-icon" onclick="openModal(${game.id})" title="Detalhes da Mídia">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                            <button class="btn-add" onclick="addToCart(${game.id})">
                                + Carrinho
                            </button>
                        </div>
                    </div>
                </div>
            `;
            gamesGrid.appendChild(card);
        });
    }
}


function openModal(id) {
    const game = gamesData.find(g => g.id === id);
    if (!game) return;

    modalBody.innerHTML = `
        <img class="modal-img" src="${game.image}" alt="${game.title}">
        <div class="modal-details">
            <h2>${game.title}</h2>
            <p>${game.description}</p>
            
            <div class="physical-status">
                <h4><i class="fa-solid fa-clipboard-check"></i> Avaliação do Estado Físico</h4>
                <div class="status-item">
                    <strong>Mídia / Disco:</strong>
                    <span>${game.discCondition}</span>
                </div>
                <div class="status-item">
                    <strong>Capa / Estojo:</strong>
                    <span>${game.caseCondition}</span>
                </div>
                <div class="status-item">
                    <strong>Encarte / Manual:</strong>
                    <span>${game.manual}</span>
                </div>
            </div>

            <div class="card-bottom">
                <span class="price">R$ ${game.price.toFixed(2).replace('.', ',')}</span>
                <button class="btn-add" onclick="addToCart(${game.id}); closeModal();">Adicionar ao Carrinho</button>
            </div>
        </div>
    `;

    gameModal.classList.add('active');
}

function closeModal() {
    gameModal.classList.remove('active');
}


function addToCart(id) {
    const game = gamesData.find(g => g.id === id);
    if (!game) return;

    cart.push(game);
    updateCart();
    cartSidebar.classList.add('open');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    cartCount.innerText = cart.length;
    cartItemsContainer.innerHTML = '';
    
    let total = 0;

    cart.forEach((game, index) => {
        total += game.price;
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <img src="${game.image}" alt="${game.title}">
            <div class="cart-item-info">
                <h5>${game.title}</h5>
                <span>R$ ${game.price.toFixed(2).replace('.', ',')}</span>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(item);
    });

    cartTotalValue.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}