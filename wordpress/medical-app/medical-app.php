<?php
/*
Plugin Name: Medical App Integration
Description: Integration with the Next.js Medical App for patient management and AI diagnostics
Version: 1.0.0
Author: Your Name
*/

if (!defined('ABSPATH')) exit;

class Medical_App_Integration {
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    public function init() {
        $this->register_post_types();
        $this->register_scripts();
    }

    private function register_post_types() {
        register_post_type('medical_patient', array(
            'labels' => array(
                'name' => 'Patients',
                'singular_name' => 'Patient'
            ),
            'public' => true,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'custom-fields'),
            'menu_icon' => 'dashicons-heart'
        ));
    }

    private function register_scripts() {
        wp_register_script(
            'medical-app-js',
            plugins_url('assets/js/medical-app.js', __FILE__),
            array('jquery'),
            '1.0.0',
            true
        );

        wp_register_style(
            'medical-app-css',
            plugins_url('assets/css/medical-app.css', __FILE__),
            array(),
            '1.0.0'
        );
    }

    public function add_admin_menu() {
        add_menu_page(
            'Medical App',
            'Medical App',
            'manage_options',
            'medical-app',
            array($this, 'render_admin_page'),
            'dashicons-heart'
        );
    }

    public function render_admin_page() {
        wp_enqueue_script('medical-app-js');
        wp_enqueue_style('medical-app-css');
        
        include plugin_dir_path(__FILE__) . 'templates/admin-page.php';
    }

    public function register_rest_routes() {
        register_rest_route('medical-app/v1', '/patients', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_patients'),
            'permission_callback' => array($this, 'verify_doctor_access')
        ));

        register_rest_route('medical-app/v1', '/sync', array(
            'methods' => 'POST',
            'callback' => array($this, 'sync_data'),
            'permission_callback' => array($this, 'verify_doctor_access')
        ));
    }

    public function verify_doctor_access() {
        return current_user_can('edit_posts');
    }

    public function get_patients($request) {
        $patients = get_posts(array(
            'post_type' => 'medical_patient',
            'posts_per_page' => -1
        ));

        return new WP_REST_Response($patients, 200);
    }

    public function sync_data($request) {
        $data = $request->get_json_params();
        
        // Process and store the synced data
        // Implementation depends on your data structure
        
        return new WP_REST_Response(array(
            'status' => 'success',
            'message' => 'Data synced successfully'
        ), 200);
    }
}

// Initialize the plugin
Medical_App_Integration::get_instance();