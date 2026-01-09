# Eventrix Exhibition & Studio - Email Templates

## Email Notification System

All emails sent by Eventrix include company branding and are mobile-responsive.

### 1. Welcome Email (On Registration)

**Subject**: Welcome to Eventrix Exhibition & Studio!

**Template**:
```html
<h1>Welcome to Eventrix!</h1>
<p>Hi [FIRST_NAME],</p>
<p>Thank you for joining Eventrix Exhibition & Studio. We're excited to help you create amazing custom prints.</p>

<h2>Get Started</h2>
<ul>
  <li>Browse our product categories</li>
  <li>Choose from ready-made templates</li>
  <li>Upload your own custom designs</li>
  <li>Track your orders in real-time</li>
</ul>

<p><a href="[SHOP_URL]">Start Shopping Now</a></p>
```

### 2. Order Confirmation Email

**Subject**: Your Order #[ORDER_ID] Confirmed

**Template**:
```html
<h1>Order Confirmed!</h1>
<p>Hi [FIRST_NAME],</p>
<p>Your order has been confirmed and will be processed shortly.</p>

<h2>Order Details</h2>
- Order ID: [ORDER_ID]
- Date: [ORDER_DATE]
- Total: [TOTAL_AMOUNT]
- Delivery Address: [ADDRESS]

<h2>Items</h2>
[ITEMS_LIST]

<h2>Track Your Order</h2>
<p><a href="[TRACKING_URL]">Click here to track</a></p>

<h2>Need Help?</h2>
<p>Contact us at support@eventrix.com</p>
```

### 3. Payment Successful Email

**Subject**: Payment Confirmed - Order #[ORDER_ID]

**Template**:
```html
<h1>Payment Successful!</h1>
<p>Hi [FIRST_NAME],</p>
<p>Your payment of ₹[AMOUNT] has been successfully processed.</p>

<h2>Payment Details</h2>
- Transaction ID: [TRANSACTION_ID]
- Payment Method: [METHOD]
- Date & Time: [DATETIME]

<p>Your order will be processed and printed within 24 hours.</p>

<p><a href="[ORDER_URL]">View Order Details</a></p>
```

### 4. Design Ready Email

**Subject**: Your Custom Design is Ready! - Order #[ORDER_ID]

**Template**:
```html
<h1>Your Design is Ready!</h1>
<p>Hi [FIRST_NAME],</p>
<p>Your custom design request has been completed by our professional designer: [DESIGNER_NAME].</p>

<h2>Design Details</h2>
- Design ID: [DESIGN_ID]
- Product: [PRODUCT_NAME]
- Created on: [DATE]
- Designer Cost: ₹[COST]

<p><a href="[DESIGN_PREVIEW_URL]">View Your Design</a></p>

<p>If you need any revisions, reply to this email within 7 days.</p>
```

### 5. Shipping Notification Email

**Subject**: Your Order is on the Way! - Order #[ORDER_ID]

**Template**:
```html
<h1>Your Package is Shipped!</h1>
<p>Hi [FIRST_NAME],</p>
<p>Your order has been packaged and shipped.</p>

<h2>Tracking Information</h2>
- Tracking Number: [TRACKING_NUMBER]
- Carrier: [CARRIER_NAME]
- Estimated Delivery: [DELIVERY_DATE]

<p><a href="[TRACKING_URL]">Track Your Package</a></p>

<h2>Delivery Address</h2>
[DELIVERY_ADDRESS]
```

### 6. Delivery Confirmation Email

**Subject**: Your Order Delivered! - Order #[ORDER_ID]

**Template**:
```html
<h1>Your Order has Arrived!</h1>
<p>Hi [FIRST_NAME],</p>
<p>Your order has been successfully delivered on [DELIVERY_DATE].</p>

<h2>Order Summary</h2>
[ITEMS_LIST]
- Total: [TOTAL_AMOUNT]

<p>We hope you love your custom prints!</p>

<p><a href="[REVIEW_URL]">Share Your Feedback</a></p>

<h2>Thank You!</h2>
<p>Thank you for choosing Eventrix.</p>
```

### 7. Invoice Email

**Subject**: Your Invoice #[INVOICE_ID]

**Template**:
```html
<h1>Invoice</h1>

<h2>Invoice Details</h2>
- Invoice Number: [INVOICE_ID]
- Order Number: [ORDER_ID]
- Invoice Date: [DATE]
- Due Date: [DUE_DATE]

<h2>Bill To</h2>
[CUSTOMER_ADDRESS]

<h2>Items</h2>
| Item | Qty | Unit Price | Total |
|------|-----|-----------|-------|
[ITEMS_TABLE]

<h2>Summary</h2>
- Subtotal: ₹[SUBTOTAL]
- Shipping: ₹[SHIPPING]
- Tax: ₹[TAX]
- **Total: ₹[TOTAL]**

<p><a href="[INVOICE_PDF_URL]">Download PDF</a></p>
```

### 8. Password Reset Email

**Subject**: Reset Your Eventrix Password

**Template**:
```html
<h1>Reset Your Password</h1>
<p>Hi [FIRST_NAME],</p>
<p>We received a request to reset your password. Click the link below to proceed.</p>

<p><a href="[RESET_LINK]">Reset Your Password</a></p>

<p>This link will expire in 24 hours.</p>

<p>If you didn't request this, please ignore this email.</p>
```

### 9. Review Request Email

**Subject**: How did we do? Share your feedback!

**Template**:
```html
<h1>We'd Love Your Feedback!</h1>
<p>Hi [FIRST_NAME],</p>
<p>Your order [ORDER_ID] has been delivered. How are you loving your custom prints?</p>

<p><a href="[REVIEW_URL]">Write a Review</a></p>

<p>Your reviews help us improve and help others make the right choice.</p>
```

## Email Configuration

### SMTP Settings
```
Server: smtp.gmail.com
Port: 587
Encryption: TLS
From Address: noreply@eventrix.com
```

### Send Grid Integration (Alternative)
```
API Key: SG.XXXXXXXXXXXX
From Email: noreply@eventrix.com
Template IDs configured in backend
```

## Email Sending Schedule

- **Immediately**: Registration, Order Confirmation, Payment Confirmation
- **Within 24 hours**: Design Ready, Shipping Notification
- **On Delivery**: Delivery Confirmation, Review Request
- **Scheduled**: Marketing emails, Promotional offers (if opted in)

## Unsubscribe Management

All emails include:
- Unsubscribe link
- Email preferences link
- Contact support link

## Testing Emails

Use Mailtrap or SendGrid testing for development:
```
Test SMTP: smtp.mailtrap.io
Test Account: [credentials]
