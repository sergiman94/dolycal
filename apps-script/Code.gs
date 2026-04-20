// Google Apps Script — pega este código en script.google.com
// Luego: Implementar > Nueva implementación > Aplicación web
//   · Ejecutar como: Yo
//   · Quién tiene acceso: Cualquier persona
// Copia la URL generada y pégala en .env como VITE_APPS_SCRIPT_URL

const SHEET_ID = '11viVDp1wJyCD2k4IVkNlG-zCQjR3fP4FkcCxEIH5VXk';
const HEADERS  = ['N° Remisión','Fecha','Destino','Clase Material','Peso (Ton)','Placa','Conductor','Beneficiario','Despachador'];

function doPost(e) {
  try {
    const data    = JSON.parse(e.postData.contents);
    const fechaIso = data.fecha || new Date().toISOString().split('T')[0];
    const tabName  = fechaIso; // formato YYYY-MM-DD

    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let   sheet = ss.getSheetByName(tabName);

    if (!sheet) {
      sheet = ss.insertSheet(tabName);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
           .setFontWeight('bold')
           .setBackground('#2d4a8a')
           .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow(data.row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Permite peticiones GET para verificar que el script está activo
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', msg: 'Remisiones API activa' }))
    .setMimeType(ContentService.MimeType.JSON);
}
