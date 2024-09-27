function addHabit(habit) {
  let habitLibrary = JSON.parse(localStorage.getItem('habitLibrary')) || [];
  if (!habitLibrary.includes(habit)) {
    habitLibrary.push(habit);
    localStorage.setItem('habitLibrary', JSON.stringify(habitLibrary));
    alert(`${habit} has been added to your habit library!`);
  } else {
    alert(`${habit} is already in your habit library!`);
  }
}
