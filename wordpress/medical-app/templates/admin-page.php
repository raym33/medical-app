<div class="wrap">
    <h1>Medical App Integration</h1>
    
    <div class="medical-app-container">
        <div class="medical-app-tabs">
            <nav class="nav-tab-wrapper">
                <a href="#dashboard" class="nav-tab nav-tab-active">Dashboard</a>
                <a href="#patients" class="nav-tab">Patients</a>
                <a href="#settings" class="nav-tab">Settings</a>
            </nav>
        </div>

        <div class="medical-app-content">
            <div id="dashboard" class="tab-content active">
                <div class="medical-app-stats">
                    <div class="stat-box">
                        <h3>Total Patients</h3>
                        <div class="stat-value" id="total-patients">Loading...</div>
                    </div>
                    <div class="stat-box">
                        <h3>Today's Appointments</h3>
                        <div class="stat-value" id="todays-appointments">Loading...</div>
                    </div>
                </div>
            </div>

            <div id="patients" class="tab-content">
                <div class="medical-app-table-container">
                    <table class="wp-list-table widefat fixed striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Last Visit</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="patients-list">
                            <tr>
                                <td colspan="5">Loading patients...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="settings" class="tab-content">
                <form id="medical-app-settings">
                    <table class="form-table">
                        <tr>
                            <th scope="row">
                                <label for="api_url">API URL</label>
                            </th>
                            <td>
                                <input type="text" id="api_url" name="api_url" class="regular-text" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="api_key">API Key</label>
                            </th>
                            <td>
                                <input type="password" id="api_key" name="api_key" class="regular-text" />
                            </td>
                        </tr>
                    </table>
                    <p class="submit">
                        <button type="submit" class="button button-primary">Save Settings</button>
                    </p>
                </form>
            </div>
        </div>
    </div>
</div>