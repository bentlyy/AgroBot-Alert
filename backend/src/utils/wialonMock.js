/**
 * Mock de Wialon API para desarrollo sin conexión a Wialon.
 * Genera datos falsos pero realistas para probar el sistema.
 */

const UNITS = [
  { id: 1001, name: 'Estación Central', lat: -33.456789, lng: -70.650000 },
  { id: 1002, name: 'Tractor 01 - Sur', lat: -33.500000, lng: -70.620000 },
  { id: 1003, name: 'Estación Norte', lat: -33.400000, lng: -70.700000 },
  { id: 1004, name: 'Tractor 02 - Este', lat: -33.480000, lng: -70.580000 },
  { id: 1005, name: 'Estación Oeste', lat: -33.520000, lng: -70.720000 },
];

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateSensorData() {
  return {
    user_2u_1: randomBetween(15, 40),   // Temperature_S1
    user_2u_2: randomBetween(14, 39),   // Temperature_S2
    user_2u_3: randomBetween(20, 95),   // Humidity_S1
    user_2u_4: randomBetween(20, 95),   // Humidity_S2
    user_2u_5: randomBetween(0.5, 2.5), // Electroconductivity_S1
    user_2u_6: randomBetween(0.5, 2.5), // Electroconductivity_S2
    pwr_int: randomBetween(2.0, 5.0),   // GPS_Energy
    pwr_ext: randomBetween(3.0, 5.0),   // External_Energy
  };
}

function generatePosition(unit) {
  return {
    y: unit.lat + (Math.random() - 0.5) * 0.01,
    x: unit.lng + (Math.random() - 0.5) * 0.01,
    z: randomBetween(100, 500),
    s: randomBetween(0, 60),
    c: randomBetween(0, 359),
    sc: Math.floor(randomBetween(4, 12)),
  };
}

const mockApi = {
  async login() {
    return { eid: 'mock-session-id-' + Date.now() };
  },

  async searchUnits() {
    return UNITS.map(u => ({
      id: u.id,
      nm: u.name,
      lat: u.lat,
      lng: u.lng,
    }));
  },

  async loadMessages(unitId) {
    const unit = UNITS.find(u => u.id === unitId) || UNITS[0];
    const now = Math.floor(Date.now() / 1000);
    const messages = [];

    for (let i = 0; i < 6; i++) {
      messages.push({
        t: now - i * 3600,
        tp: 'unit_status',
        pos: generatePosition(unit),
        p: generateSensorData(),
        f: 1,
        o: 0,
        lc: now - i * 3600,
        rt: [],
      });
    }

    return { messages };
  },

  getUnits() {
    return UNITS;
  },
};

module.exports = mockApi;
