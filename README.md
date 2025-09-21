# Instagram DM Message Deleter

Advanced JavaScript automation tool for bulk deletion of your sent Instagram direct messages with intelligent UI detection and multi-language support.

---

### ⚙️ How It Works

- **Smart Message Detection**: Automatically identifies and targets your sent messages using multiple detection patterns
- **Dynamic UI Navigation**: Intelligently locates three-dot menu buttons across Instagram's evolving interface
- **Multi-Language Support**: Works seamlessly in Turkish, English, German, French, Spanish, Italian, Chinese, Japanese, Russian, and Polish
- **Safe Deletion Process**: Carefully finds and clicks confirmation buttons for secure message removal
- **Bottom-Up Processing**: Starts deletion from the most recent messages, working upward through conversation history
- **Robust Error Handling**: Includes fallback mechanisms for various UI scenarios and edge cases
- **Real-Time Feedback**: Provides detailed console logging for monitoring deletion progress

---

## 📁 Setup

### 1. Prerequisites

- **Web Browser**: Chrome, Firefox, Safari, or any modern browser
- **Instagram Web Access**: Login to Instagram.com with target account
- **Developer Console**: Access to browser's developer tools (F12)

### 2. Browser Requirements

- **JavaScript Enabled**: Script execution must be permitted
- **Instagram Session**: Must be logged into the target Instagram account
- **Direct Message Access**: Navigate to the specific DM conversation before running

---

### 🚀 Usage

1. **Open Instagram Web**: Navigate to instagram.com and log in
2. **Select Conversation**: Open the DM conversation you want to clean
3. **Open Developer Console**: Press F12 and go to Console tab
4. **Paste and Execute**: Copy the script and paste into console, then press Enter
5. **Monitor Progress**: Watch real-time deletion progress in console logs

#### 📊 Console Output Example
```
🚀 Starting Instagram DM message deletion...
📍 Deleting messages from bottom to top
🔄 Attempt #1
📍 Found 15 messages, starting with the bottom one
✅ Three dots found (SVG with 3 circles)
✅ Unsend option found: "unsend"
✅ Popup confirm button found: "Unsend"
🎉 Message #1 deleted successfully!
```

---

### 🔧 Technical Features

- **Advanced Element Detection**: Multiple fallback strategies for finding UI elements
- **Event Simulation**: Comprehensive mouse, touch, and keyboard event simulation
- **Dynamic Delay System**: Smart timing adjustments for different network conditions
- **Multi-Method Clicking**: Various click simulation techniques for maximum compatibility
- **Scroll Management**: Automatic scrolling to ensure message visibility
- **Menu State Detection**: Intelligent detection of opened context menus
- **Cross-Browser Compatibility**: Works across different browser engines

---

### 🌐 Language Detection Patterns

The script automatically detects and works with these interface languages:

- **English**: "You sent", "Unsend", "Delete message"
- **Turkish**: "Sen gönderdin", "Gönderimi geri al", "Mesajı sil"
- **German**: "Du hast gesendet", "Nachricht löschen"
- **French**: "Vous avez envoyé", "Supprimer le message"
- **Spanish**: "Enviaste", "Eliminar mensaje"
- **Italian**: "Hai inviato"
- **Chinese**: "你发送了", "更多选项"
- **Japanese**: "あなたが送信", "その他のオプション"
- **Russian**: "Вы отправили", "Удалить сообщение"
- **Polish**: "Wysłałeś", "Usuń wiadomość"

---

### 📋 Safety Features

- **Maximum Attempt Limit**: Prevents infinite loops with 500 attempt cap
- **Progress Breaks**: Automatic pauses every 5 deletions to avoid rate limiting
- **Error Recovery**: Graceful handling of UI changes and network issues
- **User Cancellation**: Easy cancellation by refreshing the page
- **Visual Feedback**: Opacity changes on processed messages for user awareness

---

### ⚠️ Important Notes

- **Use Responsibly**: Only delete your own messages in conversations you participate in
- **Rate Limiting**: Instagram may impose temporary restrictions on rapid actions
- **UI Changes**: Instagram frequently updates their interface; script includes multiple fallback methods
- **Browser Console**: This tool runs entirely in your browser and doesn't send data externally
- **Backup Important Messages**: Consider saving important conversations before bulk deletion

---

### 🛠️ Troubleshooting

**Script Not Working?**
- Ensure you're on instagram.com (not mobile app)
- Check that JavaScript is enabled
- Try refreshing the page and running again
- Verify you're in a direct message conversation

**Messages Not Deleting?**
- Check console for error messages
- Try running script on a different browser
- Ensure Instagram interface language is supported
- Wait a few minutes if rate limited

---

### 📊 Supported Actions

- **🗑️ Message Deletion**: Bulk removal of sent messages
- **🔍 Smart Detection**: Automatic identification of deletable content  
- **📱 Responsive Design**: Works on both desktop and mobile web interfaces
- **🔄 Progress Tracking**: Real-time deletion count and status updates

---

### ⚠️ Disclaimer

This tool is designed for personal use to manage your own Instagram direct messages. It operates entirely within your browser and follows Instagram's standard web interface interactions. Users are responsible for complying with Instagram's Terms of Service. The developer is not responsible for any account restrictions or data loss resulting from the use of this tool.
