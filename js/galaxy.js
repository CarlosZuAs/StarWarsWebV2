document.addEventListener('DOMContentLoaded', () => {
    const planetModal = new bootstrap.Modal(document.getElementById('planetModal'));
    const planetModalLabel = document.getElementById('planetModalLabel');
    const planetModalBody = document.getElementById('planetModalBody');
    const galaxyMap = document.getElementById('galaxy-map');
  
    // Mapa de nombres de planetas a sus IDs
    const planetNameToId = {
      'tatooine': '1',
      'alderaan': '2',
      'yavin': '3',
      'hoth': '4',
      'dagobah': '5',
      'bespin': '6',
      'endor': '7',
      'naboo': '8',
      'coruscant': '9',
      'kamino': '10',
      'mustafar': '13',
      'geonosis': '11',
      'utapau': '12',
      'mandalore': '14'
    };
  
    // Relaciona el data-planet con el ID de la API de Swapi.tech
    const planetIdMap = {
      1: '1',   // Tatooine
      2: '2',   // Alderaan
      3: '3',   // Yavin IV
      4: '4',   // Hoth
      5: '5',   // Dagobah
      6: '6',   // Bespin
      7: '7',   // Endor
      8: '8',   // Naboo
      9: '9',   // Coruscant
      10: '10', // Kamino
      11: '13', // Mustafar
      12: '11', // Geonosis
      13: '12', // Utapau
      14: '14'  // Mandalore
    };
  
    // Objeto con información adicional de los planetas
    const planetInfo = {
      1: {
          name: 'Tatooine',
          image: 'img/planets/tatooine.jpg',
          description: 'Planeta desértico hogar de Luke Skywalker'
      },
      2: {
          name: 'Alderaan',
          image: 'img/planets/alderaan.jpg',
          description: 'Planeta pacífico destruido por la Estrella de la Muerte'
      },
      3: {
          name: 'Yavin IV',
          image: 'img/planets/yavin.jpg',
          description: 'Luna selvática, base de la Alianza Rebelde'
      },
      4: {
          name: 'Hoth',
          image: 'img/planets/hoth.jpg',
          description: 'Planeta helado, sitio de una importante base rebelde'
      },
      5: {
          name: 'Dagobah',
          image: 'img/planets/dagobah.jpg',
          description: 'Planeta pantanoso donde Yoda se exilió'
      },
      6: {
          name: 'Bespin',
          image: 'img/planets/bespin.jpg',
          description: 'Planeta gaseoso, ubicación de Ciudad Nube'
      },
      7: {
          name: 'Endor',
          image: 'img/planets/endor.jpg',
          description: 'Luna boscosa, hogar de los Ewoks'
      },
      8: {
          name: 'Naboo',
          image: 'img/planets/naboo.jpg',
          description: 'Planeta natal de Padmé Amidala y Palpatine'
      },
      9: {
          name: 'Coruscant',
          image: 'img/planets/coruscant.jpg',
          description: 'Capital de la República Galáctica'
      },
      10: {
          name: 'Kamino',
          image: 'img/planets/kamino.jpg',
          description: 'Planeta oceánico, origen de los clones'
      },
      11: {
          name: 'Mustafar',
          image: 'img/planets/mustafar.jpg',
          description: 'Planeta volcánico donde ocurrió el duelo entre Obi-Wan y Anakin'
      },
      12: {
          name: 'Geonosis',
          image: 'img/planets/geonosis.jpg',
          description: 'Planeta rocoso, sede de las fábricas de droides de la Confederación'
      },
      13: {
          name: 'Utapau',
          image: 'img/planets/utapau.png',
          description: 'Planeta con ciudades construidas en sumideros gigantes'
      },
      14: {
          name: 'Mandalore',
          image: 'img/planets/mandalore.jpg',
          description: 'Planeta natal de los mandalorianos, hogar de una antigua civilización guerrera'
      }
    };
  
    // Objeto para almacenar los intervalos
    const intervals = new Map();
  
    // Posiciones canónicas aproximadas de los planetas en el mapa galáctico (valores entre 0 y 1)
    const planetPositions = {
      'coruscant': { x: 0.52, y: 0.48, region: 'Núcleo' },
      'alderaan':  { x: 0.48, y: 0.44, region: 'Núcleo' },
      'naboo':     { x: 0.60, y: 0.62, region: 'Borde Interior' },
      'tatooine':  { x: 0.18, y: 0.80, region: 'Borde Exterior' },
      'hoth':      { x: 0.10, y: 0.30, region: 'Borde Exterior' },
      'endor':     { x: 0.25, y: 0.55, region: 'Territorios Occidentales' },
      'yavin iv':  { x: 0.35, y: 0.40, region: 'Borde Medio' },
      'dagobah':   { x: 0.70, y: 0.80, region: 'Borde Exterior' },
      'bespin':    { x: 0.40, y: 0.60, region: 'Borde Medio' },
      'kamino':    { x: 0.90, y: 0.90, region: 'Borde Exterior' },
      'mustafar':  { x: 0.65, y: 0.75, region: 'Borde Exterior' },
      'geonosis':  { x: 0.75, y: 0.70, region: 'Borde Exterior' },
      'utapau':    { x: 0.80, y: 0.85, region: 'Borde Exterior' },
      'mandalore': { x: 0.35, y: 0.65, region: 'Borde Exterior' }
    };
  
    // Evitar solapamientos: aplicar un pequeño offset si dos planetas están muy cerca
    function applySeparation(positions) {
      const keys = Object.keys(positions);
      for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
          const a = positions[keys[i]];
          const b = positions[keys[j]];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 0.06) { // Si están demasiado cerca
            // Separar un poco en X
            a.x += 0.02;
            b.x -= 0.02;
          }
        }
      }
    }
    applySeparation(planetPositions);
  
    // Al cargar la página, posicionar los planetas según planetPositions
    document.querySelectorAll('.planet-marker').forEach(btn => {
      const planetName = btn.getAttribute('data-planet-name');
      if (planetPositions[planetName]) {
        btn.style.left = (planetPositions[planetName].x * 100) + '%';
        btn.style.top = (planetPositions[planetName].y * 100) + '%';
        btn.style.transform = 'translate(-50%, -50%)';
      }
    });
  
    // Para restaurar el zoom
    function resetZoom() {
      galaxyMap.style.transform = '';
      galaxyMap.classList.remove('zoomed');
    }
  
    // Cierra el modal y resetea el zoom
    document.getElementById('planetModal').addEventListener('hidden.bs.modal', resetZoom);
  
    document.querySelectorAll('.planet-marker').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        // 1. Calcula la posición del planeta dentro del mapa
        const rect = galaxyMap.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
  
        // Coordenadas relativas al contenedor
        const btnCenterX = btnRect.left - rect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top - rect.top + btnRect.height / 2;
  
        // 2. Calcula el factor de zoom y el desplazamiento para centrar el planeta
        const zoom = 2.2; // Puedes ajustar el nivel de zoom
        const mapWidth = rect.width;
        const mapHeight = rect.height;
  
        // El centro del mapa
        const centerX = mapWidth / 2;
        const centerY = mapHeight / 2;
  
        // Desplazamiento necesario para centrar el planeta
        const offsetX = (centerX - btnCenterX) * zoom;
        const offsetY = (centerY - btnCenterY) * zoom;
  
        // 3. Aplica el zoom y el desplazamiento
        galaxyMap.style.transform = `scale(${zoom}) translate(${offsetX / zoom}px, ${offsetY / zoom}px)`;
        galaxyMap.classList.add('zoomed');
  
        // 4. Espera la animación antes de mostrar el modal
        setTimeout(async () => {
          const planetKey = btn.getAttribute('data-planet');
          const planetId = planetIdMap[planetKey];
          planetModalLabel.textContent = 'Cargando...';
          planetModalBody.innerHTML = '<div class="text-center"><div class="spinner-border text-warning" role="status"></div></div>';
          planetModal.show();
  
          try {
            let planet;
            let planetDetails = planetInfo[planetKey];
            let planetName = planetDetails.name.toLowerCase();

            // Caso especial para Mandalore
            if (planetKey === '14') {
              planet = {
                name: 'Mandalore',
                climate: 'Templado',
                population: '4,000,000',
                terrain: 'Montañoso, Desierto',
                gravity: '1.0 estándar',
                diameter: '7520',
                orbital_period: '366',
                rotation_period: '26',
                surface_water: '5'
              };
            } else {
              const res = await fetch(`https://www.swapi.tech/api/planets/${planetId}`);
              const data = await res.json();
              planet = data.result.properties;
            }
            
            planetModalLabel.innerHTML = `
              <div class="planet-title">
                <div class="normal-text">${planet.name}</div>
                <div class="aurebesh-text">${planet.name}</div>
              </div>
            `;
            planetModalBody.innerHTML = `
              <div class="planet-modal-content">
                <div class="planet-image-container">
                  <img src="${planetDetails.image}" alt="${planet.name}" class="planet-modal-image">
                  <div class="planet-coords-row d-flex justify-content-center align-items-center gap-4 mt-3">
                    <span class="fw-bold text-warning">${planetPositions[planetName]?.region || ''}</span>
                    <span class="small text-light">X: ${(planetPositions[planetName]?.x ?? '?').toFixed(2)}</span>
                    <span class="small text-light">Y: ${(planetPositions[planetName]?.y ?? '?').toFixed(2)}</span>
                  </div>
                </div>
                <div class="planet-info-container">
                  <div class="planet-details">
                    <div class="detail-item">
                      <span class="detail-label">Clima:</span>
                      <span class="detail-value">${planet.climate}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Población:</span>
                      <span class="detail-value">${planet.population}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Terreno:</span>
                      <span class="detail-value">${planet.terrain}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Gravedad:</span>
                      <span class="detail-value">${planet.gravity}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Diámetro:</span>
                      <span class="detail-value">${planet.diameter} km</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Período Orbital:</span>
                      <span class="detail-value">${planet.orbital_period} días</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Período Rotacional:</span>
                      <span class="detail-value">${planet.rotation_period} horas</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Superficie de Agua:</span>
                      <span class="detail-value">${planet.surface_water}%</span>
                    </div>
                  </div>
                </div>
              </div>
            `;
          } catch (err) {
            planetModalLabel.textContent = 'Error';
            planetModalBody.innerHTML = '<div class="alert alert-danger">No se pudieron cargar los datos del planeta.</div>';
          }
        }, 700); // Espera a que termine la animación de zoom
      });
    });
  
    // Función para mostrar la información del planeta
    async function showPlanetInfo(planetId) {
      const planetKey = Object.keys(planetIdMap).find(key => planetIdMap[key] === planetId);
      if (!planetKey) return;
  
      const btn = document.querySelector(`.planet-marker[data-planet="${planetKey}"]`);
      if (!btn) return;
  
      // Simular el clic en el marcador del planeta
      btn.click();
    }
  
    // Verificar parámetros de URL al cargar la página
    const urlParams = new URLSearchParams(window.location.search);
    const planetParam = urlParams.get('planet');
    const sectionParam = urlParams.get('section');
  
    if (planetParam && planetNameToId[planetParam]) {
      const planetId = planetNameToId[planetParam];
      showPlanetInfo(planetId);
    }
  });