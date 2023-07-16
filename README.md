# Tweets to threads Chrome Extension

Extension to automatically crosspost tweets to threads.

## Developing

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- Run the [Tweet-to-threads extension server](https://github.com/jfdelarosa/tweet-to-threads-server)

### Install

1. Clone the repository
2. Install dependencies

```bash
npm install
```

### Getting Started

1. Rename the `.env.example` to `.env`and configure your credentials
2. Run the development server:

```bash
npm run dev
```

### Build the extension

Run the following:

```bash
npm run build
```

### Installing the extension

1. Go to the extensions page:

- `chrome://extensions` (Chrome, Brave or Opera)
- `edge://extensions` (Edge)

2. Enable Developer Mode.
3. Drag the `/build/chrome-mv3-dev` folder or the `/build/chrome-mv3-prod.zip` file anywhere on the page to import it.
