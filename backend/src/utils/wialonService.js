/**
 * Adaptador Wialon: usa API real o mock según configuración.
 *
 * USE_MOCK_API=true  → genera datos ficticios (ideal para desarrollo)
 * USE_MOCK_API=false → usa la API real de Wialon
 */

const realApi = require('./wialonApiUtils');
const mockApi = require('./wialonMock');

const useMock = process.env.USE_MOCK_API === 'true';

const api = useMock ? mockApi : realApi;

if (useMock) {
  console.log('⚠️  Usando MOCK de Wialon — datos simulados');
}

module.exports = api;
