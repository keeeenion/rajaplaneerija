import { Application, Text, TextStyle, Ticker } from "pixi.js";

export async function playCountdown(app: Application): Promise<void> {
    return new Promise((resolve) => {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 80,
            fill: '#ffffff',
            stroke: { color: '#4a1850', width: 5 }, // v8 uses object-based stroke
            dropShadow: {
                color: '#000000',
                blur: 4,
                angle: Math.PI / 6,
                distance: 6,
            },
        });

        const countdownText = new Text({ text: '3', style });

        countdownText.anchor.set(0.5);
        countdownText.x = app.screen.width / 2;
        countdownText.y = app.screen.height / 2;

        app.stage.addChild(countdownText);

        let count = 3;

        const timer = setInterval(() => {
            count--;

            if (count > 0) {
                countdownText.text = count.toString();
                countdownText.scale.set(2); // Start large for pulse
            } else if (count === 0) {
                countdownText.text = 'GO!';
                countdownText.style.fill = '#ffff00';
            } else {
                clearInterval(timer);
                app.stage.removeChild(countdownText);
                app.ticker.remove(pulseEffect); // Cleanup ticker
                resolve();
            }
        }, 1000);

        // Subtle scale-down effect using v8 Ticker
        const pulseEffect = (ticker: Ticker) => {
            if (countdownText.scale.x > 1) {
                const step = 0.1 * ticker.deltaTime;
                countdownText.scale.x -= step;
                countdownText.scale.y -= step;
            }
        };
        app.ticker.add(pulseEffect);
    });
}