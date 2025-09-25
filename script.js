// Плавная прокрутка при клике на кнопку
document.querySelector('button').addEventListener('click', () => {
  document.querySelector('.card:nth-of-type(2)').scrollIntoView({ behavior: 'smooth' });
});
