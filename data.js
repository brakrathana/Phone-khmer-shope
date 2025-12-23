// Send order to Telegram bot (FIXED VERSION)
function sendOrderToTelegram(orderData, orderId) {
    // Save cart data BEFORE clearing it
    const cartBeforeClear = getCart();
    const total = document.getElementById('total').textContent;
    
    // Telegram bot configuration from your contact form
    const TELEGRAM_BOT_TOKEN = '8403805443:AAE1O0WpgY_RCdWSP1H-HmClw-BDJbtU-7o';
    const TELEGRAM_CHAT_ID = '1179617605';
    
    // Create order details with actual cart data
    const orderDetails = {
        orderId: orderId,
        customer: orderData,
        items: cartBeforeClear, // This has items BEFORE clearCart()
        total: total,
        timestamp: new Date().toISOString()
    };
    
    console.log('Order sent to Telegram bot:', orderDetails);
    
    // Actually send to Telegram bot
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        // Create message for Telegram
        const message = createTelegramOrderMessage(orderData, orderId, cartBeforeClear, total);
        
        // Send to Telegram
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('✅ Order notification sent to Telegram successfully');
            } else {
                console.error('❌ Telegram notification failed:', data);
            }
        })
        .catch(error => {
            console.error('❌ Error sending to Telegram:', error);
        });
    }
}

// Helper function to create Telegram message
function createTelegramOrderMessage(orderData, orderId, cartItems, total) {
    const paymentMethod = getPaymentMethodName(orderData.payment);
    const orderTime = new Date().toLocaleString('en-US');
    
    // Calculate totals from cart items
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 10;
    const tax = subtotal * 0.10;
    
    // Build items list
    let itemsList = '';
    cartItems.forEach(item => {
        itemsList += `├ ${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    return `
🛒 <b>NEW ORDER - Phone Khmer Shop</b>
━━━━━━━━━━━━━━━━━━━━━━━

📋 <b>Order Information</b>
├ ID: <code>${orderId}</code>
├ Time: ${orderTime}
└ Method: ${paymentMethod}

👤 <b>Customer Details</b>
├ Name: ${escapeHTML(orderData.name)}
├ Phone: ${escapeHTML(orderData.phone)}
├ Email: ${escapeHTML(orderData.email)}
├ Address: ${escapeHTML(orderData.address)}
├ City: ${escapeHTML(orderData.city)}
└ District: ${escapeHTML(orderData.district)}

📦 <b>Order Items</b>
${itemsList}━━━━━━━━━━━━━━━━━━━━━━━
├ Subtotal: $${subtotal.toFixed(2)}
├ Shipping: $${shipping.toFixed(2)}
├ Tax: $${tax.toFixed(2)}
└ <b>Total: ${total}</b>
━━━━━━━━━━━━━━━━━━━━━━━
📝 <b>Notes:</b> ${orderData.notes || 'No notes provided'}
━━━━━━━━━━━━━━━━━━━━━━━
💡 <i>New order requires processing</i>
    `;
}

// Make sure escapeHTML function is available (add this if not exists)
if (typeof escapeHTML === 'undefined') {
    function escapeHTML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}