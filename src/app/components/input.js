
"use client";
import Input from './input';

function ExampleForm() {
  const [value, setValue] = React.useState('');

  return (
    <Input
      label="Email"
      placeholder="Enter your email"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      rounded
      startAdornment={<MailIcon />}
      required
    />
  );
}