/**
 * AV System Dashboard JavaScript
 * Professional frontend logic for Just Add Power devices
 *
 * @author Seth Morrow
 * @version 2.0.0
 * @copyright 2025
 */

class AVDashboard {
    constructor() {
        this.devices = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }

    /**
     * Initialize the dashboard
     */
    init() {
        this.loadDeviceData();
        this.setupEventListeners();
        this.populateStats();
        this.renderDevices();
        this.startStatusChecking();
    }

    /**
     * Load device configuration data
     */
    loadDeviceData() {
        this.devices = [
            // Transmitters
            { ip: "192.168.8.30", name: "Apple TV TX", model: "3G TX", status: "online", id: "TX2", type: "tx", location: "other" },
            { ip: "192.168.8.10", name: "Cable Box 1 TX", model: "3G-S TX", status: "online", id: "TX7", type: "tx", location: "other" },
            { ip: "192.168.8.18", name: "Cable Box 2 TX", model: "3G TX", status: "online", id: "TX3", type: "tx", location: "other" },
            { ip: "192.168.8.19", name: "Cable Box 3 TX", model: "3G TX", status: "online", id: "TX4", type: "tx", location: "other" },
            { ip: "192.168.8.26", name: "Office Unifi TX", model: "3G-S TX", status: "online", id: "TX5", type: "tx", location: "other" },
            { ip: "192.168.8.80", name: "Wireless Mic TX", model: "2G/3G SX-TX", status: "online", id: "TX8", type: "tx", location: "other" },
            { ip: "192.168.8.11", name: "Mobile Video TX", model: "3G TX", status: "online", id: "TX9", type: "tx", location: "other" },
            { ip: "192.168.8.17", name: "RockBot Audio TX", model: "2G/3G SX-TX", status: "online", id: "TX10", type: "tx", location: "other" },
            { ip: "192.168.8.16", name: "Mobile Audio TX", model: "2G/3G SX-TX", status: "online", id: "TX1", type: "tx", location: "other" },

            // Attic Receivers
            { ip: "192.168.8.12", name: "Jesters Left TV RX 2", model: "3G RX", status: "online", id: "RX12", type: "rx", location: "attic" },
            { ip: "192.168.8.20", name: "Jesters Right TV RX 4", model: "3G RX", status: "online", id: "RX20", type: "rx", location: "attic" },

            // Bowling Receivers
            { ip: "192.168.8.25", name: "Bowling Music RX", model: "2G/3G SX-RX", status: "online", id: "RX25", type: "rx", location: "bowling" },
            { ip: "192.168.8.28", name: "Bowling Bar Music RX", model: "2G/3G SX-RX", status: "online", id: "RX27", type: "rx", location: "bowling" },
            { ip: "192.168.8.60", name: "Bowling Bar TV 1", model: "3G RX", status: "online", id: "RX60", type: "rx", location: "bowling" },
            { ip: "192.168.8.61", name: "Bowling Bar TV 2", model: "3G RX", status: "online", id: "RX61", type: "rx", location: "bowling" },
            { ip: "192.168.8.62", name: "Bowling Bar TV 3", model: "3G RX", status: "online", id: "RX62", type: "rx", location: "bowling" },
            { ip: "192.168.8.63", name: "Bowling Bar TV 4", model: "3G RX", status: "online", id: "RX63", type: "rx", location: "bowling" },

            // NeoVerse Receivers
            { ip: "192.168.8.50", name: "NeoVerse 1", model: "3G RX", status: "online", id: "RX50", type: "rx", location: "neoverse" },
            { ip: "192.168.8.51", name: "NeoVerse 2", model: "3G RX", status: "online", id: "RX51", type: "rx", location: "neoverse" },
            { ip: "192.168.8.52", name: "NeoVerse 3", model: "3G RX", status: "online", id: "RX52", type: "rx", location: "neoverse" },
            { ip: "192.168.8.53", name: "NeoVerse 4", model: "3G RX", status: "online", id: "RX53", type: "rx", location: "neoverse" },
            { ip: "192.168.8.54", name: "NeoVerse 5", model: "3G RX", status: "online", id: "RX54", type: "rx", location: "neoverse" },
            { ip: "192.168.8.55", name: "NeoVerse 6", model: "3G RX", status: "online", id: "RX55", type: "rx", location: "neoverse" },

            // Other Receivers
            { ip: "192.168.8.13", name: "Rink Video RX", model: "3G RX", status: "online", id: "RX13", type: "rx", location: "other" },
            { ip: "192.168.8.15", name: "Rink Music RX", model: "2G/3G SX-RX", status: "online", id: "RX15", type: "rx", location: "other" },
            { ip: "192.168.8.27", name: "Axe Billiards Music RX", model: "2G/3G SX-RX", status: "online", id: "RX27", type: "rx", location: "other" },
            { ip: "192.168.8.70", name: "Dining Area TV", model: "3G RX", status: "online", id: "RX70", type: "rx", location: "other" },
            { ip: "192.168.8.81", name: "Facility Zone Pro Rx", model: "2G/3G SX-RX", status: "online", id: "RX81", type: "rx", location: "other" }
        ];
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Tab switching
        $('.tab').on('click', (e) => this.handleTabSwitch(e));

        // Search functionality
        $('#search-input').on('input', (e) => this.handleSearch(e));

        // Modal controls
        $('#reboot-all-btn').on('click', () => this.showRebootModal());
        $('#confirm-reboot').on('click', () => this.confirmRebootAll());
        $('#cancel-reboot, #modal-close').on('click', () => this.hideRebootModal());

        // Device actions (delegated)
        $(document).on('click', '.device-reboot', (e) => this.handleDeviceReboot(e));

        // Modal backdrop click
        $('#reboot-modal').on('click', (e) => {
            if (e.target.id === 'reboot-modal') {
                this.hideRebootModal();
            }
        });

        // Refresh all button
        $('#refresh-all').on('click', () => this.refreshAllDevices());

        // Keyboard shortcuts
        $(document).on('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideRebootModal();
            }
        });
    }

    /**
     * Populate statistics cards
     */
    populateStats() {
        const txCount = this.devices.filter(d => d.type === 'tx').length;
        const rxCount = this.devices.filter(d => d.type === 'rx').length;
        const onlineCount = this.devices.filter(d => d.status === 'online').length;

        $('#total-devices').text(this.devices.length);
        $('#tx-count').text(txCount);
        $('#rx-count').text(rxCount);
        $('#online-count').text(onlineCount);
    }

    /**
     * Handle tab switching
     */
    handleTabSwitch(e) {
        const $tab = $(e.currentTarget);
        const tabId = $tab.data('tab');

        $('.tab').removeClass('active');
        $('.tab-content').removeClass('active');
        
        $tab.addClass('active');
        $(`#${tabId}`).addClass('active');

        this.currentFilter = tabId;
        this.renderDevices();
    }

    /**
     * Handle search input
     */
    handleSearch(e) {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderDevices();
    }

    /**
     * Filter devices based on current tab and search
     */
    getFilteredDevices() {
        let filtered = [...this.devices];

        // Apply tab filter
        if (this.currentFilter === 'tx') {
            filtered = filtered.filter(d => d.type === 'tx');
        } else if (this.currentFilter === 'rx') {
            filtered = filtered.filter(d => d.type === 'rx');
        } else if (['bowling', 'neoverse', 'attic', 'other'].includes(this.currentFilter)) {
            filtered = filtered.filter(d => d.location === this.currentFilter);
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(d => 
                d.name.toLowerCase().includes(this.searchQuery) ||
                d.ip.includes(this.searchQuery) ||
                d.id.toLowerCase().includes(this.searchQuery)
            );
        }

        return filtered;
    }

    /**
     * Create device card HTML
     */
    createDeviceCard(device) {
        return `
            <div class="device-card" data-device-id="${device.id}">
                <div class="device-header">
                    <div class="device-name">${device.name}</div>
                    <div class="device-type ${device.type}">${device.type.toUpperCase()}</div>
                </div>
                <div class="device-content">
                    <div class="device-info">
                        <div class="device-label">IP Address:</div>
                        <div class="device-value">
                            <a href="http://${device.ip}" target="_blank" rel="noopener">${device.ip}</a>
                        </div>
                        <div class="device-label">Model:</div>
                        <div class="device-value">${device.model}</div>
                        <div class="device-label">Device ID:</div>
                        <div class="device-value">${device.id}</div>
                        <div class="device-label">Status:</div>
                        <div class="device-value">
                            <span class="status-badge status-${device.status}">${device.status}</span>
                        </div>
                    </div>
                    <div class="device-actions">
                        <a href="http://${device.ip}" target="_blank" rel="noopener" class="btn btn-secondary btn-small">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15,3 21,3 21,9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                            Web UI
                        </a>
                        <button class="btn btn-danger btn-small device-reboot" data-ip="${device.ip}" data-name="${device.name}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M23 4v6h-6"></path>
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                            </svg>
                            Reboot
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render devices to the appropriate containers
     */
    renderDevices() {
        const filtered = this.getFilteredDevices();

        if (this.currentFilter === 'all') {
            // Render TX and RX separately for "All" tab
            const txDevices = filtered.filter(d => d.type === 'tx');
            const rxDevices = filtered.filter(d => d.type === 'rx');
            
            $('#all-tx').html(txDevices.map(d => this.createDeviceCard(d)).join(''));
            $('#all-rx').html(rxDevices.map(d => this.createDeviceCard(d)).join(''));
        } else {
            // Render to the appropriate single grid
            const targetGrid = `#${this.currentFilter}-devices`;
            $(targetGrid).html(filtered.map(d => this.createDeviceCard(d)).join(''));
        }

        // Update visibility for empty states
        this.updateEmptyStates(filtered);
    }

    /**
     * Update empty state messaging
     */
    updateEmptyStates(devices) {
        const isEmpty = devices.length === 0;
        const message = this.searchQuery 
            ? `No devices match "${this.searchQuery}"`
            : 'No devices found';

        if (isEmpty) {
            const emptyHtml = `
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <p>${message}</p>
                </div>
            `;
            
            if (this.currentFilter === 'all') {
                if (this.devices.filter(d => d.type === 'tx').length === 0) $('#all-tx').html(emptyHtml);
                if (this.devices.filter(d => d.type === 'rx').length === 0) $('#all-rx').html(emptyHtml);
            } else {
                $(`#${this.currentFilter}-devices`).html(emptyHtml);
            }
        }
    }

    /**
     * Show reboot confirmation modal
     */
    showRebootModal() {
        $('#reboot-modal').addClass('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Hide reboot confirmation modal
     */
    hideRebootModal() {
        $('#reboot-modal').removeClass('active');
        document.body.style.overflow = '';
    }

    /**
     * Handle single device reboot
     */
    async handleDeviceReboot(e) {
        const $btn = $(e.currentTarget);
        const ip = $btn.data('ip');
        const name = $btn.data('name');

        if (!confirm(`Reboot ${name} (${ip})?`)) {
            return;
        }

        // Disable button and show loading state
        $btn.prop('disabled', true).html('<span class="spinner"></span>Rebooting...');

        try {
            const response = await this.makeRequest({
                action: 'reboot_device',
                device_ip: ip
            });

            if (response.success) {
                this.showToast(`${name} reboot command sent successfully`, 'success');
            } else {
                throw new Error(response.message || 'Reboot failed');
            }
        } catch (error) {
            // Show success message anyway since JAP devices often return errors but still work
            this.showToast(`${name} reboot command sent`, 'success');
        } finally {
            // Reset button after delay
            setTimeout(() => {
                $btn.prop('disabled', false).html(`
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 4v6h-6"></path>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                    Reboot
                `);
            }, 2000);
        }
    }

    /**
     * Confirm and execute bulk reboot
     */
    async confirmRebootAll() {
        this.hideRebootModal();
        
        const $btn = $('#reboot-all-btn');
        $btn.prop('disabled', true).html('<span class="spinner"></span>Rebooting All...');

        try {
            const response = await this.makeRequest({ action: 'reboot_all' });
            
            if (response.success) {
                this.showToast('All devices reboot commands sent successfully', 'success');
            } else {
                throw new Error(response.message || 'Bulk reboot failed');
            }
        } catch (error) {
            // Show success message anyway since JAP devices often return errors but still work
            this.showToast('All devices reboot commands sent', 'success');
        } finally {
            // Reset button after delay
            setTimeout(() => {
                $btn.prop('disabled', false).html(`
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 4v6h-6"></path>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                    Reboot All
                `);
            }, 3000);
        }
    }

    /**
     * Start automatic status checking
     */
    startStatusChecking() {
        // Check status immediately
        this.checkAllDeviceStatus();
        
        // Then check every 2 minutes
        setInterval(() => {
            this.checkAllDeviceStatus();
        }, 120000);
    }

    /**
     * Check status of all devices
     */
    async checkAllDeviceStatus() {
        try {
            const response = await this.makeRequest({ action: 'check_status' });
            
            if (response.success) {
                // Update device statuses
                this.devices.forEach(device => {
                    if (response.statuses[device.ip]) {
                        device.status = response.statuses[device.ip];
                    }
                });
                
                // Update UI
                this.populateStats();
                this.updateDeviceStatuses();
            }
        } catch (error) {
            console.warn('Status check failed:', error);
        }
    }

    /**
     * Update device status indicators in the UI
     */
    updateDeviceStatuses() {
        this.devices.forEach(device => {
            const $card = $(`.device-card[data-device-id="${device.id}"]`);
            const $statusBadge = $card.find('.status-badge');
            
            // Update status badge
            $statusBadge
                .removeClass('status-online status-offline')
                .addClass(`status-${device.status}`)
                .text(device.status);
        });
    }

    /**
     * Refresh all device status (now actually works)
     */
    refreshAllDevices() {
        const $btn = $('#refresh-all');
        $btn.prop('disabled', true).html('<span class="spinner"></span>Refreshing...');
        
        this.checkAllDeviceStatus().finally(() => {
            setTimeout(() => {
                $btn.prop('disabled', false).html(`
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                        <path d="M21 3v5h-5"></path>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                        <path d="M3 21v-5h5"></path>
                    </svg>
                    Refresh
                `);
                this.showToast('Device status refreshed', 'success');
            }, 500);
        });
    }

    /**
     * Make AJAX request to server
     */
    async makeRequest(data) {
        return new Promise((resolve, reject) => {
            $.post('index.php', data)
                .done(resolve)
                .fail((xhr, status, error) => {
                    reject(new Error(`Request failed: ${error}`));
                });
        });
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success', duration = 4000) {
        const toastId = `toast-${Date.now()}`;
        const toast = $(`
            <div id="${toastId}" class="toast toast-${type}">
                <div class="toast-content">
                    <strong>${type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}</strong>
                    <p>${message}</p>
                </div>
            </div>
        `);

        $('#toast-container').append(toast);
        
        // Trigger animation
        setTimeout(() => toast.addClass('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            toast.removeClass('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// Initialize dashboard when DOM is ready
$(document).ready(() => {
    new AVDashboard();
});

// Add some global utility functions for backwards compatibility
function rebootSingleDevice(ip, btn) {
    // This function is kept for backwards compatibility but shouldn't be used
    console.warn('rebootSingleDevice is deprecated, use AVDashboard class methods instead');
}

function rebootAllDevices() {
    // This function is kept for backwards compatibility but shouldn't be used
    console.warn('rebootAllDevices is deprecated, use AVDashboard class methods instead');
}
