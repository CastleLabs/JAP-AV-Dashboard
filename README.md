# AV System Dashboard

A professional web-based control interface for monitoring and managing Just Add Power (JAP) devices at Castle Fun Center. This dashboard provides centralized control over many networked AV devices including transmitters and receivers across multiple entertainment zones.

## 🎯 Overview

The AV System Dashboard is designed specifically for Castle Fun Center's entertainment facility, providing real-time monitoring and control of Just Add Power devices distributed across bowling areas, NeoVerse gaming zones, dining areas, and attic installations. The system enables facility staff to monitor device status, perform individual or bulk reboots, and maintain optimal AV performance across all zones.

## ✨ Features

### Core Functionality
- **Real-time Device Monitoring** - Live status checking with automatic updates every 2 minutes
- **Individual Device Control** - Reboot specific devices with confirmation dialogs
- **Bulk Operations** - Reboot all devices simultaneously with safety confirmations
- **Device Status Tracking** - Visual indicators for online/offline status
- **Web Interface Access** - Direct links to each device's web management interface

### User Interface
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Location-based Filtering** - Organize devices by physical location (Bowling, NeoVerse, Attic, etc.)
- **Device Type Filtering** - Separate views for transmitters (TX) and receivers (RX)
- **Real-time Search** - Filter devices by name, IP address, or device ID
- **Dark Theme** - Professional dark interface optimized for control room environments

### System Management
- **Comprehensive Statistics** - Dashboard showing total devices, TX/RX counts, and online status
- **Toast Notifications** - Real-time feedback for all operations
- **Error Handling** - Graceful handling of network timeouts and device errors
- **Safety Confirmations** - Prevent accidental bulk operations

## 🏗️ Architecture

### Backend (PHP)
- **Object-oriented PHP 8.0+** with strict typing
- **RESTful API endpoints** for device operations
- **Intelligent error handling** for JAP device quirks
- **Rate limiting** to prevent network flooding
- **Input validation** and security measures

### Frontend (JavaScript/jQuery)
- **ES6+ JavaScript** with class-based architecture
- **jQuery** for DOM manipulation and AJAX requests
- **Responsive CSS Grid** layouts
- **Modern CSS** with custom properties and animations

### Styling (CSS)
- **Custom CSS framework** with design system
- **CSS Grid and Flexbox** for responsive layouts
- **CSS Custom Properties** for consistent theming
- **Professional color palette** optimized for control interfaces

## 📋 Requirements

### Server Requirements
- **PHP 8.0+** with cURL extension enabled
- **Web server** (Apache, Nginx, or similar)
- **Network access** to Just Add Power devices (192.168.8.x subnet)

### Browser Requirements
- **Modern web browser** with ES6+ support
- **JavaScript enabled**
- **Network connectivity** to server

### Network Requirements
- **Local network access** to JAP devices
- **Devices accessible** via HTTP on standard ports
- **Stable network connection** for real-time monitoring

## 🚀 Installation

### 1. Download Files
```bash
git clone [repository-url]
cd av-system-dashboard
```

### 2. Server Setup
Upload the following files to your web server:
- `index.php` - Main application file
- `script.js` - Frontend JavaScript logic
- `styles.css` - Application styles

### 3. Configure Web Server
Ensure your web server has:
- PHP 8.0+ enabled
- cURL extension loaded
- Proper file permissions set

### 4. Network Configuration
Verify network connectivity:
```bash
# Test connectivity to a sample device
curl -I http://192.168.8.25
```

### 5. Access Dashboard
Navigate to your installation URL in a web browser.

## 🎮 Device Configuration

The system monitors the following Just Add Power devices:

### Transmitters (9 devices)
- **Apple TV TX** (192.168.8.30) - 3G TX
- **Cable Box 1 TX** (192.168.8.10) - 3G-S TX
- **Cable Box 2 TX** (192.168.8.18) - 3G TX
- **Cable Box 3 TX** (192.168.8.19) - 3G TX
- **Office Unifi TX** (192.168.8.26) - 3G-S TX
- **Wireless Mic TX** (192.168.8.80) - 2G/3G SX-TX
- **Mobile Video TX** (192.168.8.11) - 3G TX
- **RockBot Audio TX** (192.168.8.17) - 2G/3G SX-TX
- **Mobile Audio TX** (192.168.8.16) - 2G/3G SX-TX

### Receivers by Location

#### Bowling Area (6 devices)
- **Bowling Music RX** (192.168.8.25) - 2G/3G SX-RX
- **Bowling Bar Music RX** (192.168.8.28) - 2G/3G SX-RX
- **Bowling Bar TV 1-4** (192.168.8.60-63) - 3G RX

#### NeoVerse Gaming (6 devices)
- **NeoVerse 1-6** (192.168.8.50-55) - 3G RX

#### Attic Installation (2 devices)
- **Jesters Left TV RX 2** (192.168.8.12) - 3G RX
- **Jesters Right TV RX 4** (192.168.8.20) - 3G RX

