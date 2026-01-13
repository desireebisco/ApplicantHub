# Applicant Management System

A complete React application for managing applicant information with dynamic custom fields, built with React Router for multi-page navigation.

## 🎯 Features

### Two Main Routes

**1. Form Page (`/`)**

- Add new applicants
- Create custom fields on the fly
- Standard fields: Name, Address, Birthday
- Dynamic field types: Text, Email, Phone, Number, Date, Text Area

**2. Applicants List Page (`/applicants`)**

- View all registered applicants in a table
- **Search** - Real-time search across all fields
- **Filter** - Filter by specific field presence
- **Sort** - Click column headers to sort (ascending/descending)
- **Delete** - Remove applicants with confirmation
- Empty state when no applicants exist

### Key Features

- ✨ Elegant, professional design
- 🔄 Shared state across routes using Context API
- 📱 Fully responsive layout
- 🎨 Smooth animations and transitions
- ⚡ Fast and efficient filtering/sorting

## 🚀 Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Run development server:**

```bash
npm run dev
```

3. **Open in browser:**

```
http://localhost:5173
```

## 📂 Project Structure

```
src/
├── App.jsx                    # Main app with routing setup
├── App.css                    # Global styles
├── ApplicantContext.jsx       # Context for shared state
├── ApplicantFormPage.jsx      # Form page component
├── ApplicantForm.css          # Form page styles
├── ApplicantListPage.jsx      # List page component
├── ApplicantList.css          # List page styles
└── main.jsx                   # Entry point
```

## 🛣️ Routes

| Route         | Component         | Description                    |
| ------------- | ----------------- | ------------------------------ |
| `/`           | ApplicantFormPage | Add new applicants             |
| `/applicants` | ApplicantListPage | View and manage all applicants |

## 💡 Usage

### Adding an Applicant

1. Navigate to the home page (`/`)
2. Fill in the required fields (Name, Address, Birthday)
3. Optionally add custom fields:
   - Enter a field name (e.g., "Phone Number")
   - Select field type
   - Click "+ Add Field"
4. Click "Save Applicant"
5. Click "View All Applicants" to see the list

### Managing Applicants

1. Navigate to `/applicants` or click "View All Applicants"
2. **Search**: Type in the search box to filter results
3. **Filter**: Select a field from the dropdown to show only applicants with that field
4. **Sort**: Click any column header to sort by that field
5. **Delete**: Click the 🗑️ icon to remove an applicant

### Adding Custom Fields

Custom fields are created on the form page and automatically appear:

- In the form for future submissions
- As columns in the applicants table
- In the filter dropdown

## 🎨 Design Details

### Color Scheme

- **Primary**: Forest Green (#2d5a3d)
- **Accent**: Terracotta (#e8935c)
- **Background**: Warm Cream (#faf8f4)
- **Surface**: White (#ffffff)

### Typography

- **Headers**: Unbounded (modern, bold)
- **Body**: Newsreader (elegant serif)

## 🔧 Technologies

- React 18.3
- React Router DOM 6.22
- Vite 6.0
- Context API for state management

## 📦 Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.22.0"
}
```

## 🔄 State Management

The app uses React Context API to share state between routes:

- **ApplicantContext** manages:
  - Applicants list
  - Custom fields
  - Add/delete operations

This ensures data persists when navigating between pages.

## 🌟 Future Enhancements

- [ ] Local storage persistence
- [ ] Edit existing applicants
- [ ] Export to CSV/Excel
- [ ] Import from file
- [ ] Print view
- [ ] Pagination for large datasets
- [ ] Advanced filtering (date ranges, multiple conditions)
- [ ] User authentication
- [ ] Backend API integration

## 📱 Responsive Design

The application is fully responsive:

- **Desktop**: Full table view with all features
- **Tablet**: Optimized layout
- **Mobile**: Stacked forms and scrollable tables

## 🐛 Known Issues

- Custom fields are stored in memory only (no persistence)
- No edit functionality (must delete and re-add)

## 📄 License

Free to use and modify for your projects.
