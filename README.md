# 👑 Royal Chess: Grandmaster Edition

A high-fidelity, web-based Chess engine featuring professional rules, sleek "Gold & Charcoal" visuals, and full mobile responsiveness. Built with pure HTML5, CSS3, and JavaScript.

![Royal Chess Preview](https://img.shields.io/badge/Status-Playable-success?style=for-the-badge&logo=github)
![Chess Rules](https://img.shields.io/badge/Rules-Standard%20FIDE-gold?style=for-the-badge)

## 🌟 Key Features

* **Advanced Rule Enforcement**: Includes logic for complex moves often missing in web games:
    * **Castling**: Supports both King-side and Queen-side castling.
    * **En Passant**: Fully functional special pawn capture.
    * **Pawn Promotion**: Choose between Queen, Rook, Bishop, or Knight when a pawn reaches the final rank.
* **Visual Enhancements**:
    * **High Visibility Mode**: White pieces feature a custom text-shadow/outline to ensure clarity on all square colors.
    * **Glassmorphism UI**: Modern status bars and overlay menus.
* **Responsive Design**: Play on Desktop, Tablet, or Mobile with a board that scales to fit your screen.
* **Win Detection**: Automatic detection of King capture with a custom victory screen.

## 🕹️ How to Play

1.  **Select a Piece**: Click on any piece of your color. The piece will be highlighted in gold.
2.  **Move**: Click on a valid square. The engine will block any illegal moves.
3.  **Special Moves**:
    * To **Castle**, move your King two squares toward your Rook.
    * To **Promote**, move your pawn to the opposite end of the board and select your new piece from the pop-up menu.



## 🛠️ Technical Logic

The game is built using a coordinate-based grid system (0-7 for rows and columns). 
* **Path Validation**: A custom `isPathClear()` function prevents non-jumping pieces (like Rooks and Queens) from moving through other pieces.
* **Move History**: The engine tracks the `lastMove` specifically to handle the "one-turn window" required for En Passant captures.
* **Event-Driven UI**: The board re-renders only when state changes occur, ensuring smooth performance.

## 🚀 Installation & Deployment

No installation is required. This is a client-side application.

1.  Clone this repository:
    ```bash
    git clone [https://github.com/NashraHusain/royal-chess-pro.git](https://github.com/NashraHusain/royal-chess-pro.git)
    ```
2.  Open `index.html` in any modern web browser.
3.  Alternatively, visit the live link hosted via **GitHub Pages**.

## 📜 License

This project is open-source. Feel free to fork it, add new features (like an AI or move history log), and use it for your own portfolio!

---
Made with ✨ and Logic.