#### Other Locations (5 devices)
- **Rink Video/Music RX** (192.168.8.13, 192.168.8.15)
- **Axe Billiards Music RX** (192.168.8.27)
- **Dining Area TV** (192.168.8.70)
- **Facility Zone Pro Rx** (192.168.8.81)

## 🔧 Usage

### Dashboard Navigation
1. **All Devices** - Complete system overview with TX/RX sections
2. **Transmitters** - View only transmission devices
3. **Receivers** - View only receiving devices
4. **Location Tabs** - Filter by physical zones (Bowling, NeoVerse, Attic, Other)

### Device Operations
- **View Device** - Click IP address to open device web interface
- **Reboot Device** - Click "Reboot" button with confirmation dialog
- **Reboot All** - Use header button to restart entire system
- **Refresh Status** - Update all device statuses manually

### Search and Filter
- Use the search box to find devices by name, IP, or ID
- Combine location filters with search for precise results
- Real-time filtering as you type

## ⚙️ Configuration

### Adding New Devices
To add devices, modify two locations:

#### 1. Backend (index.php)
```php
private const DEVICES = [
    "192.168.8.25", // Add new IP addresses here
    "192.168.8.NEW", // New device IP
    // ... existing devices
];
```

#### 2. Frontend (script.js)
```javascript
this.devices = [
    { 
        ip: "192.168.8.NEW", 
        name: "New Device Name", 
        model: "3G RX", 
        status: "online", 
        id: "RXNEW", 
        type: "rx", 
        location: "other" 
    },
    // ... existing devices
];
```

### Customizing Timeouts
Modify timeout values in `index.php`:
```php
private const REQUEST_TIMEOUT = 3; // HTTP timeout in seconds
private const THROTTLE_DELAY = 250000; // Delay between requests (microseconds)
```

### Styling Customization
Modify CSS custom properties in `styles.css`:
```css
:root {
    --color-primary: #2563eb; /* Primary brand color */
    --color-background: #0f172a; /* Background color */
    /* ... other variables */
}
```

## 🔍 API Endpoints

The dashboard exposes these internal API endpoints:

### POST `/index.php`
- **reboot_device** - Reboot single device
  ```json
  {
    "action": "reboot_device",
    "device_ip": "192.168.8.25"
  }
  ```

- **reboot_all** - Reboot all devices
  ```json
  {
    "action": "reboot_all"
  }
  ```

- **check_status** - Check all device status
  ```json
  {
    "action": "check_status"
  }
  ```

## 🛠️ Troubleshooting

### Common Issues

#### Devices Show Offline
- Verify network connectivity between server and devices
- Check if device IP addresses have changed
- Ensure devices are powered on and network cables connected

#### Reboot Commands Fail
- JAP devices often return HTTP errors but still execute commands
- Check device web interface directly to confirm reboot
- Network timeouts are normal and don't indicate failure

#### Dashboard Not Loading
- Verify PHP and cURL are properly installed
- Check web server error logs
- Ensure proper file permissions

#### Slow Performance
- Reduce status check frequency (modify JavaScript interval)
- Optimize network connection to devices
- Consider server hardware upgrade for large installations

### Network Diagnostics
```bash
# Test device connectivity
ping 192.168.8.25

# Test HTTP access
curl -I http://192.168.8.25

# Check network route
traceroute 192.168.8.25
```

## 🔒 Security Considerations

- **Network Isolation** - Deploy on isolated management network
- **Access Control** - Implement authentication if needed
- **HTTPS** - Use SSL/TLS for production deployments
- **Input Validation** - All inputs are validated and sanitized
- **Rate Limiting** - Built-in throttling prevents abuse

## 📚 Technical Details

### Just Add Power Integration
The system interfaces with JAP devices using their HTTP API:
- **Endpoint**: `/cgi-bin/api/command/cli`
- **Method**: POST with `reboot` command
- **Content-Type**: `text/plain`

### Browser Compatibility
- **Chrome/Chromium 90+**
- **Firefox 88+**
- **Safari 14+**
- **Edge 90+**

### Performance Metrics
- **Load Time**: < 2 seconds on local network
- **Device Response**: 1-3 seconds per device
- **Bulk Operations**: ~30 seconds for all devices
- **Status Updates**: Every 2 minutes automatically

## 🤝 Contributing

### Development Setup
1. Clone repository
2. Set up local web server with PHP 8.0+
3. Configure test network with mock devices
4. Follow coding standards (PSR-12 for PHP, ES6+ for JavaScript)

### Code Style
- **PHP**: PSR-12 standard with strict typing
- **JavaScript**: ES6+ with consistent formatting
- **CSS**: BEM methodology with custom properties

## 📄 License

Copyright 2025 Seth Morrow. All rights reserved.

## 📞 Support

For technical support or feature requests:
- Review troubleshooting section above
- Check device documentation for JAP-specific issues
- Verify network connectivity and server configuration

---

**Built specifically for Castle Fun Center's AV infrastructure management.**
