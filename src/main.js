const answer = prompt('Hvor meget skade gør angrebet?');
console.log(answer, typeof answer);

if (answer === null) {
  alert('Du annullerede');
} else if (answer.trim() === '') {
  alert('Du skrev ikke noget');
} else {
  const damage = Number(answer);

  if (Number.isNaN(damage)) {
    alert(`"${answer}" er ikke et tal`);
  } else {
    alert(`Angrebet gør ${damage} i skade.`);
  }
}