import React from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  return (
    <div className="help-page page-shell">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Help & Overview</p>
          <h1>ASN Dairy Hub — How it works</h1>
        </div>
      </div>

      <div className="panel-card">
        <h2>Core concepts</h2>
        <ul>
          <li><strong>Products</strong>: Manage milk items with stock, pricing and optional image uploads.</li>
          <li><strong>Customers</strong>: Create and maintain customer profiles and delivery addresses.</li>
          <li><strong>Deliveries</strong>: Schedule deliveries by selecting a customer and products.</li>
          <li><strong>Subscriptions</strong>: Manage recurring deliveries for customers.</li>
        </ul>

        <h3>Sample flows</h3>
        <ol>
          <li>Go to <Link to="/products">Products</Link> and add a product (optionally upload an image).</li>
          <li>Open <Link to="/customers">Customers</Link> and create a customer record.</li>
          <li>Create a delivery from <Link to="/deliveries">Deliveries</Link>, select the customer and product and schedule a date.</li>
          <li>Manage recurring orders under <Link to="/subscriptions">Subscriptions</Link>.</li>
        </ol>

        <h3>Local development tips</h3>
        <ul>
          <li>Run the backend from the project root: <code>npm run dev</code></li>
          <li>To build the frontend: <code>cd frontend && npm run build</code></li>
          <li>The backend serves the built frontend from <code>frontend/dist</code> in production mode.</li>
        </ul>

        <h3>Where to find more</h3>
        <p>See the project README at the repository root for quickstart commands and next steps.</p>
      </div>
    </div>
  );
};

export default Help;
