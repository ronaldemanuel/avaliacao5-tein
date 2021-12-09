const img = document.querySelector('img');
const canvas = document.querySelector('canvas');
const message = document.querySelector('.status');
const messages = {
  success: 'Rosto(s) encontrado(s)',
  error: 'Ops, nenhum rosto encontrado :(',
  alert: 'O distanciamento de 1,5m não está sendo respeitado!!!',
  distanceIsOk: 'O distanciamento de 1,5m está sendo respeitado :D'
};

async function findFaces() {
  const model = await blazeface.load();
  const predictions = await model.estimateFaces(img, false);
  const faces = [];

  if (predictions.length > 0) {
    message.innerText = messages.success;

    canvas.width = img.width;
    canvas.height = img.height;

    const context = canvas.getContext('2d');

    context.fillStyle = 'rgba(250, 225, 6, 0.5)';

    for (let i = 0; i < predictions.length; i++) {
      const start = predictions[i].topLeft;
      const end = predictions[i].bottomRight;
      const size = [end[0] - start[0], end[1] - start[1]];

      context.fillRect(start[0], start[1], size[0], size[1]);

      faces.push({
        topLeft: [start[0], start[1]],
        bottomRight: [end[0], end[1]],
      });
    }
  } else {
    message.innerText = messages.error;
  }

  return faces;
}

async function calcDistance() {
  const faces = await findFaces();
  let distanceIsOk = true;
  
  if (faces.length >= 0) {
    faces.sort((a, b) => a.topLeft[0] - b.topLeft[0]);
    
    for (let i = 0; i < faces.length; i++) {
      if (i !== 0) {
        const distance = faces[i].topLeft[0] - faces[i - 1].bottomRight[0];
        const isSecure = distance >= 25;
      
        if (!isSecure) {
          message.innerText = messages.alert;
          distanceIsOk = false;
        }
      }
    }

    if (distanceIsOk) {
      message.innerText = messages.distanceIsOk;
    }
  } else {
    message.innerText = messages.error;
  }
}