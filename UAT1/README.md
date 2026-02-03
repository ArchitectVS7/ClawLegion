# Contact Form Component

A simple, reusable React contact form component with validation and styling.

## Features

- **Form Fields**: Name, Email, and Message
- **Validation**: 
  - Name: Required, minimum 2 characters
  - Email: Required, valid email format
  - Message: Required, minimum 10 characters
- **Real-time Error Feedback**: Errors clear as user types
- **Submit State**: Shows loading state during submission
- **Success Message**: Displays confirmation after successful submission
- **Responsive Design**: Works on mobile and desktop
- **Clean Styling**: Modern, professional appearance

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

- `ContactForm.jsx` - Main component with logic
- `ContactForm.css` - Styling

## Customization

To integrate with a real API, replace the simulated submission in `handleSubmit`:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }
};
```

## Validation Rules

- **Name**: Must be at least 2 characters
- **Email**: Must match standard email format (example@domain.com)
- **Message**: Must be at least 10 characters

All fields are required.
