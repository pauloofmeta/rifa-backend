const seedNumbers = async (db: FirebaseFirestore.Firestore) => {
  console.log('Verificando se os números foram cadastrados:');

  const ref = await db.collection('numbers').doc('nums').get();
  if (ref.exists) {
    return console.log('Números já cadastrados!');
  }

  const numbersArray = Array.from(Array(100).keys(), n => n + 1);
  const numbers = numbersArray.map(n => ({ number: n, inUse: false }));

  try {
    await db.collection('numbers').doc('nums').set({ values: numbers });
    console.log('Números cadastrados com sucesso!');
  } catch (err) {
    console.error('Ocorreu um errro ao cadastrar os números', err);
  }
}

export default seedNumbers;