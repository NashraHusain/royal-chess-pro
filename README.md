# 👑 Royal Chess: Grandmaster Edition

A high-fidelity, web-based Chess engine featuring professional rules, sleek "Gold & Charcoal" visuals, and advanced interactive logic. Built with pure HTML5, CSS3, and JavaScript (ES6+).

[Royal Chess Preview](https://img.shields.io/badge/Status-Playable-success?style=for-the-badge&logo=github)
[![Chess Rules](https://img.shields.io/badge/Rules-Standard%20FIDE-gold?style=for-the-badge)](https://www.chess.com/learn-how-to-play-chess)

## 🌟 Key Features

* **Advanced Rule Enforcement**: Includes logic for complex moves:
    * **Castling**: Supports both King-side and Queen-side (Long) castling.
    * **En Passant**: Fully functional special pawn capture system.
    * **Pawn Promotion**: Interactive UI to choose between Queen, Rook, Bishop, or Knight.
* **Visual Immersion**:
    * **Check-Alert Animations**: The King's square pulses with a red "Emergency Glow" when under attack.
    * **Dynamic Turn Indicator**: A glassmorphism status bar that glows White or Gold depending on the active player.
* **Adaptive Multi-Column Graveyard**: Captured pieces are organised in vertical columns that automatically "wrap" into a second line if the graveyard reaches capacity, keeping the UI compact.
* **Game Management**: Integrated **Undo Move** history and instant **Restart** functionality.

## 🕹️ How to Play

1.  **Select a Piece**: Click on any piece of your color. It will be highlighted in gold.
2.  **Move**: Click on a valid square. The engine automatically validates moves based on FIDE rules.
3.  **Special Moves**:
    * To **Castle**, move your King two squares toward your Rook.
    * To **Promote**, move your pawn to the last rank and select your new piece from the overlay.
4.  **Winning**: The game ends immediately when a King is captured.

## 🛠️ Technical Logic

* **Coordinate Grid System**: The board operates on a 0-7 array-based grid.
* **Win-Priority Execution**: The engine prioritises "King Capture" checks before "Pawn Promotion" to prevent runtime errors during winning strikes.
* **Flex-Wrap Graveyard**: Uses CSS Flexbox `column-wrap` logic combined with JavaScript `createElement` cycles to manage fallen pieces without resizing the board layout.
* **Path Validation**: A custom `isPathClear()` function prevents non-jumping pieces (Rooks/Queens/Bishops) from moving through obstacles.

## 🚀 Installation & Deployment

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/NashraHusain/royal-chess-pro.git](https://github.com/NashraHusain/royal-chess-pro.git)
    ```
2.  **Run the game**:
    Open `index.html` in any modern web browser (Chrome, Edge, or Firefox).
3.  **Live Access**:
    Host this via GitHub Pages to play anywhere on mobile or desktop.

## 📜 License & Copyright 

**© 2026 Nashra Husain. All Rights Reserved.**

This project is the intellectual property of Nashra Husain. While the source code is visible for educational and peer-review purposes, the following restrictions apply:

* **No Portfolio Use**: You are **strictly prohibited** from including this project, its code, or its design in your own professional portfolio or claiming it as your own work.
* **Non-Commercial Use**: This project may not be used for any commercial purposes or redistributed on any platform for profit.
* **No Unauthorised Redistribution**: You may not re-upload this code to your own public repositories without clear and prominent attribution to the original author and express written permission.

**Permitted Use:**
* You are welcome to study the code for learning and educational purposes.
* You may fork the repository for personal, private experimentation only.

---
**Made with ✨ and Logic by [Nashra Husain](https://github.com/NashraHusain)**
