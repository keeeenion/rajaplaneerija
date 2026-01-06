import { Application, Graphics, Text, TextStyle, Ticker } from "pixi.js";

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
                countdownText.text = '🚀';
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

export async function playGameOver(app: Application, score?: number): Promise<void> {
    return new Promise((resolve) => {
        const overlay = new Graphics();
        overlay.beginFill(0x000000, 0.7);
        overlay.drawRect(0, 0, app.screen.width, app.screen.height);
        overlay.endFill();
        overlay.alpha = 0; // Start invisible for fade-in
        app.stage.addChild(overlay);

        const style = new TextStyle({
            fontFamily: 'Arial Black',
            fontSize: 50,
            fill: '#0066ffff',
            stroke: { color: '#ffffff', width: 8 },
            dropShadow: {
                color: '#000000',
                blur: 10,
                angle: Math.PI / 4,
                distance: 12,
            },
        });

        const mainText = new Text({ text: 'LÕPP', style });
        mainText.anchor.set(0.5);
        mainText.x = app.screen.width / 2;
        mainText.y = app.screen.height / 2 - 20;
        mainText.scale.set(0); // Start at 0 for pop-in effect
        app.stage.addChild(mainText);

        let scoreText: Text | null = null;
        if (score !== undefined) {
            scoreText = new Text({
                text: `Final Score: ${score}`,
                style: { ...style, fontSize: 40, fill: '#ffffff', stroke: { width: 0 } }
            });
            scoreText.anchor.set(0.5);
            scoreText.x = app.screen.width / 2;
            scoreText.y = app.screen.height / 2 + 80;
            scoreText.alpha = 0;
            app.stage.addChild(scoreText);
        }

        let elapsed = 0;
        const animationLoop = (ticker: Ticker) => {
            elapsed += ticker.deltaTime;

            // Fade in background
            if (overlay.alpha < 1) overlay.alpha += 0.05 * ticker.deltaTime;

            // Pop-in and bounce effect for main text
            if (mainText.scale.x < 1) {
                const grow = 0.08 * ticker.deltaTime;
                mainText.scale.x += grow;
                mainText.scale.y += grow;
            }

            // Fade in score after a short delay
            if (scoreText && elapsed > 30) {
                scoreText.alpha += 0.05 * ticker.deltaTime;
            }
        };

        app.ticker.add(animationLoop);

        // We'll keep the text on screen for 4 seconds, then resolve
        setTimeout(() => {
            app.ticker.remove(animationLoop);
            app.stage.removeChild(overlay);
            app.stage.removeChild(mainText);
            if (scoreText) app.stage.removeChild(scoreText);
            resolve();
        }, 4000);
    });
}