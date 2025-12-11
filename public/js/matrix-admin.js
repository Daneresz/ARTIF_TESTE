// Matrix Binary Rain Effect
class MatrixRain {
  constructor() {
    this.container = document.querySelector('.binary-rain-container');
    this.columns = [];
    this.characterSet = '01';
    this.initRain();
  }

  initRain() {
    const containerWidth = window.innerWidth;
    const columnWidth = 20;
    const columnCount = Math.floor(containerWidth / columnWidth);

    for (let i = 0; i < columnCount; i++) {
      const column = {
        x: i * columnWidth,
        y: 0,
        speed: Math.random() * 3 + 1,
        chars: this.generateChars(),
        opacity: 1,
      };
      this.columns.push(column);
      this.createColumn(column);
    }

    this.animate();
  }

  generateChars(length = 15) {
    let chars = '';
    for (let i = 0; i < (length || Math.random() * 20 + 10); i++) {
      chars += this.characterSet[Math.floor(Math.random() * this.characterSet.length)];
    }
    return chars;
  }

  createColumn(column) {
    const el = document.createElement('div');
    el.className = 'binary-column';
    el.style.left = column.x + 'px';
    el.textContent = column.chars;
    column.element = el;
    this.container.appendChild(el);
  }

  animate = () => {
    this.columns.forEach((col) => {
      col.y += col.speed;
      col.opacity = Math.max(0, 1 - col.y / window.innerHeight);

      col.element.style.top = col.y + 'px';
      col.element.style.opacity = col.opacity;

      if (col.y > window.innerHeight) {
        col.y = -100;
        col.chars = this.generateChars();
        col.element.textContent = col.chars;
        col.speed = Math.random() * 3 + 1;
      }
    });

    requestAnimationFrame(this.animate);
  };
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new MatrixRain();

  // Efeito de digitação nos títulos
  const titles = document.querySelectorAll('.admin-header h1');
  titles.forEach(title => {
    const text = title.textContent;
    title.textContent = '';
    let index = 0;
    const interval = setInterval(() => {
      title.textContent += text[index];
      index++;
      if (index === text.length) clearInterval(interval);
    }, 100);
  });

  // Efeito de clique nos botões
  document.querySelectorAll('.card-link, .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(0, 255, 0, 0.5)';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'ripple 0.6s ease-out';

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
});

// Animação ripple
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      width: 200px;
      height: 200px;
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
