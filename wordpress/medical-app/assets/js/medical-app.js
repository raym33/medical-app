jQuery(document).ready(function($) {
    // Tab switching
    $('.nav-tab').on('click', function(e) {
        e.preventDefault();
        const target = $(this).attr('href').substring(1);
        
        $('.nav-tab').removeClass('nav-tab-active');
        $(this).addClass('nav-tab-active');
        
        $('.tab-content').removeClass('active');
        $(`#${target}`).addClass('active');
    });

    // Load dashboard stats
    function loadDashboardStats() {
        $.ajax({
            url: `${medicalAppConfig.apiUrl}/stats`,
            headers: {
                'X-WP-Nonce': medicalAppConfig.nonce
            },
            success: function(response) {
                $('#total-patients').text(response.totalPatients);
                $('#todays-appointments').text(response.todayAppointments);
            },
            error: function() {
                showError('Failed to load dashboard stats');
            }
        });
    }

    // Load patients list
    function loadPatients() {
        $.ajax({
            url: `${medicalAppConfig.apiUrl}/patients`,
            headers: {
                'X-WP-Nonce': medicalAppConfig.nonce
            },
            success: function(response) {
                const tbody = $('#patients-list');
                tbody.empty();
                
                response.forEach(function(patient) {
                    tbody.append(`
                        <tr>
                            <td>${patient.name}</td>
                            <td>${patient.email}</td>
                            <td>${patient.phone}</td>
                            <td>${patient.lastVisit}</td>
                            <td>
                                <button class="button view-patient" data-id="${patient.id}">
                                    View
                                </button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function() {
                showError('Failed to load patients');
            }
        });
    }

    // Save settings
    $('#medical-app-settings').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            api_url: $('#api_url').val(),
            api_key: $('#api_key').val()
        };

        $.ajax({
            url: ajaxurl,
            method: 'POST',
            data: {
                action: 'save_medical_app_settings',
                nonce: medicalAppConfig.nonce,
                settings: formData
            },
            success: function(response) {
                if (response.success) {
                    showSuccess('Settings saved successfully');
                } else {
                    showError('Failed to save settings');
                }
            },
            error: function() {
                showError('Failed to save settings');
            }
        });
    });

    function showError(message) {
        $('<div class="notice notice-error"><p>' + message + '</p></div>')
            .insertAfter('.medical-app-container')
            .delay(3000)
            .fadeOut();
    }

    function showSuccess(message) {
        $('<div class="notice notice-success"><p>' + message + '</p></div>')
            .insertAfter('.medical-app-container')
            .delay(3000)
            .fadeOut();
    }

    // Initial load
    loadDashboardStats();
    loadPatients();
});