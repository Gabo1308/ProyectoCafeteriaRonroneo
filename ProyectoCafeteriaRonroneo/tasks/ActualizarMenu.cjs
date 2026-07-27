const mysql = require('mysql2/promise');

async function miTarea() {
  const conexion = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'cafeteriaronroneo',
  });

  const horaActual = new Date().toTimeString().slice(0, 8);
  console.log(`[${new Date().toLocaleString()}] Revisando menu activo a las ${horaActual}`);

  await conexion.execute('UPDATE menu SET EnCurso = 0');

  const [filas] = await conexion.execute(
    `SELECT IdMenu, Nombre FROM menu
     WHERE Estado = 1
       AND CURDATE() BETWEEN FechaInicio AND FechaFin
       AND (
            (HoraInicio <= HoraFin AND ? BETWEEN HoraInicio AND HoraFin)
         OR (HoraInicio > HoraFin AND (? >= HoraInicio OR ? <= HoraFin))
       )
     ORDER BY FechaInicio DESC
     LIMIT 1`,
    [horaActual, horaActual, horaActual]
  );

  if (filas.length > 0) {
    await conexion.execute('UPDATE menu SET EnCurso = 1 WHERE IdMenu = ?', [filas[0].IdMenu]);
    console.log(`Menú activado: ${filas[0].Nombre}`);
  } else {
    console.log('Ningun menú corresponde a esta hora.');
  }

  await conexion.end();
}

function iniciarSincronizado() {
  const ahora = Date.now();
  const msHastaProximoMinuto = 60000 - (ahora % 60000);

  console.log(`Sincronizando... primera ejecución en ${Math.round(msHastaProximoMinuto / 1000)}s`);

  setTimeout(() => {
    miTarea();
    setInterval(() => {
      console.log('Ejecutando tarea programada');
      miTarea();
    }, 60000);
  }, msHastaProximoMinuto);
}

miTarea(); 
iniciarSincronizado();