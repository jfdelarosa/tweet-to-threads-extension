# Tweets to threads Chrome Extension

Extension to automatically crosspost tweets to threads.

## Installation

### Install on Chrome/Brave/Edge/Opera

#### Install from source

1. Download the latest release.
2. Unzip the file.
3. Go to the extensions page:

- `chrome://extensions` (Chrome, Brave or Opera)
- `edge://extensions` (Edge)

4. Enable Developer Mode.
5. Drag the unzipped folder anywhere on the page to import it (do not delete the folder afterwards).

### Install on Firefox

Firefox is not supported at the moment.

## Developing

### Prerequisites

- [Node.js](https://nodejs.org/en/)

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
