document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.querySelector('textarea')
  textarea.focus();
  const savedText = localStorage.getItem('text');
  if (savedText !== null) {
    textarea.value = savedText;
  }
  const savedWidth = localStorage.getItem('width');
  if (savedWidth !== null) {
    textarea.style.width = `${savedWidth}px`;
  }
  const savedHeight = localStorage.getItem('height');
  if (savedHeight !== null) {
    textarea.style.height = `${savedHeight}px`;
  }
  textarea.addEventListener('input', () => {
    localStorage.setItem('text', textarea.value);
  });
  const saveSize = () => {
    localStorage.setItem('width', textarea.offsetWidth);
    localStorage.setItem('height', textarea.offsetHeight);
  };
  new ResizeObserver(saveSize).observe(textarea);
});