function toggle(elem){
  if (elem.style.display === 'block') {
    elem.style.display = 'none';
  } else if (elem.style.display === 'none' || elem.style.display === '') {
    elem.style.display = 'block';
  }
}