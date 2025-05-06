// src/components/Navbar.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => setIsOpen(false);

  return (
<nav className="sidebar">
  <div className="sidebar-header">
    <h2>Lost & Found</h2>
    <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>☰</button>
  </div>
  <ul className={isOpen ? 'show' : ''}>
    <li><Link to="/report" onClick={handleLinkClick}>Report Item</Link></li>
    <li><Link to="/view" onClick={handleLinkClick}>View Items</Link></li>
    <li><Link to="/collected" onClick={handleLinkClick}>Collected Items</Link></li>
    <li><Link to="/donated">Donated Items</Link></li>

  </ul>
</nav>
  );
}
