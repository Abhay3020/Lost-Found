// src/components/Footer.tsx
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Lost & Found Portal</p>
    </footer>
  );
}
