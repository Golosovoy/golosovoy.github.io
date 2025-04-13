document.addEventListener('DOMContentLoaded', function() {
    // Map data for each island
    const maps = {
        melvendil: {
            surface: generateMelvendilSurface(),
            dungeon1: generateMelvendilDungeon1(),
            dungeon2: generateMelvendilDungeon2()
        },
        langasard: {
            surface: generateLangasardSurface(),
            dungeon1: generateLangasardDungeon1(),
            dungeon2: generateLangasardDungeon2()
        },
        moraktar: {
            surface: generateMoraktarSurface(),
            dungeon1: generateMoraktarDungeon1(),
            dungeon2: generateMoraktarDungeon2()
        },
        godgorat: {
            surface: generateGodgoratSurface(),
            dungeon1: generateGodgoratDungeon1(),
            dungeon2: generateGodgoratDungeon2()
        }
    };
    
    let currentIsland = 'melvendil';
    let currentLayer = 'dungeon1';
    let isDragging = false;
    let startX, startY;
    let scrollLeft, scrollTop;
    
    // Initialize the first map
    renderMap(currentIsland, currentLayer);
    
    // Island selection
    document.querySelectorAll('.island-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.island-btn.active').classList.remove('active');
            this.classList.add('active');
            currentIsland = this.dataset.island;
            
            // Hide all maps
            document.querySelectorAll('.map').forEach(map => {
                map.style.display = 'none';
            });
            
            // Show selected map
            document.getElementById(`${currentIsland}-map`).style.display = 'block';
            
            // Render the map with current layer
            renderMap(currentIsland, currentLayer);
        });
    });
    
    // Layer selection
    document.querySelectorAll('.layer-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.layer-btn.active').classList.remove('active');
            this.classList.add('active');
            currentLayer = this.dataset.layer;
            
            // Re-render map with new layer
            renderMap(currentIsland, currentLayer);
        });
    });
    
    // Touch and drag events for map navigation
    const mapContainer = document.querySelector('.map-container');
    
    mapContainer.addEventListener('mousedown', startDrag);
    mapContainer.addEventListener('touchstart', startDrag);
    
    mapContainer.addEventListener('mousemove', drag);
    mapContainer.addEventListener('touchmove', drag);
    
    mapContainer.addEventListener('mouseup', endDrag);
    mapContainer.addEventListener('mouseleave', endDrag);
    mapContainer.addEventListener('touchend', endDrag);
    
    function startDrag(e) {
        isDragging = true;
        
        if (e.type === 'mousedown') {
            startX = e.pageX - mapContainer.offsetLeft;
            startY = e.pageY - mapContainer.offsetTop;
        } else {
            startX = e.touches[0].pageX - mapContainer.offsetLeft;
            startY = e.touches[0].pageY - mapContainer.offsetTop;
        }
        
        scrollLeft = mapContainer.scrollLeft;
        scrollTop = mapContainer.scrollTop;
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        let x, y;
        
        if (e.type === 'mousemove') {
            x = e.pageX - mapContainer.offsetLeft;
            y = e.pageY - mapContainer.offsetTop;
        } else {
            x = e.touches[0].pageX - mapContainer.offsetLeft;
            y = e.touches[0].pageY - mapContainer.offsetTop;
        }
        
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        
        mapContainer.scrollLeft = scrollLeft - walkX;
        mapContainer.scrollTop = scrollTop - walkY;
    }
    
    function endDrag() {
        isDragging = false;
    }
    
    // Zoom functionality
    let scale = 1;
    const zoomIntensity = 0.1;
    
    mapContainer.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const rect = mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const wheel = e.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * zoomIntensity);
        
        // Apply zoom
        scale *= zoom;
        scale = Math.min(Math.max(1, scale), 4);
        
        const currentMap = document.getElementById(`${currentIsland}-map`);
        currentMap.style.transform = `scale(${scale})`;
        currentMap.style.transformOrigin = `${mouseX}px ${mouseY}px`;
    });
    
    // Render map function
    function renderMap(island, layer) {
        const mapElement = document.getElementById(`${island}-map`);
        mapElement.innerHTML = '';
        
        const mapData = maps[island][layer];
        
        mapData.tiles.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.className = `tile ${tile.type}`;
            tileElement.style.left = `${tile.x * 65}px`;
            tileElement.style.top = `${tile.y * 65}px`;
            tileElement.textContent = tile.name;
            
            tileElement.addEventListener('click', function() {
                showLocationInfo(tile.name, tile.description);
            });
            
            mapElement.appendChild(tileElement);
        });
        
        // Center the map in the container
        mapElement.style.width = `${mapData.width * 65}px`;
        mapElement.style.height = `${mapData.height * 65}px`;
        mapContainer.scrollLeft = (mapData.width * 65 - mapContainer.clientWidth) / 2;
        mapContainer.scrollTop = (mapData.height * 65 - mapContainer.clientHeight) / 2;
    }
    
    function showLocationInfo(name, description) {
        const infoElement = document.getElementById('location-info');
        document.getElementById('location-name').textContent = name;
        document.getElementById('location-description').textContent = description;
        infoElement.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            infoElement.style.display = 'none';
        }, 5000);
    }
    
    // Map generation functions
    function generateMelvendilSurface() {
        const tiles = [];
        const width = 20;
        const height = 15;
        
        // Generate grass tiles
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tiles.push({
                    x, y,
                    type: 'grass',
                    name: 'Wilderness',
                    description: 'Open fields of Melvendil'
                });
            }
        }
        
        // Add special locations
        tiles.push(
            {x: 5, y: 5, type: 'town', name: 'Melvendil Town', description: 'Main town of the island'},
            {x: 12, y: 3, type: 'mountain', name: 'Elders Peak', description: 'Mountainous area with tough enemies'},
            {x: 8, y: 10, type: 'dungeon', name: 'Ancient Crypt', description: 'Entrance to the first dungeon level'}
        );
        
        return { tiles, width, height };
    }
    
    function generateMelvendilDungeon1() {
        const tiles = [];
        const width = 15;
        const height = 15;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tiles.push({
                    x, y,
                    type: 'dungeon',
                    name: 'Dungeon Corridor',
                    description: 'Dark corridors of the Ancient Crypt'
                });
            }
        }
        
        // Add special dungeon locations
        tiles.push(
            {x: 3, y: 3, type: 'dungeon', name: 'Treasure Room', description: 'Contains valuable loot'},
            {x: 12, y: 12, type: 'dungeon', name: 'Boss Chamber', description: 'Home to the dungeon boss'},
            {x: 7, y: 7, type: 'dungeon', name: 'Dungeon Exit', description: 'Leads back to the surface'}
        );
        
        return { tiles, width, height };
    }
    
    function generateMelvendilDungeon2() {
        const tiles = [];
        const width = 12;
        const height = 12;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tiles.push({
                    x, y,
                    type: 'dungeon',
                    name: 'Lower Dungeon',
                    description: 'Deeper, more dangerous part of the crypt'
                });
            }
        }
        
        tiles.push(
            {x: 5, y: 5, type: 'dungeon', name: 'Ancient Chamber', description: 'Contains rare artifacts'},
            {x: 10, y: 2, type: 'dungeon', name: 'Final Boss', description: 'The most powerful enemy in the dungeon'}
        );
        
        return { tiles, width, height };
    }
    
    // Similar generation functions for other islands...
    function generateLangasardSurface() {
        const tiles = [];
        const width = 18;
        const height = 18;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tiles.push({
                    x, y,
                    type: Math.random() > 0.7 ? 'mountain' : 'grass',
                    name: 'Wilderness',
                    description: 'Rugged terrain of Langasard'
                });
            }
        }
        
        tiles.push(
            {x: 9, y: 9, type: 'town', name: 'Langasard Village', description: 'Main settlement of the island'},
            {x: 3, y: 15, type: 'water', name: 'Frozen Lake', description: 'Icy waters of the north'}
        );
        
        return { tiles, width, height };
    }
    
    function generateLangasardDungeon1() {
        const tiles = [];
        const width = 16;
        const height = 16;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tiles.push({
                    x, y,
                    type: 'dungeon',
                    name: 'Ice Caverns',
                    description: 'Frozen dungeon corridors'
                });
            }
        }
        
        tiles.push(
            {x: 5, y: 5, type: 'dungeon', name: 'Frozen Throne', description: 'Ancient seat of power'},
            {x: 12, y: 3, type: 'dungeon', name: 'Ice Golem Lair', description: 'Home to powerful ice creatures'}
        );
        
        return { tiles, width, height };
    }
    
    function generateLangasardDungeon2() {
        const tiles = [];
        const width = 14;
        const height = 14;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tiles.push({
                    x, y,
                    type: 'dungeon',
                    name: 'Deep Caverns',
                    description: 'Colder and more dangerous than above'
                });
            }
        }
        
        tiles.push(
            {x: 7, y: 7, type: 'dungeon', name: 'Heart of Winter', description: 'Source of the island\'s cold'},
            {x: 2, y: 12, type: 'dungeon', name: 'Ancient Ice Dragon', description: 'Legendary frozen beast'}
        );
        
        return { tiles, width, height };
    }
    
    function generateMoraktarSurface() {
        const tiles = [];
        const width = 22;
        const height = 18;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tiles.push({
                    x, y,
                    type: Math.random() > 0.6 ? 'mountain' : 'grass',
                    name: 'Wilderness',
                    description: 'Harsh lands of Moraktar'
                });
            }
        }
        
        tiles.push(
            {x: 11, y: 9, type: 'town', name: 'Moraktar Stronghold', description: 'Fortified settlement'},
            {x: 18, y: 5, type: 'dungeon', name: 'Volcanic Entrance', description: 'Leads to fiery depths'}
        );
        
        return { tiles, width, height };
    }
    
    function generateMoraktarDungeon1() {
        const tiles = [];
        const width = 18;
        const height = 18;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tiles.push({
                    x, y,
                    type: 'dungeon',
                    name: 'Volcanic Tunnels',
                    description: 'Hot and dangerous passages'
                });
            }
        }
        
        tiles.push(
            {x: 9, y: 9, type: 'dungeon', name: 'Lava Chamber', description: 'Central molten area'},
            {x: 3, y: 15, type: 'dungeon', name: 'Fire Giant Hall', description: 'Home to fire giants'}
        );
        
        return { tiles, width, height };
    }
    
    function generateMoraktarDungeon2() {
        const tiles = [];
        const width = 16;
        const height = 16;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tiles.push({
                    x, y,
                    type: 'dungeon',
                    name: 'Magma Core',
                    description: 'Near the volcano\'s heart'
                });
            }
        }
        
        tiles.push(
            {x: 8, y: 8, type: 'dungeon', name: 'Molten Throne', description: 'Seat of the Fire Lord'},
            {x: 14, y: 2, type: 'dungeon', name: 'Treasure Vault', description: 'Guarded by fire elementals'}
        );
        
        return { tiles, width, height };
    }
    
    function generateGodgoratSurface() {
        const tiles = [];
        const width = 20;
        const height = 20;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tiles.push({
                    x, y,
                    type: Math.random() > 0.8 ? 'water' : 'grass',
                    name: 'Wilderness',
                    description: 'Lush lands of Godgorat'
                });
            }
        }
        
        tiles.push(
            {x: 10, y: 10, type: 'town', name: 'Godgorat City', description: 'Capital of the island'},
            {x: 5, y: 5, type: 'dungeon', name: 'Sunken Temple', description: 'Entrance to ancient ruins'}
        );
        
        return { tiles, width, height };
    }
    
    function generateGodgoratDungeon1() {
        const tiles = [];
        const width = 18;
        const height = 18;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tiles.push({
                    x, y,
                    type: 'dungeon',
                    name: 'Ancient Halls',
                    description: 'Ruined temple corridors'
                });
            }
        }
        
        tiles.push(
            {x: 9, y: 9, type: 'dungeon', name: 'Main Chamber', description: 'Central temple area'},
            {x: 3, y: 15, type: 'dungeon', name: 'Guardian Room', description: 'Protected by ancient constructs'}
        );
        
        return { tiles, width, height };
    }
    
    function generateGodgoratDungeon2() {
        const tiles = [];
        const width = 16;
        const height = 16;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                tiles.push({
                    x, y,
                    type: 'dungeon',
                    name: 'Lower Temple',
                    description: 'Sacred underground chambers'
                });
            }
        }
        
        tiles.push(
            {x: 8, y: 8, type: 'dungeon', name: 'Inner Sanctum', description: 'Most sacred area'},
            {x: 14, y: 2, type: 'dungeon', name: 'Treasure Room', description: 'Contains temple relics'}
        );
        
        return { tiles, width, height };
    }
});