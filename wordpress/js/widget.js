(function($) {
    'use strict';

    class MedicalAppWidget {
        constructor(element) {
            this.element = element;
            this.init();
        }

        async init() {
            try {
                await this.checkAuth();
                this.render();
                this.attachEventListeners();
            } catch (error) {
                this.showError('Authentication failed');
            }
        }

        async checkAuth() {
            const response = await fetch(`${medicalAppConfig.apiUrl}/auth`, {
                headers: {
                    'X-WP-Nonce': medicalAppConfig.nonce
                }
            });
            
            if (!response.ok) {
                throw new Error('Authentication failed');
            }
        }

        render() {
            const template = `
                <div class="medical-app-widget">
                    <div class="medical-app-header">
                        <h3>Medical Dashboard</h3>
                    </div>
                    <div class="medical-app-content">
                        <input type="text" class="medical-app-input" placeholder="Search patients...">
                        <button class="medical-app-button" id="newPatient">New Patient</button>
                        <div id="patientList"></div>
                    </div>
                </div>
            `;
            
            this.element.html(template);
            this.loadPatients();
        }

        async loadPatients() {
            try {
                const response = await fetch(`${medicalAppConfig.apiUrl}/patients`, {
                    headers: {
                        'X-WP-Nonce': medicalAppConfig.nonce
                    }
                });
                
                const data = await response.json();
                this.renderPatients(data);
            } catch (error) {
                this.showError('Failed to load patients');
            }
        }

        renderPatients(patients) {
            const patientList = this.element.find('#patientList');
            patientList.empty();
            
            patients.forEach(patient => {
                patientList.append(`
                    <div class="patient-card">
                        <h4>${patient.name}</h4>
                        <p>${patient.email}</p>
                    </div>
                `);
            });
        }

        attachEventListeners() {
            this.element.find('#newPatient').on('click', () => {
                // Implement new patient form
            });

            this.element.find('.medical-app-input').on('input', (e) => {
                // Implement search functionality
            });
        }

        showError(message) {
            this.element.html(`
                <div class="medical-app-error">
                    ${message}
                </div>
            `);
        }
    }

    // Initialize widget when document is ready
    $(document).ready(function() {
        $('.medical-app-container').each(function() {
            new MedicalAppWidget($(this));
        });
    });

})(jQuery);