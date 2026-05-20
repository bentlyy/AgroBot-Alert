const axios = require('axios');
const fs = require('fs');
const logToFile = require('./logToFile');

async function makeHttpRequest(url, params) {
  params.sid = process.env.API_TOKEN;
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    logToFile('Error:' + error);
    throw new Error('Error en la solicitud HTTP');
  }
}

function getEidFromResponse(response) {
  return response.eid;
}

async function searchUnits(eid) {
  const params = {
    svc: 'core/search_items',
    params: JSON.stringify({
      spec: {
        itemsType: 'avl_unit',
        propName: 'sys_name',
        propValueMask: '*',
        sortType: 'sys_name'
      },
      force: 1,
      flags: 1439,
      from: 0,
      to: 0
    }),
    sid: eid
  };
  return makeHttpRequest('https://hst-api.wialon.us/wialon/ajax.html', params);
}

async function loadMessages(eid, unitId) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const todayUnixTimestamp = Math.floor(today.getTime() / 1000);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const yesterdayUnixTimestamp = Math.floor(yesterday.getTime() / 1000);

  const params = {
    svc: 'messages/load_interval',
    params: JSON.stringify({
      itemId: unitId,
      timeFrom: yesterdayUnixTimestamp,
      timeTo: todayUnixTimestamp,
      flags: 1,
      flagsMask: 65281,
      loadCount: 6
    }),
    sid: eid
  };

  try {
    const response = await makeHttpRequest('https://hst-api.wialon.us/wialon/ajax.html', params);
    logToFile("Mensajes cargados para la unidad " + unitId);
    const formattedMessages = response.messages.map(message => ({
      Timestamp: message.t,
      Flags: message.f,
      Type: message.tp,
      Position: {
        Latitude: message.pos.y,
        Longitude: message.pos.x,
        Altitude: message.pos.z,
        Speed: message.pos.s,
        Course: message.pos.c,
        Satellites: message.pos.sc
      },
      IO: message.i,
      Output: message.o,
      LastChanged: message.lc,
      Route: message.rt,
      Parameters: {
        Temperature_S1: message.p.user_2u_1,
        Temperature_S2: message.p.user_2u_2,
        Humidity_S1: message.p.user_2u_3,
        Humidity_S2: message.p.user_2u_4,
        Electroconductivity_S1: message.p.user_2u_5,
        Electroconductivity_S2: message.p.user_2u_6,
        GPS_Energy: message.p.pwr_int,
        External_Energy: message.p.pwr_ext
      }
    }));
    return formattedMessages;
  } catch (error) {
    logToFile('Error al cargar mensajes:' + error);
    throw new Error('Error al cargar mensajes');
  }
}

module.exports = {
  makeHttpRequest,
  getEidFromResponse,
  searchUnits,
  loadMessages,
  logToFile
};
