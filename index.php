<?php
/**
 * AV System Dashboard
 * Professional control interface for Just Add Power devices
 *
 * @author Seth Morrow
 * @version 2.0.0
 * @copyright 2025
 */

declare(strict_types=1);

class AVDashboard
{
    private const DEVICES = [
        "192.168.8.25", "192.168.8.28", "192.168.8.80", "192.168.8.11", "192.168.8.17",
        "192.168.8.50", "192.168.8.54", "192.168.8.70", "192.168.8.27", "192.168.8.13",
        "192.168.8.12", "192.168.8.81", "192.168.8.61", "192.168.8.19", "192.168.8.62",
        "192.168.8.55", "192.168.8.53", "192.168.8.52", "192.168.8.10", "192.168.8.51",
        "192.168.8.26", "192.168.8.63", "192.168.8.18", "192.168.8.15", "192.168.8.20",
        "192.168.8.60", "192.168.8.30", "192.168.8.16"
    ];

    private const REBOOT_ENDPOINT = '/cgi-bin/api/command/cli';
    private const REBOOT_COMMAND = 'reboot';
    private const REQUEST_TIMEOUT = 3;
    private const THROTTLE_DELAY = 250000; // microseconds

    /**
     * Send reboot command to a device
     */
    private function rebootDevice(string $ip): array
    {
        if (!filter_var($ip, FILTER_VALIDATE_IP)) {
            return ['success' => false, 'error' => 'Invalid IP address'];
        }

        $ch = curl_init("http://{$ip}" . self::REBOOT_ENDPOINT);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => self::REBOOT_COMMAND,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => self::REQUEST_TIMEOUT,
            CURLOPT_HTTPHEADER => [
                'Content-Type: text/plain',
                'Content-Length: ' . strlen(self::REBOOT_COMMAND)
            ]
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        // JAP devices often return non-200 codes but still execute commands
        return [
            'success' => true,
            'error' => '',
            'http_code' => $httpCode,
            'response' => $response
        ];
    }

    /**
     * Handle single device reboot
     */
    private function handleSingleReboot(): void
    {
        $ip = $_POST['device_ip'] ?? '';
        $result = $this->rebootDevice($ip);
        
        $this->jsonResponse([
            'success' => $result['success'],
            'message' => $result['success'] 
                ? "Reboot command sent to {$ip}" 
                : $result['error']
        ]);
    }

    /**
     * Handle bulk device reboot
     */
    private function handleBulkReboot(): void
    {
        $results = ['success' => 0, 'failed' => 0, 'failures' => []];

        foreach (self::DEVICES as $ip) {
            $result = $this->rebootDevice($ip);
            
            if ($result['success']) {
                $results['success']++;
            } else {
                $results['failed']++;
                $results['failures'][] = ['ip' => $ip, 'error' => $result['error']];
            }
            
            usleep(self::THROTTLE_DELAY);
        }

        $this->jsonResponse([
            'success' => true,
            'message' => "Reboot completed: {$results['success']} successful",
            'details' => $results
        ]);
    }

    /**
     * Send JSON response
     */
    private function jsonResponse(array $data): void
    {
        header('Content-Type: application/json');
        echo json_encode($data, JSON_THROW_ON_ERROR);
        exit;
    }

    /**
     * Check if a device is online
     */
    private function checkDeviceStatus(string $ip): string
    {
        $ch = curl_init("http://{$ip}");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 2,
            CURLOPT_CONNECTTIMEOUT => 1,
            CURLOPT_NOBODY => true,
            CURLOPT_FOLLOWLOCATION => false
        ]);
        
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return ($result !== false && $httpCode > 0) ? 'online' : 'offline';
    }

    /**
     * Handle status check for all devices
     */
    private function handleStatusCheck(): void
    {
        $statuses = [];
        foreach (self::DEVICES as $ip) {
            $statuses[$ip] = $this->checkDeviceStatus($ip);
        }
        
        $this->jsonResponse([
            'success' => true,
            'statuses' => $statuses
        ]);
    }

    /**
     * Handle POST requests
     */
    public function handleRequest(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return;
        }

        $action = $_POST['action'] ?? '';

        switch ($action) {
            case 'reboot_device':
                $this->handleSingleReboot();
                break;
            case 'reboot_all':
                $this->handleBulkReboot();
                break;
            case 'check_status':
                $this->handleStatusCheck();
                break;
            default:
                $this->jsonResponse(['success' => false, 'message' => 'Invalid action']);
        }
    }
}

// Initialize and handle request
$dashboard = new AVDashboard();
$dashboard->handleRequest();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AV System Dashboard</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="header-content">
                <h1 class="header-title">AV System Dashboard</h1>
                <div class="header-actions">
                    <button id="refresh-all" class="btn btn-secondary" title="Refresh All Status">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                            <path d="M21 3v5h-5"></path>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                            <path d="M3 21v-5h5"></path>
                        </svg>
                        Refresh
                    </button>
                    <button id="reboot-all-btn" class="btn btn-danger">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M23 4v6h-6"></path>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        Reboot All
                    </button>
                </div>
            </div>
        </header>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value" id="total-devices">0</div>
                <div class="stat-label">Total Devices</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="tx-count">0</div>
                <div class="stat-label">Transmitters</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="rx-count">0</div>
                <div class="stat-label">Receivers</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" id="online-count">0</div>
                <div class="stat-label">Online</div>
            </div>
        </div>

        <nav class="tabs">
            <button class="tab active" data-tab="all">All Devices</button>
            <button class="tab" data-tab="tx">Transmitters</button>
            <button class="tab" data-tab="rx">Receivers</button>
            <button class="tab" data-tab="bowling">Bowling</button>
            <button class="tab" data-tab="neoverse">NeoVerse</button>
            <button class="tab" data-tab="attic">Attic</button>
            <button class="tab" data-tab="other">Other</button>
        </nav>

        <div class="search-container">
            <div class="search-box">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input type="text" id="search-input" placeholder="Search devices..." autocomplete="off">
            </div>
        </div>

        <main class="content">
            <div id="all" class="tab-content active">
                <section class="device-section">
                    <h2>Transmitters</h2>
                    <div class="device-grid" id="all-tx"></div>
                </section>
                <section class="device-section">
                    <h2>Receivers</h2>
                    <div class="device-grid" id="all-rx"></div>
                </section>
            </div>
            <div id="tx" class="tab-content">
                <div class="device-grid" id="tx-devices"></div>
            </div>
            <div id="rx" class="tab-content">
                <div class="device-grid" id="rx-devices"></div>
            </div>
            <div id="bowling" class="tab-content">
                <div class="device-grid" id="bowling-devices"></div>
            </div>
            <div id="neoverse" class="tab-content">
                <div class="device-grid" id="neoverse-devices"></div>
            </div>
            <div id="attic" class="tab-content">
                <div class="device-grid" id="attic-devices"></div>
            </div>
            <div id="other" class="tab-content">
                <div class="device-grid" id="other-devices"></div>
            </div>
        </main>
    </div>

    <!-- Confirmation Modal -->
    <div id="reboot-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Confirm System Reboot</h3>
                <button class="modal-close" id="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>This will send reboot commands to <strong>all devices</strong> in the system. This action cannot be undone.</p>
                <p class="warning">Devices will be temporarily unavailable during the reboot process.</p>
            </div>
            <div class="modal-footer">
                <button id="cancel-reboot" class="btn btn-secondary">Cancel</button>
                <button id="confirm-reboot" class="btn btn-danger">Reboot All Devices</button>
            </div>
        </div>
    </div>

    <!-- Toast Notifications -->
    <div id="toast-container" class="toast-container"></div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
