# Concept Dictionary Cleaning Interface

A web-based interface to help linguists and data curators identify, review, and clean duplicate concept entries in a multilingual concept dictionary. The tool provides an intuitive way to manage dictionary entries with options to edit or delete duplicates, improving data quality and consistency.

---

## ✨ Features

- **Duplicate Concept Detection**  
  Automatically displays duplicate entries from the `concept_label` column.

- **Multilingual Display**  
  Shows concept labels in English, Hindi, Sanskrit, and other languages as available.

- **Editable Entries**  
  Edit concept details directly within the interface.

- **Delete Option**  
  Remove unwanted duplicate entries to maintain a clean dictionary.

- **Pagination**  
  Limits visible duplicates per page (default 5 per page) for better usability.

- **Responsive UI**  
  Supports horizontal and vertical scrolling for better navigation of large tables.

- **Search Type Sensitivity**  
  Adjusts displayed labels based on the search type (e.g., English).

---

## 🛠 Technology Stack

- **Frontend:** React.js
- **Backend:** Python, Flask
- **Database:** PostgreSQL
- **API:** RESTful endpoints to fetch and update concept dictionary entries

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/concept-dictionary-cleaner.git
cd concept-dictionary-cleaner
```


Run Using Shell Script
A convenient shell script is provided to install dependencies and start the frontend.

```bash
chmod +x start.sh
./start.sh
```

This script will:

✅ Pull the latest code from the Git repository
✅ Install frontend dependencies (inside dictionary_cleaner folder)
✅ Start the React frontend server

By default, the frontend runs at:


http://localhost:3000


Manual Steps (Alternative)
If you prefer to run steps manually instead of the script:


Install frontend dependencies

```bash
cd dictionary_cleaner
npm install
```
Start frontend

```bash
npm start
```

The interface will display duplicate concepts with their labels.

Use the pagination controls to browse through duplicates.

Click Edit to modify a concept entry.

Click Delete to remove a duplicate concept.

Changes will be saved to the backend database.


📂 Project Structure

/concept-dictionary-cleaner      # Root project directory
/src
  /components                    # React components for the UI
  /api                           # API calls to backend services
  App.js                         # Main application component

🤝 Contribution
Contributions are welcome! Feel free to open issues or submit pull requests to improve the tool.

📫 Contact
Sashank Tatavoli
Email: sashank.tatavolu@research.iiit.ac.in
GitHub: SashankTatavolu


