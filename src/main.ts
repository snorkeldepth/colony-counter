class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private img: HTMLImageElement;

  private clickX: number[] = [];
  private clickY: number[] = [];

  private colonyCount = 0;
  private colonyCountDisplay: HTMLElement;

  constructor() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.fillStyle = 'rgba(255, 0, 0, 0.5)';
    context.lineWidth = 2;

    this.canvas = canvas;
    this.context = context;

    this.colonyCountDisplay = document.getElementById('colonyCounter');

    this.img = new Image();
    this.img.src = 'colonies.png';
    this.img.onload = (): void => {
      this.drawImageScaled();
    };

    this.redraw();
    this.createUserEvents();
  }

  private createUserEvents(): void {
    const canvas = this.canvas;

    canvas.addEventListener('mousedown', this.pressEventHandler);
    canvas.addEventListener('touchstart', this.pressEventHandler);

    document
      .getElementById('clear')
      .addEventListener('click', this.clearEventHandler);
  }

  private drawImageScaled(): void {
    const canvas = this.context.canvas;
    const img = this.img;
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const shiftX = (canvas.width - img.width * ratio) / 2;
    const shiftY = (canvas.height - img.height * ratio) / 2;
    this.context.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      shiftX,
      shiftY,
      img.width * ratio,
      img.height * ratio
    );
  }

  private redraw(): void {
    const clickX = this.clickX;
    const clickY = this.clickY;
    const context = this.context;

    for (let i = 0; i < clickX.length; ++i) {
      context.beginPath();
      context.arc(clickX[i], clickY[i], 2.5, 0, 2 * Math.PI);
      context.fill();
    }

    context.closePath();
  }

  private addClick(x: number, y: number): void {
    this.clickX.push(x);
    this.clickY.push(y);
    this.colonyCount++;
    this.updateCounterDisplay();
  }

  private updateCounterDisplay(): void {
    this.colonyCountDisplay.innerHTML =
      'Colony Count : ' + this.colonyCount.toString();
  }

  private clearCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.clickX = [];
    this.clickY = [];
  }

  private clearEventHandler = (): void => {
    this.clearCanvas();
  };

  private pressEventHandler = (e: MouseEvent | TouchEvent): void => {
    let mouseX = (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0].pageX
      : (e as MouseEvent).pageX;
    let mouseY = (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0].pageY
      : (e as MouseEvent).pageY;
    mouseX -= this.canvas.offsetLeft;
    mouseY -= this.canvas.offsetTop;

    this.addClick(mouseX, mouseY);
    this.redraw();
  };
}

new DrawingApp();
