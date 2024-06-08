const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

// Crear el archivo de registro
const logStream = fs.createWriteStream('output.log', { flags: 'a' });

// Función para escribir en el archivo de registro
function logToFile(text) {
    logStream.write(text + '\n');
}

// Función para formatear y escribir los mensajes en el archivo de registro
function logMessages(messages) {
    logToFile(JSON.stringify(messages, null, 2));
}

// Función para hacer la solicitud HTTP utilizando Axios
async function makeHttpRequest(url, params) {
    params.sid = process.env.API_TOKEN; // Agregar el token a los parámetros
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        logToFile('Error:' + error);
        throw new Error('Error en la solicitud HTTP');
    }
}

// Función para obtener el EID desde la respuesta
function getEidFromResponse(response) {
    return response.eid;
}

// Función para hacer la solicitud de unidades
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

// Función para cargar mensajes
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
        const formattedMessages = response.messages.map(message => {
            return {
                timestamp: message.t,
                unidadId: unitId,
                parametros: {
                    temperatura1: message.p.user_2u_1,
                    temperatura2: message.p.user_2u_2,
                    humedad1: message.p.user_2u_3,
                    humedad2: message.p.user_2u_4,
                    electroconductividad1: message.p.user_2u_5,
                    electroconductividad2: message.p.user_2u_6,
                    energiaGps: message.p.pwr_int,
                    energiaExterna: message.p.pwr_ext
                }
            };
        });
        logMessages(formattedMessages);
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
    logToFile,
    logMessages
};
