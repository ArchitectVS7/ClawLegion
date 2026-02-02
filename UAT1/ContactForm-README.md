# React Contact Form Component

A simple, fully-functional React contact form with validation and styling.

## Features

✅ **Three form fields:**
- Name (min 2 characters)
- Email (with email format validation)
- Message (min 10 characters)

✅ **Form validation:**
- Real-time error clearing when user starts typing
- Email format validation using regex
- Required field validation
- Minimum length validation

✅ **User experience:**
- Clear error messages below each field
- Success message on submission
- Visual feedback (red borders for errors, green for focus)
- Responsive design
- Smooth animations

✅ **Styling:**
- Clean, modern design
- Centered layout with shadow
- Hover effects on button
- Mobile-responsive

## Usage

```jsx
import ContactForm from './ContactForm';

function App() {
  return (
    <div className="App">
      <ContactForm />
    </div>
  );
}
```

## Files

- `ContactForm.jsx` - Main React component with state management and validation logic
- `ContactForm.css` - Styling with modern, clean design
- `README.md` - This file

## Customization

You can easily customize:
- Colors by changing CSS variables
- Validation rules in the `validateForm()` function
- Form submission behavior in the `handleSubmit()` function (currently just logs to console)
- Field requirements and error messages

## Next Steps

To integrate with a backend, modify the `handleSubmit` function to send data to your API:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateForm();
  
  if (Object.keys(newErrors).length === 0) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      // Handle response...
    } catch (error) {
      console.error('Submission error:', error);
    }
  }
};
```
