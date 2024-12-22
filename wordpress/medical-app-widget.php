<?php
/*
Plugin Name: Medical App Widget
Description: A widget for medical professionals to access patient records and AI diagnostics
Version: 1.0
Author: Your Name
*/

// Prevent direct access
if (!defined('ABSPATH')) exit;

class Medical_App_Widget extends WP_Widget {
    public function __construct() {
        parent::__construct(
            'medical_app_widget',
            'Medical App Widget',
            array('description' => 'Access medical records and AI diagnostics')
        );
    }

    public function widget($args, $instance) {
        echo $args['before_widget'];
        ?>
        <div id="medical-app-widget" class="medical-app-container">
            <div class="medical-app-loading">Loading...</div>
        </div>
        <?php
        echo $args['after_widget'];
        
        // Enqueue required scripts and styles
        wp_enqueue_script('medical-app-widget-js', plugins_url('js/widget.js', __FILE__), array('jquery'), '1.0', true);
        wp_enqueue_style('medical-app-widget-css', plugins_url('css/widget.css', __FILE__));
        
        // Pass configuration to JavaScript
        wp_localize_script('medical-app-widget-js', 'medicalAppConfig', array(
            'apiUrl' => esc_url(rest_url('medical-app/v1')),
            'nonce' => wp_create_nonce('wp_rest')
        ));
    }

    public function form($instance) {
        // Widget admin form
        $title = isset($instance['title']) ? $instance['title'] : 'Medical App';
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">Title:</label>
            <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" 
                   name="<?php echo $this->get_field_name('title'); ?>" type="text" 
                   value="<?php echo esc_attr($title); ?>">
        </p>
        <?php
    }

    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = strip_tags($new_instance['title']);
        return $instance;
    }
}

// Register the widget
function register_medical_app_widget() {
    register_widget('Medical_App_Widget');
}
add_action('widgets_init', 'register_medical_app_widget');

// Register REST API endpoints
function register_medical_app_api_routes() {
    register_rest_route('medical-app/v1', '/patients', array(
        'methods' => 'GET',
        'callback' => 'get_patients_endpoint',
        'permission_callback' => 'verify_doctor_access'
    ));
}
add_action('rest_api_init', 'register_medical_app_api_routes');

// API endpoint callbacks
function get_patients_endpoint($request) {
    // Implement patient data retrieval logic
    return new WP_REST_Response(array('status' => 'success'), 200);
}

function verify_doctor_access() {
    return current_user_can('edit_posts'); // Adjust permissions as needed
}