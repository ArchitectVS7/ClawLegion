# Contact Form Component

A simple, responsive React contact form with validation and styling.

## Features

- **Three input fields**: Name, Email, and Message
- **Real-time validation**: Errors clear as user types
- **Form validation rules**:
  - Name: Required, minimum 2 characters
  - Email: Required, valid email format
  - Message: Required, minimum 10 characters
- **Success feedback**: Displays confirmation message on successful submission
- **Responsive design**: Works on mobile and desktop
- **Clean styling**: Modern UI with smooth transitions

## Files

- `ContactForm.jsx` - Main React component
- `ContactForm.css` - Styling for the component
- `README.md` - This file

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

## Customization

- Modify validation rules in the `validateForm()` function
- Adjust styling in `ContactForm.css`
- Update the submit handler to integrate with your backend API

## Form Submission

Currently, the form logs data to console. To connect to a backend:

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
      
      if (response.ok) {
        setSubmitted(true);
        // Reset form...
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  } else {
    setErrors(newErrors);
  }
};
```
