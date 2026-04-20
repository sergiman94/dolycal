// Google Apps Script — pega este código en script.google.com
// Implementar > Nueva implementación > Aplicación web
//   · Ejecutar como: Yo  |  Acceso: Cualquier persona
// Copia la URL y pégala en .env como VITE_APPS_SCRIPT_URL

const SHEET_ID = '11viVDp1wJyCD2k4IVkNlG-zCQjR3fP4FkcCxEIH5VXk';
const HEADERS  = ['N° Remisión','Fecha','Destino','Clase Material','Peso (Ton)','Placa','Conductor','Beneficiario','Nombre Despachador','Firma'];

// ── GET: lastNumber o history ────────────────────────────────────────────────
function doGet(e) {
  const action = e && e.parameter && e.parameter.action;

  if (action === 'lastNumber') {
    return handleLastNumber();
  }
  if (action === 'history') {
    const fecha = e.parameter.fecha || today();
    return handleHistory(fecha);
  }

  return json({ status: 'ok', msg: 'Remisiones API activa' });
}

function handleLastNumber() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheets = ss.getSheets();
    let max = 0;
    sheets.forEach(function(sheet) {
      const last = sheet.getLastRow();
      if (last < 2) return; // solo encabezado
      for (var r = 2; r <= last; r++) {
        var val = sheet.getRange(r, 1).getValue();
        var num = parseInt(String(val).replace(/\D/g, ''), 10);
        if (!isNaN(num) && num > max) max = num;
      }
    });
    return json({ status: 'ok', lastNumber: max });
  } catch(err) {
    return json({ status: 'error', message: err.message });
  }
}

function handleHistory(fecha) {
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(fecha);
    if (!sheet || sheet.getLastRow() < 2) {
      return json({ status: 'ok', rows: [] });
    }
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
    const rows = data.map(function(r) {
      return {
        numeroRemision : r[0],
        fecha          : r[1],
        destino        : r[2],
        claseMaterial  : r[3],
        pesoToneladas  : r[4],
        placaVolqueta  : r[5],
        nombreConductor: r[6],
        firmaBeneficiario: r[7],
        firmaDespachador : r[8],
      };
    });
    return json({ status: 'ok', rows: rows });
  } catch(err) {
    return json({ status: 'error', message: err.message });
  }
}

// ── POST: guardar remisión ───────────────────────────────────────────────────
function doPost(e) {
  try {
    const data     = JSON.parse(e.postData.contents);
    const fechaIso = data.fecha || today();
    const ss       = SpreadsheetApp.openById(SHEET_ID);
    let   sheet    = ss.getSheetByName(fechaIso);

    if (!sheet) {
      sheet = ss.insertSheet(fechaIso);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
           .setFontWeight('bold')
           .setBackground('#2d4a8a')
           .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow(data.row);
    return json({ status: 'ok' });
  } catch(err) {
    return json({ status: 'error', message: err.message });
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function today() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
