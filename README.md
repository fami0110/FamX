# FamX Homepage - A Custom New Tab Page

Im bored with chrome default homepage, so i made my own;)

<!-- ![FamX Homepage Screenshot](https://i.imgur.com/your-screenshot.png)  -->

## ✨ Features

- **Dynamic Greetings:** Personalized greetings that change throughout the day.
- **Real-time Clock:** Always know what time it is.
- **Weather Updates:** Get the current weather at a glance.
- **Battery Status:** Keep an eye on your device's battery level.
- **Quick Search:** Integrated search bar with Google suggestions.
- **Customizable Shortcuts:** Add, edit, and arrange your favorite websites for quick access.
- **Modern & Clean UI:** Aesthetically pleasing design built with Tailwind CSS and Radix UI.
- **Settings Panel:** Customize the look and feel of your new tab page.

## 🚀 Tech Stack

- **Framework:** [React](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/en/) (v18 or newer) and `npm` installed on your machine.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd famx-homepage
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Run the development server:
    ```sh
    npm run dev
    ```
    This will start the Vite development server, and you can view the app in your browser at `http://localhost:5173` (or another port if 5173 is in use).

## 📦 Build for Production

To create a production build of the extension, run the following command:

```sh
npm run build
```

This will create a `dist` folder in the project root. This folder contains all the static files needed to load the extension in Chrome.

## Chrome Extension - Manual Installation Guide

To load this project as a Chrome extension, follow these steps:

1.  **Build the Project:** First, build the project by running the command `npm run build`. This will generate a `dist` folder containing the necessary files.

2.  **Open Chrome Extensions:**
    -   Open Google Chrome.
    -   Navigate to `chrome://extensions`. You can also access this by clicking the three-dot menu in the top-right corner, selecting **Extensions**, and then **Manage Extensions**.

3.  **Enable Developer Mode:**
    -   In the top-right corner of the Extensions page, toggle on **Developer mode**.

4.  **Load the Extension:**
    -   Once Developer mode is enabled, a new menu with three buttons will appear: "Load unpacked", "Pack extension", and "Update".
    -   Click on the **Load unpacked** button.
    -   A file selection dialog will appear. Navigate to the `dist` folder that was created when you built the project, select the `dist` folder itself, and click **Select Folder**.

5.  **Done!**
    -   The "Custom Homepage" extension should now appear in your list of extensions.
    -   Open a new tab to see your new custom homepage in action!